/* ===========================================================================
   game.js — игровая математика, визуальные эффекты и вспомогательная логика.
   Извлечено 1-в-1 из index.html (Фаза 1 рефакторинга).
   Зависит от: js/icons.js, js/config.js, js/sound.js, js/state.js
   =========================================================================== */

    function getGeneratorMilestoneMultiplier(count) {
      let milestoneMult = 1;
      if (count >= 25) milestoneMult *= 2;
      if (count >= 50) milestoneMult *= 2;
      if (count >= 75) milestoneMult *= 2;
      if (count >= 100) milestoneMult *= 4;
      if (count >= 150) milestoneMult *= 2;
      if (count >= 200) milestoneMult *= 4;
      return milestoneMult;
    }

    function getGeneratorCurrentRate(generatorId, state) {
      const config = GENERATORS_CONFIG[generatorId];
      if (!config) return 0;
      const count = state.run.generators[generatorId] || 0;
      if (count <= 0) return 0;
      return config.baseRate * count * getGeneratorMilestoneMultiplier(count);
    }

    function calculateTotalRate(state) {
      let baseTotalRate = 0;
      for (const id of GENERATOR_IDS) {
        baseTotalRate += getGeneratorCurrentRate(id, state);
      }
      const stars = state.meta.stars || 0;
      const locIdx = Math.min(Math.max(0, state.meta?.prestigeCount || 0), LOCATION_THEMES.length - 1);
      const activeLoc = LOCATION_THEMES[locIdx] || LOCATION_THEMES[0];
      const branchMultiplier = activeLoc.cpsMultiplier || 1.0;
      const prestigeMultiplier = branchMultiplier * (1 + stars * 0.10);
      const sauceLevel = state.meta?.shop?.creamSauce || 0;
      const shopSauceMultiplier = 1 + sauceLevel * 0.15;
      const meteorFlourMultiplier = 1 + (state.meta?.shop?.meteorFlour || 0) * 0.30;
      const nowMsTime = Date.now();
      const isAdBoosted = (state.boosts.adMultiplierExpiresAt || 0) > nowMsTime;
      const adMultiplier = isAdBoosted ? 2 : 1;
      const sugarMultiplier = ((state.boosts?.sugarRushExpiresAt || 0) > nowMsTime) ? 3 : 1;
      const sleepMultiplier = (typeof activeCatMood !== 'undefined' && activeCatMood === 'sleep' && nowMsTime < moodTimerEnd) ? 2.5 : 1;
      const orderRushMult = (state.boosts && state.boosts.orderRushTimer > 0) ? (Number(state.boosts.orderRushMultiplier) || 2.0) : 1.0;

      let wardrobeRateMult = 1.0;
      if (hasWardrobeUnlocked(state, 'chef_hat_2')) {
        wardrobeRateMult *= 1.03;
      }
      if (hasWardrobeUnlocked(state, 'flower_wreath')) {
        wardrobeRateMult *= 1.03;
      }
      if (hasWardrobeUnlocked(state, 'beret_royal')) {
        wardrobeRateMult *= 1.04;
      }
      if (hasWardrobeUnlocked(state, 'royal_crown') || hasWardrobeUnlocked(state, 'magic_tophat')) {
        wardrobeRateMult *= 1.05;
      }
      if (hasWardrobeUnlocked(state, 'gold_crown')) {
        wardrobeRateMult *= 1.06;
      }
      if (hasWardrobeUnlocked(state, 'neon_choker')) {
        wardrobeRateMult *= 1.05;
      }
      if (hasWardrobeUnlocked(state, 'astral_halo')) {
        wardrobeRateMult *= 1.10;
      }

      return Math.floor(baseTotalRate * prestigeMultiplier * shopSauceMultiplier * meteorFlourMultiplier * adMultiplier * sugarMultiplier * sleepMultiplier * orderRushMult * wardrobeRateMult);
    }

    function getCostWithDiscount(rawPrice, perkLevel = 0) {
      const discount = Math.min(0.05, Math.max(0, perkLevel) * 0.01);
      return rawPrice * (1 - discount);
    }

    function getSingleGeneratorCost(generatorId, state) {
      const config = GENERATORS_CONFIG[generatorId];
      if (!config) return Infinity;
      const count = state.run.generators[generatorId] || 0;
      const perkLevel = state.meta?.perks?.bulk_buy || 0;
      const rawCost = config.baseCost * Math.pow(config.costGrowthRate, count);
      return Math.floor(getCostWithDiscount(rawCost, perkLevel));
    }

    function getBatchCost(generatorId, countToBuy, state) {
      if (countToBuy <= 0) return 0;
      const config = GENERATORS_CONFIG[generatorId];
      if (!config) return Infinity;

      const k = state.run.generators[generatorId] || 0;
      const r = config.costGrowthRate;
      const perkLevel = state.meta?.perks?.bulk_buy || 0;
      const rawSum = config.baseCost * Math.pow(r, k) * ((Math.pow(r, countToBuy) - 1) / (r - 1));
      return Math.floor(getCostWithDiscount(rawSum, perkLevel));
    }

    function getMaxAffordable(generatorId, state) {
      const config = GENERATORS_CONFIG[generatorId];
      if (!config) return { count: 0, cost: 0, canAfford: false };

      const availableCookies = state.run.cookies;
      const singleCost = getSingleGeneratorCost(generatorId, state);
      if (availableCookies < singleCost) {
        return { count: 0, cost: singleCost, canAfford: false };
      }

      const k = state.run.generators[generatorId] || 0;
      const r = config.costGrowthRate;
      const perkLevel = state.meta?.perks?.bulk_buy || 0;
      const discountMultiplier = 1 - Math.min(0.05, Math.max(0, perkLevel) * 0.01);
      const currentStepBase = config.baseCost * Math.pow(r, k) * discountMultiplier;

      const argument = 1 + (availableCookies * (r - 1)) / currentStepBase;
      let maxCount = Math.floor(Math.log(Math.max(1, argument)) / Math.log(r));

      while (maxCount > 0 && getBatchCost(generatorId, maxCount, state) > availableCookies) {
        maxCount--;
      }
      while (getBatchCost(generatorId, maxCount + 1, state) <= availableCookies) {
        maxCount++;
      }

      if (maxCount <= 0) {
        return { count: 0, cost: singleCost, canAfford: false };
      }

      return { count: maxCount, cost: getBatchCost(generatorId, maxCount, state), canAfford: true };
    }

    function getBatchToMilestone(generatorId, state) {
      const config = GENERATORS_CONFIG[generatorId];
      if (!config) return { count: 0, cost: 0, canAfford: false };
      const currentLevel = state.run.generators[generatorId] || 0;
      const nextMilestone = MILESTONES.find((t) => t > currentLevel);
      if (!nextMilestone) return { count: 0, cost: getSingleGeneratorCost(generatorId, state), canAfford: false };
      const needed = nextMilestone - currentLevel;
      const cost = getBatchCost(generatorId, needed, state);
      const canAfford = state.run.cookies >= cost && needed > 0;
      return { count: needed, cost, canAfford };
    }

    function buyGenerator(generatorId, state, amount = 1) {
      let countToBuy = 0;
      let totalCost = 0;

      if (amount === 'max') {
        const affordable = getMaxAffordable(generatorId, state);
        countToBuy = affordable.count;
        totalCost = affordable.cost;
      } else {
        countToBuy = Math.max(0, Math.floor(Number(amount) || 0));
        totalCost = getBatchCost(generatorId, countToBuy, state);
      }

      if (countToBuy <= 0 || state.run.cookies < totalCost) {
        return { success: false, countBought: 0, totalCost: 0, milestoneSpiked: false };
      }

      const prevCount = state.run.generators[generatorId] || 0;
      const newCount = prevCount + countToBuy;

      state.run.cookies -= totalCost;
      state.run.generators[generatorId] = newCount;
      saveToLocal(state);

      const milestoneSpiked = MILESTONES.some(m => prevCount < m && newCount >= m);
      return { success: true, countBought: countToBuy, totalCost, milestoneSpiked };
    }

    function getGeneratorDisplayData(generatorId, state) {
      const config = GENERATORS_CONFIG[generatorId];
      if (!config) return null;

      const currentLevel = state.run.generators[generatorId] || 0;
      const nextCost = getSingleGeneratorCost(generatorId, state);
      const currentTotalRate = getGeneratorCurrentRate(generatorId, state);
      const canAfford = state.run.cookies >= nextCost;

      const nextMilestone = MILESTONES.find((threshold) => threshold > currentLevel) || null;
      let progress = 1;
      let progressText = '200/200';
      
      if (nextMilestone !== null) {
        const prevMilestone = [...MILESTONES].reverse().find((t) => t <= currentLevel) || 0;
        progress = Math.min(1, Math.max(0, (currentLevel - prevMilestone) / (nextMilestone - prevMilestone)));
        progressText = `${currentLevel}/${nextMilestone}`;
      } else {
        progressText = `${currentLevel}/200 (МАКС)`;
      }

      return {
        id: generatorId,
        name: config.name,
        currentLevel,
        nextCost,
        currentTotalRate,
        nextMilestone,
        milestoneProgress: progress,
        progressText,
        milestoneMult: getGeneratorMilestoneMultiplier(currentLevel),
        canAfford
      };
    }
    function getClickUpgradeCost(level) {
      return Math.floor(15 * Math.pow(1.12, Math.max(1, level) - 1));
    }

    function getClickPower(state) {
      const locIdx = Math.min(Math.max(0, state.meta?.prestigeCount || 0), LOCATION_THEMES.length - 1);
      const activeLoc = LOCATION_THEMES[locIdx] || LOCATION_THEMES[0];
      const locClickBonus = activeLoc.clickBonus || 0;
      // Перк «Память лапок»: сохраняет % прокачки клика после переезда
      const pawMemoryBonus = 1 + (state.meta?.perks?.paw_memory || 0) * 0.05;

      const basePower = ((1 + (state.meta.stars || 0)) * Math.max(1, state.run.clickLevel) + locClickBonus) * pawMemoryBonus;
      const perkMult = 1 + (state.meta?.perks?.strong_paws || 0);
      const pinMult = 1 + (state.meta?.shop?.goldenRollingPin || 0) * 0.15;
      
      let wardrobeClickMult = 1.0;
      if (hasWardrobeUnlocked(state, 'glasses_cool')) {
        wardrobeClickMult *= 1.05;
      }
      if (hasWardrobeUnlocked(state, 'red_bowtie')) {
        wardrobeClickMult *= 1.03;
      }
      if (hasWardrobeUnlocked(state, 'beret_royal')) {
        wardrobeClickMult *= 1.04;
      }
      if (hasWardrobeUnlocked(state, 'royal_crown') || hasWardrobeUnlocked(state, 'magic_tophat')) {
        wardrobeClickMult *= 1.05;
      }
      if (hasWardrobeUnlocked(state, 'ruby_collar')) {
        wardrobeClickMult *= 1.05;
      }
      if (hasWardrobeUnlocked(state, 'cyber_visor')) {
        wardrobeClickMult *= 1.08;
      }

      const clickUpgradesMult = perkMult * pinMult * wardrobeClickMult;
      const totalPassiveRate = calculateTotalRate(state);
      const synergyBonus = totalPassiveRate * 0.02; // 2% от общего пассивного дохода (CPS)
      let totalClickBeforeFever = (basePower + synergyBonus) * clickUpgradesMult;
      
      if (activeCatMood === 'purr' && Date.now() < moodTimerEnd) {
        totalClickBeforeFever *= 1.5; // Клик x1.5 во время мурчания
      }

      const feverComboMult = state.boosts.feverActive ? (state.boosts.feverBonusMultiplier || 0) : 0;
      const feverMult = state.boosts.feverActive ? (3 + feverComboMult) : 1;
      return Math.max(1, Math.floor(totalClickBeforeFever * feverMult));
    }

    function buyClickUpgrade(state) {
      const cost = getClickUpgradeCost(state.run.clickLevel);
      if (state.run.cookies < cost) return false;
      state.run.cookies -= cost;
      state.run.clickLevel += 1;
      saveToLocal(state);
      return true;
    }


    function spawnFloatingNumber(container, clientX, clientY, amount, isFever) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const el = document.createElement('div');
      el.className = `floating-number${isFever ? ' fever' : ''}`;
      el.textContent = `+${formatNumber(amount)}`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      // Разлёт влево или вправо на 12-28px, чтобы не закрывать кота
      const scatterX = (Math.random() - 0.5) * 45;
      el.style.setProperty('--dx', `${scatterX}px`);

      const cleanup = () => {
        if (el.parentNode === container) container.removeChild(el);
      };
      el.addEventListener('animationend', cleanup, { once: true });
      setTimeout(cleanup, 900);
      container.appendChild(el);
    }

    function spawnCrumbs(container, clientX, clientY) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const count = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const crumb = document.createElement('div');
        crumb.className = 'crumb-particle';
        const size = 5 + Math.random() * 5;
        crumb.style.width = `${size}px`;
        crumb.style.height = `${size}px`;
        crumb.style.left = `${x}px`;
        crumb.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const dist = 26 + Math.random() * 42;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        crumb.style.setProperty('--dx', `${dx}px`);
        crumb.style.setProperty('--dy', `${dy}px`);

        container.appendChild(crumb);
        setTimeout(() => {
          if (crumb.parentNode === container) crumb.remove();
        }, 350);
      }
    }

    let feverRemainingTimer = 0;
    let clickComboCounter = 0;
    let lastTapTime = 0;
    let comboResetTimer = null;

    let activeCatMood = null;
    let moodTimerEnd = 0;
    let petProgress = 0; // 0..100%
    let isPointerDownOnCat = false;
    let lastPetMoveX = 0;
    let lastPetMoveY = 0;
    let lastPetHeartTime = 0;
    let nextCatMoodTimestamp = Date.now() + (60 + Math.random() * 30) * 1000;

    function getComboMultiplier() {
      if (clickComboCounter >= 30) return 2.0;
      if (clickComboCounter >= 20) return 1.6;
      if (clickComboCounter >= 10) return 1.3;
      if (clickComboCounter >= 5) return 1.15;
      return 1.0;
    }

    function spawnPurrHeart(clientX, clientY) {
      const container = document.getElementById('floating-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const heart = document.createElement('div');
      heart.className = 'purr-heart-float';
      heart.style.left = `${clientX - rect.left}px`;
      heart.style.top = `${clientY - rect.top}px`;
      heart.innerHTML = getSvgIcon('heart', 24);
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 800);
    }

    function spawnFeverSpark() {
      const container = document.getElementById('fever-wrapper');
      if (!container) return;

      const spark = document.createElement('div');
      spark.className = 'fever-spark-particle';

      // Маленький размер мини-блесток: 2.5 - 4px
      const size = 2.5 + Math.random() * 2;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;

      // Появление в радиусе самого кольца
      const angle = Math.random() * Math.PI * 2;
      const radius = 68 + (Math.random() * 10 - 5);
      const startX = 50 + (Math.cos(angle) * radius / 1.7);
      const startY = 50 + (Math.sin(angle) * radius / 1.7);

      spark.style.left = `${startX}%`;
      spark.style.top = `${startY}%`;

      const driftX = (Math.random() - 0.5) * 8;
      const driftY = (Math.random() - 0.5) * 8;

      spark.style.setProperty('--dx', `${driftX}px`);
      spark.style.setProperty('--dy', `${driftY}px`);

      container.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }

    let activeCroissantAnimations = [];
    let nextCroissantSpawnTimer = 0.8;

    function clearAllCroissants() {
      activeCroissantAnimations.forEach(anim => {
        if (anim.el && anim.el.parentNode) anim.el.remove();
        if (anim.frameId) cancelAnimationFrame(anim.frameId);
      });
      activeCroissantAnimations = [];
    }

    function sliceCroissant(croissantEl, state, clientX, clientY) {
      const idx = activeCroissantAnimations.findIndex(a => a.el === croissantEl);
      if (idx === -1) return;
      const anim = activeCroissantAnimations[idx];
      if (anim.frameId) cancelAnimationFrame(anim.frameId);
      activeCroissantAnimations.splice(idx, 1);

      const rect = croissantEl.getBoundingClientRect();
      const posX = rect.left + rect.width / 2;
      const posY = rect.top + rect.height / 2;
      const container = document.getElementById('floating-container') || croissantEl.parentElement;

      // Раскалывание на 2 половины
      const halfL = document.createElement('div');
      halfL.className = 'fever-croissant-half left';
      halfL.style.left = `${rect.left - container.getBoundingClientRect().left}px`;
      halfL.style.top = `${rect.top - container.getBoundingClientRect().top}px`;
      halfL.style.setProperty('--dx', '-36px');
      halfL.style.setProperty('--dy', '-20px');
      halfL.style.setProperty('--rot', '-45deg');
      halfL.innerHTML = getSvgIcon('croissant', 40);

      const halfR = document.createElement('div');
      halfR.className = 'fever-croissant-half right';
      halfR.style.left = `${rect.left + 24 - container.getBoundingClientRect().left}px`;
      halfR.style.top = `${rect.top - container.getBoundingClientRect().top}px`;
      halfR.style.setProperty('--dx', '36px');
      halfR.style.setProperty('--dy', '-15px');
      halfR.style.setProperty('--rot', '50deg');
      halfR.innerHTML = getSvgIcon('croissant', 40);

      container.appendChild(halfL);
      container.appendChild(halfR);
      setTimeout(() => { halfL.remove(); halfR.remove(); }, 500);

      spawnCrumbs(container, posX, posY);
      croissantEl.remove();

      // Награда: 15x клик + продление лихорадки на 1.5с + прирост множителя +0.5x
      const critReward = getClickPower(state) * 15;
      state.run.cookies += critReward;
      state.run.lifetimeCookiesRun += critReward;
      state.stats.totalCookiesAllTime += critReward;

      const maxDur = getMaxFeverDuration(state);
      feverRemainingTimer = Math.min(maxDur, feverRemainingTimer + 1.5);
      state.boosts.feverBonusMultiplier = (state.boosts.feverBonusMultiplier || 0) + 0.5;

      SoundFX.playBuy(state.settings?.soundMuted);
      if (navigator.vibrate) navigator.vibrate(20);

      // Всплывающий крит-текст
      if (container) {
        const cRect = container.getBoundingClientRect();
        const fEl = document.createElement('div');
        fEl.className = 'floating-number crit';
        fEl.textContent = `+${formatNumber(critReward)} КРИТ!`;
        fEl.style.left = `${posX - cRect.left}px`;
        fEl.style.top = `${posY - cRect.top}px`;
        fEl.style.setProperty('--dx', `${(Math.random() - 0.5) * 35}px`);
        const cleanup = () => { if (fEl.parentNode === container) container.removeChild(fEl); };
        fEl.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 900);
        container.appendChild(fEl);
      }
    }

    function spawnFeverCroissant(state) {
      const clickZone = document.querySelector('.click-zone');
      if (!clickZone) return;
      const zoneRect = clickZone.getBoundingClientRect();

      const el = document.createElement('div');
      el.className = 'fever-croissant-entity';
      el.innerHTML = getSvgIcon('croissant', 40);

      const startX = 25 + Math.random() * (zoneRect.width - 70);
      const startY = zoneRect.height - 10;
      const apexY = 20 + Math.random() * (zoneRect.height * 0.35);
      const endX = Math.max(10, Math.min(zoneRect.width - 55, startX + (Math.random() - 0.5) * 120));
      const flightDuration = 1400 + Math.random() * 400; // 1.4 - 1.8 сек
      const rotationTotal = (Math.random() > 0.5 ? 1 : -1) * (260 + Math.random() * 200);

      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      clickZone.appendChild(el);

      let sliced = false;
      const onSlice = (e) => {
        if (sliced) return;
        sliced = true;
        sliceCroissant(el, state, e.clientX || startX, e.clientY || startY);
      };

      el.addEventListener('pointerdown', onSlice);
      el.addEventListener('pointerenter', (e) => {
        if (e.buttons > 0) onSlice(e);
      });

      const startTime = performance.now();
      const animObj = { el, frameId: null };

      function animateCroissant(now) {
        const elapsed = now - startTime;
        const p = elapsed / flightDuration;

        if (p >= 1) {
          el.remove();
          const i = activeCroissantAnimations.indexOf(animObj);
          if (i !== -1) activeCroissantAnimations.splice(i, 1);
          return;
        }

        // Баллистическая траектория: парабола t*(1-t)*4
        const curX = startX + (endX - startX) * p;
        const curY = startY - (startY - apexY) * (4 * p * (1 - p));
        const rot = rotationTotal * p;

        el.style.left = `${curX}px`;
        el.style.top = `${curY}px`;
        el.style.transform = `rotate(${rot}deg)`;

        animObj.frameId = requestAnimationFrame(animateCroissant);
      }

      animObj.frameId = requestAnimationFrame(animateCroissant);
      activeCroissantAnimations.push(animObj);
    }

    function triggerFeverMode(state) {
      try {
        clearCatMoodVisuals();
      } catch (e) {}

      nextCatMoodTimestamp = Date.now() + (60 + Math.random() * 30) * 1000;
      state.boosts.feverActive = true;
      state.stats.feverActivations = (state.stats.feverActivations || 0) + 1;
      state.boosts.feverProgress = 100;
      state.boosts.feverBonusMultiplier = 0;
      feverRemainingTimer = getMaxFeverDuration(state);
      nextCroissantSpawnTimer = 0.8;

      const wrapper = document.getElementById('fever-wrapper');
      if (wrapper) {
        wrapper.classList.add('fever-active');
      }

      SoundFX.playFever(state.settings?.soundMuted);
    }

    function processTap(state, container, clientX, clientY) {
      const now = performance.now();
      if (now - lastTapTime < 900) {
        clickComboCounter++;
      } else {
        clickComboCounter = 1;
      }
      lastTapTime = now;

      if (comboResetTimer) clearTimeout(comboResetTimer);
      comboResetTimer = setTimeout(() => {
        clickComboCounter = 0;
        const comboBadge = document.getElementById('combo-badge');
        if (comboBadge) comboBadge.classList.remove('active');
      }, 1000);

      if (Math.random() < 0.08) {
        spawnPurrHeart(clientX, clientY);
      }

      let power = getClickPower(state);
      // Перк «Хрустящий крит»: шанс критического клика x10
      const critLevel = state.meta?.perks?.crit_crust || 0;
      let isCrit = false;
      if (critLevel > 0 && Math.random() < Math.min(0.3, critLevel * 0.03)) {
        isCrit = true;
      }
      if (isCrit) power = Math.floor(power * 10);
      state.run.cookies += power;
      state.run.lifetimeCookiesRun += power;
      state.stats.totalCookiesAllTime += power;
      state.stats.totalClicks += 1;

      if (!state.boosts.feverActive) {
        const catnipLevel = state.meta?.shop?.catnip || 0;
        let feverGainMult = 1 + catnipLevel * 0.25;
        if (hasWardrobeUnlocked(state, 'love_hearts')) {
          feverGainMult *= 1.05;
        }
        if (activeCatMood === 'zoomies' && Date.now() < moodTimerEnd) {
          feverGainMult *= 2.0; // Удвоение скорости теста при тыгыдыке
        }
        state.boosts.feverProgress = Math.min(100, state.boosts.feverProgress + (4.0 * feverGainMult));
        if (state.boosts.feverProgress >= 100) {
          triggerFeverMode(state);
        }
      }

      SoundFX.playClick(state.settings.soundMuted);
      spawnFloatingNumber(container, clientX, clientY, power, state.boosts.feverActive);
      spawnCrumbs(container, clientX, clientY);
      return power;
    }

    function calculateOfflineProgress(state, overrideSeconds = null) {
      const now = Date.now();
      const firstStart = state.timestamps.firstStartTime || now;
      
      if (overrideSeconds === null && (now - firstStart) < 300 * 1000) {
        return { isEligible: false, baseEarned: 0, doubleEarned: 0, effectiveSeconds: 0 };
      }

      const lastSave = state.timestamps.lastSaveTime || now;
      const secondsAway = overrideSeconds !== null ? overrideSeconds : Math.floor((now - lastSave) / 1000);

      if (secondsAway < 60) {
        return { isEligible: false, baseEarned: 0, doubleEarned: 0, effectiveSeconds: 0 };
      }

      const capsHours = [4, 6, 8, 12];
      const perkLevel = state.meta?.perks?.cat_sleep || 0;
      const maxCapSeconds = (capsHours[Math.min(perkLevel, 3)] || 4) * 3600;
      const effectiveSeconds = Math.min(secondsAway, maxCapSeconds);

      const rate = calculateTotalRate(state);
      const baseEarned = Math.floor(effectiveSeconds * rate * 0.5);
      return {
        isEligible: baseEarned > 0,
        baseEarned,
        doubleEarned: baseEarned * 2,
        effectiveSeconds
      };
    }

    function checkAchievements(state, onUnlock) {
      if (!Array.isArray(state.meta.achievements)) {
        state.meta.achievements = [];
      }
      const set = new Set(state.meta.achievements);
      for (const ach of ACHIEVEMENTS_CONFIG) {
        if (!set.has(ach.id) && ach.isUnlocked(state)) {
          state.meta.achievements.push(ach.id);
          state.meta.fish += ach.rewardFish;
          saveToLocal(state);
          if (onUnlock) onUnlock(ach);
        }
      }
    }

/* === Экспорт === */
window.KotoApp = window.KotoApp || {};
Object.assign(window.KotoApp, {
  getGeneratorMilestoneMultiplier, getGeneratorCurrentRate, calculateTotalRate,
  getCostWithDiscount, getSingleGeneratorCost, getBatchCost, getMaxAffordable,
  getBatchToMilestone, buyGenerator, getGeneratorDisplayData,
  getClickUpgradeCost, getClickPower, buyClickUpgrade,
  spawnFloatingNumber, spawnCrumbs, getComboMultiplier, spawnPurrHeart,
  spawnFeverSpark, sliceCroissant, spawnFeverCroissant, triggerFeverMode,
  processTap, calculateOfflineProgress, checkAchievements, getAutoClickRate
});
window.getAutoClickRate = getAutoClickRate;

    function getAutoClickRate(state) {
      const lvl = state.meta?.perks?.auto_baker || 0;
      return Math.min(lvl * 2, 10);
    }