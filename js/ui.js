/* ===========================================================================
   ui.js — инициализация интерфейса, render-функции, модалки, игровой цикл tick,
   обработчики событий и интеграция с Яндекс Игры SDK.
   Извлечено 1-в-1 из index.html (Фаза 1 рефакторинга).

   ВАЖНО: весь код initGame перенесён целиком в IIFE, чтобы сохранить
   замыкания (state, tabPanes, appRoot и пр.) без изменений логики.
   Глобальные зависимости: window.getSvgIcon, window.SoundFX,
   window.createInitialState, window.saveToLocal, window.formatNumber,
   window.calculateTotalRate и все конфиги из window.*
   =========================================================================== */

(function () {
  'use strict';

    function initGame() {
      let state = loadFromLocal();
      window.state = state; // Доступ для консоли F12
      let subCookieAccumulator = 0;

      const appRoot = document.getElementById('app-root');
      const cookiesDisplay = document.getElementById('cookies-display');
      const rateDisplay = document.getElementById('rate-display');
      const mainCookieIcon = document.getElementById('main-cookie-icon');
      if (mainCookieIcon) {
        mainCookieIcon.innerHTML = getSvgIcon('cookie', 30);
      }
      const starsDisplay = document.getElementById('stars-display');
      const fishDisplay = document.getElementById('fish-display');
      const yarnDisplay = document.getElementById('yarn-display');

      const locationBadgeIcon = document.getElementById('location-badge-icon');
      const locationBadgeName = document.getElementById('location-badge-name');

      const catHeadLayer = document.getElementById('cat-head-layer');
      const catNeckLayer = document.getElementById('cat-neck-layer');

      const doughTarget = document.getElementById('dough-target');
      const feverWrapper = document.getElementById('fever-wrapper');
      const feverRingProgress = document.getElementById('fever-ring-progress');
      const floatingContainer = document.getElementById('floating-container');
      const btnUpgradeClick = document.getElementById('btn-upgrade-click');
      const clickCostDisplay = document.getElementById('click-cost-display');
      const clickLevelVal = document.getElementById('click-level-val');

      const btnAdBoost = document.getElementById('btn-ad-boost');
      const adBoostTimer = document.getElementById('ad-boost-timer');

      const btnOpenAchievements = document.getElementById('btn-open-achievements');
      const btnOpenSettings = document.getElementById('btn-open-settings');

      const tabButtons = document.querySelectorAll('.tab-btn');
      const tabPanes = {
        generators: document.getElementById('tab-content-generators'),
        prestige: document.getElementById('tab-content-prestige'),
        shop: document.getElementById('tab-content-shop'),
        wardrobe: document.getElementById('tab-content-wardrobe')
      };

      const batchButtons = document.querySelectorAll('.batch-btn');
      const batchContainer = document.getElementById('batch-container');

      const offlineModal = document.getElementById('offline-modal');
      const offlineTimeSpent = document.getElementById('offline-time-spent');
      const offlineCookiesAmount = document.getElementById('offline-cookies-amount');
      const offlineDoubleAmount = document.getElementById('offline-double-amount');
      const btnClaimOfflineBase = document.getElementById('btn-claim-offline-base');
      const btnClaimOfflineDouble = document.getElementById('btn-claim-offline-double');

      const achievementsModal = document.getElementById('achievements-modal');
      const achievementsModalList = document.getElementById('achievements-modal-list');
      const passportModalList = document.getElementById('passport-modal-list');
      const achTabButtons = document.querySelectorAll('.modal-tab-btn[data-ach-tab]');
      const btnCloseAchievements = document.getElementById('btn-close-achievements');

      const tutorialModal = document.getElementById('tutorial-modal');
      const tutorialIcon = document.getElementById('tutorial-icon');
      const tutorialTitle = document.getElementById('tutorial-title');
      const tutorialText = document.getElementById('tutorial-text');
      const btnCloseTutorial = document.getElementById('btn-close-tutorial');

      const settingsModal = document.getElementById('settings-modal');
      const btnCloseSettings = document.getElementById('btn-close-settings');
      const btnToggleSound = document.getElementById('btn-toggle-sound');
      const soundIconIndicator = document.getElementById('sound-icon-indicator');
      const btnToggleMusic = document.getElementById('btn-toggle-music');
      const musicIconIndicator = document.getElementById('music-icon-indicator');
      const btnPromptReset = document.getElementById('btn-prompt-reset');
      const resetConfirmActions = document.getElementById('reset-confirm-actions');
      const btnExecuteReset = document.getElementById('btn-execute-reset');
      const btnCancelReset = document.getElementById('btn-cancel-reset');

      const toastCard = document.getElementById('achievement-toast');
      const toastTitle = document.getElementById('toast-title');
      const toastBadgeSlot = document.getElementById('toast-badge-slot');
      const toastIconSlot = document.getElementById('toast-icon-slot');
      const toastRewardSlot = document.getElementById('toast-reward');

      const devAdd100k = document.getElementById('dev-add-100k');
      const devAdd10m = document.getElementById('dev-add-10m');
      const devAdd10b = document.getElementById('dev-add-10b');
      const devAdd1t = document.getElementById('dev-add-1t');
      const devAdd50Fish = document.getElementById('dev-add-50-fish');
      const devAdd5Stars = document.getElementById('dev-add-5-stars');
      const devAdd20Yarn = document.getElementById('dev-add-20-yarn');
      const devToggleFever = document.getElementById('dev-toggle-fever');
      const devUnlockWardrobe = document.getElementById('dev-unlock-wardrobe');
      const devSpawnFish = document.getElementById('dev-spawn-fish');
      const devSpawnBox = document.getElementById('dev-spawn-box');
      const devLoc0 = document.getElementById('dev-loc-0');
      const devLoc1 = document.getElementById('dev-loc-1');
      const devLoc2 = document.getElementById('dev-loc-2');
      const devTestOffline = document.getElementById('dev-test-offline');

      let currentBatchMode = '1';
      let autoClickAccumulator = 0;
      let purrComboValue = 0;
      let purrComboLastDecay = 0;
      let purrComboTapTimes = [];
      let ultraBakeActive = false;
      let ultraBakeRemaining = 0;
      const purrComboFillEl = document.getElementById('purr-combo-fill');
      const purrComboWrapEl = document.getElementById('purr-combo-wrap');
      const purrComboLabelEl = document.getElementById('purr-combo-label');
      let activeTabId = 'generators';
      let activeWardrobeSlot = 'head';
      let toastTimeoutId = null;

      function getCurrentLocationIndex(gameState) {
        const allTime = gameState.stats?.totalCookiesAllTime || 0;
        let activeIdx = 0;
        for (let i = 0; i < LOCATIONS_CONFIG.length; i++) {
          const loc = LOCATIONS_CONFIG[i];
          if (allTime >= loc.reqCookies) {
            activeIdx = i;
          }
        }
        return activeIdx;
      }

      function updateCatVisuals(gameState) {
        const stageIndex = Math.min(Math.max(0, gameState.meta?.prestigeCount || 0), LOCATIONS_CONFIG.length - 1);
        const locConfig = LOCATIONS_CONFIG[stageIndex] || LOCATIONS_CONFIG[0];

        const eqHeadId = gameState.meta?.wardrobe?.equippedHead || 'chef_hat_1';
        const eqNeckId = gameState.meta?.wardrobe?.equippedNeck || 'neck_none';
        const skinId = gameState.meta?.wardrobe?.selectedSkin || 'default';

        if (doughTarget) {
          CAT_SKINS_CATALOG.forEach(s => doughTarget.classList.remove(`cat-skin-${s.id}`));
          doughTarget.classList.add(`cat-skin-${skinId}`);
        }

        if (catHeadLayer) {
          const headItem = WARDROBE_CATALOG.head.find(i => i.id === eqHeadId);
          catHeadLayer.innerHTML = (headItem && headItem.svg) ? headItem.svg : '';
        }

        if (catNeckLayer) {
          const neckItem = WARDROBE_CATALOG.neck.find(i => i.id === eqNeckId);
          catNeckLayer.innerHTML = (neckItem && neckItem.svg) ? neckItem.svg : '';
        }

        for (let i = 0; i < LOCATIONS_CONFIG.length; i++) {
          appRoot.classList.remove(`theme-bakery-${i}`);
          if (LOCATIONS_CONFIG[i].bgClass) {
            appRoot.classList.remove(LOCATIONS_CONFIG[i].bgClass);
          }
        }
        appRoot.classList.add(`theme-bakery-${stageIndex}`);
        if (locConfig.bgClass) {
          appRoot.classList.add(locConfig.bgClass);
        }

        if (stageIndex === 3 || stageIndex === 4 || stageIndex === 5) {
          appRoot.classList.add('theme-dark');
        } else {
          appRoot.classList.remove('theme-dark');
        }

        if (locationBadgeIcon) locationBadgeIcon.innerHTML = locConfig.icon;
        if (locationBadgeName) locationBadgeName.textContent = locConfig.name;

        const feverRingPath = document.getElementById('fever-ring-progress');
        const feverRingBg = document.querySelector('.fever-ring .ring-bg');
        const feverRingSvg = document.querySelector('.fever-ring');
        if (feverRingPath) {
          feverRingPath.style.stroke = locConfig.ringColor || 'url(#feverGlowGrad)';
        }
        if (feverRingBg) {
          feverRingBg.style.stroke = locConfig.ringColor ? `${locConfig.ringColor}38` : 'rgba(180, 83, 9, 0.22)';
        }
        if (feverRingSvg) {
          feverRingSvg.style.filter = locConfig.ringFilter || 'none';
        }
      }

      function showTutorial(icon, title, text, btnText, onConfirm) {
        tutorialIcon.innerHTML = icon;
        tutorialTitle.innerHTML = title;
        tutorialText.innerHTML = text;
        btnCloseTutorial.textContent = btnText;
        tutorialModal.classList.remove('hidden');

        const handler = () => {
          tutorialModal.classList.add('hidden');
          btnCloseTutorial.removeEventListener('click', handler);
          if (onConfirm) onConfirm();
        };
        btnCloseTutorial.addEventListener('click', handler);
      }

      function showGenericToast(icon, badge, title, rewardHtml) {
        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toastIconSlot.innerHTML = icon;
        toastBadgeSlot.textContent = badge;
        toastTitle.textContent = title;
        toastRewardSlot.innerHTML = rewardHtml;
        toastCard.classList.remove('hidden');
        SoundFX.playBuy(state.settings.soundMuted);
        toastTimeoutId = setTimeout(() => {
          toastCard.classList.add('hidden');
          toastTimeoutId = null;
        }, 3500);
      }

      function showAchievementToast(ach) {
        showGenericToast(getSvgIcon('trophy', 20), 'Новое достижение!', ach.title, `+${ach.rewardFish} ${getFishIconSvg(16)}`);
      }

      function checkAndTriggerOffline(overrideSec = null) {
        const offlineData = calculateOfflineProgress(state, overrideSec);
        if (offlineData.isEligible) {
          offlineTimeSpent.textContent = formatTime(offlineData.effectiveSeconds, 'duration');
          offlineCookiesAmount.textContent = formatNumber(offlineData.baseEarned);
          offlineDoubleAmount.textContent = formatNumber(offlineData.doubleEarned);
          offlineModal.classList.remove('hidden');

          btnClaimOfflineBase.onclick = () => {
            state.run.cookies += offlineData.baseEarned;
            state.run.lifetimeCookiesRun += offlineData.baseEarned;
            state.stats.totalCookiesAllTime += offlineData.baseEarned;
            saveToLocal(state);
            offlineModal.classList.add('hidden');
            renderStaticUI();
          };

          btnClaimOfflineDouble.onclick = () => {
            state.run.cookies += offlineData.doubleEarned;
            state.run.lifetimeCookiesRun += offlineData.doubleEarned;
            state.stats.totalCookiesAllTime += offlineData.doubleEarned;
            saveToLocal(state);
            offlineModal.classList.add('hidden');
            renderStaticUI();
          };
        }
      }

      checkAndTriggerOffline();

      let squashTimer = null;
      const triggerSquash = () => {
        if (squashTimer) clearTimeout(squashTimer);
        doughTarget.classList.add('squash');
        squashTimer = setTimeout(() => {
          doughTarget.classList.remove('squash');
          squashTimer = null;
        }, 60);
      };

      const catMoodBubble = document.getElementById('cat-mood-bubble');

      function clearCatMoodVisuals() {
        activeCatMood = null;
        const target = document.getElementById('dough-target');
        const wrapper = document.getElementById('fever-wrapper');
        const bubble = document.getElementById('cat-mood-bubble');

        if (target) target.classList.remove('cat-blissful');
        if (wrapper) wrapper.classList.remove('sleep-active');
        if (bubble) bubble.classList.add('hidden');

        if (typeof zzzSpawnInterval !== 'undefined' && zzzSpawnInterval) {
          clearInterval(zzzSpawnInterval);
          zzzSpawnInterval = null;
        }
        if (typeof purrHeartsInterval !== 'undefined' && purrHeartsInterval) {
          clearInterval(purrHeartsInterval);
          purrHeartsInterval = null;
        }
      }

      let zzzSpawnInterval = null;

      function spawnZzzLetter() {
        if (activeCatMood !== 'sleep') return;
        const letterEl = document.createElement('div');
        letterEl.className = 'sleep-zzz-particle';
        const letters = ['z', 'Z', 'Zzz'];
        letterEl.textContent = letters[Math.floor(Math.random() * letters.length)];
        letterEl.style.fontSize = `${13 + Math.floor(Math.random() * 5)}px`;
        letterEl.style.top = '48px';
        letterEl.style.right = '46px';
        feverWrapper.appendChild(letterEl);
        setTimeout(() => letterEl.remove(), 1800);
      }

      const MOOD_CONFIG = {
        sleepDuration: 15000,
        purrDuration: 15000,
        petTimeout: 12000,
        petTaps: 5
      };

      let purrHeartsInterval = null;

      function spawnAmbientPurrHeart() {
        if (activeCatMood !== 'purr') return;
        const rect = doughTarget.getBoundingClientRect();
        const startX = rect.left + rect.width * (0.3 + Math.random() * 0.4);
        const startY = rect.top + rect.height * (0.3 + Math.random() * 0.4);
        spawnPurrHeart(startX, startY);
      }

      function updateMoodStatusPill() {
        if (!activeCatMood) {
          catMoodBubble.classList.add('hidden');
          return;
        }
        const remainingSec = Math.max(1, Math.ceil((moodTimerEnd - Date.now()) / 1000));
        catMoodBubble.classList.remove('hidden');

        if (activeCatMood === 'sleep') {
          catMoodBubble.classList.remove('interactive');
          catMoodBubble.innerHTML = `${getSvgIcon('cat_sleep', 15)} Спит: Выпечка x2.5 (${remainingSec}с)`;
        } else if (activeCatMood === 'purr') {
          catMoodBubble.classList.remove('interactive');
          catMoodBubble.innerHTML = `${getSvgIcon('heart', 15)} Мурчит: Клик x1.5 (${remainingSec}с)`;
        } else if (activeCatMood === 'pet' || activeCatMood === 'scratch') {
          catMoodBubble.classList.add('interactive');
          catMoodBubble.innerHTML = `${getSvgIcon('paw', 15)} Гладь котика! ${Math.floor(petProgress)}%`;
        }
      }

      function triggerCatMoodEvent(forcedType = null) {
        if (state.boosts.feverActive) return;

        // Полная очистка предыдущих интервалов перед установкой нового настроения
        if (zzzSpawnInterval) {
          clearInterval(zzzSpawnInterval);
          zzzSpawnInterval = null;
        }
        if (purrHeartsInterval) {
          clearInterval(purrHeartsInterval);
          purrHeartsInterval = null;
        }

        const events = ['purr', 'sleep', 'scratch'];
        const selectedMood = forcedType || events[Math.floor(Math.random() * events.length)];
        const now = Date.now();

        // Снимаем визуал, не затирая новое настроение
        const target = document.getElementById('dough-target');
        const wrapper = document.getElementById('fever-wrapper');
        if (target) target.classList.remove('cat-blissful');
        if (wrapper) wrapper.classList.remove('sleep-active');

        activeCatMood = selectedMood;

        if (activeCatMood === 'purr') {
          moodTimerEnd = now + MOOD_CONFIG.purrDuration;
          doughTarget.classList.add('cat-blissful');
          spawnAmbientPurrHeart();
          purrHeartsInterval = setInterval(spawnAmbientPurrHeart, 900);
        } else if (activeCatMood === 'sleep') {
          moodTimerEnd = now + MOOD_CONFIG.sleepDuration;
          feverWrapper.classList.add('sleep-active');
          spawnZzzLetter();
          zzzSpawnInterval = setInterval(spawnZzzLetter, 850);
        } else if (activeCatMood === 'scratch' || activeCatMood === 'pet') {
          activeCatMood = 'pet';
          moodTimerEnd = now + 15000; // 15 секунд на поглаживание
          petProgress = 0;
          doughTarget.classList.add('cat-blissful');
        }

        updateMoodStatusPill();
      }

      function completePetEvent() {
        activeCatMood = null;
        petProgress = 100;
        catMoodBubble.classList.remove('interactive');

        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);

        const givesYarn = Math.random() < 0.30;
        let rewardHtml = '';

        if (givesYarn) {
          state.meta.yarn += 1;
          rewardHtml = `Довольный мур! +1 ${getYarnIconSvg(15)}`;
        } else {
          const currentCps = calculateTotalRate(state);
          const rawCap = currentCps > 0 
            ? Math.min(currentCps * 45, Math.max(120, Math.floor(state.run.cookies * 0.06)))
            : getClickPower(state) * 20;
          const cookiesPrize = Math.max(60, Math.floor(rawCap));
          state.run.cookies += cookiesPrize;
          state.run.lifetimeCookiesRun += cookiesPrize;
          state.stats.totalCookiesAllTime += cookiesPrize;
          rewardHtml = `Довольный мур! +${formatNumber(cookiesPrize)} ${getSvgIcon('cookie', 15)}`;
        }

        catMoodBubble.innerHTML = rewardHtml;
        SoundFX.playFever(state.settings.soundMuted);

        setTimeout(() => {
          clearCatMoodVisuals();
          catMoodBubble.classList.add('hidden');
        }, 1400);

        saveToLocal(state);
        renderStaticUI();
      }

      function handleCatStroke(clientX, clientY) {
        if (activeCatMood !== 'pet' && activeCatMood !== 'scratch') return;
        if (!isPointerDownOnCat) return;

        const dist = Math.hypot(clientX - lastPetMoveX, clientY - lastPetMoveY);
        if (dist > 8) {
          lastPetMoveX = clientX;
          lastPetMoveY = clientY;

          petProgress = Math.min(100, petProgress + 1.25);
          updateMoodStatusPill();

          const now = performance.now();
          if (now - lastPetHeartTime > 260) {
            lastPetHeartTime = now;
            spawnPurrHeart(clientX, clientY);
            if (navigator.vibrate) navigator.vibrate(12);
          }

          if (petProgress >= 100) {
            isPointerDownOnCat = false;
            completePetEvent();
          }
        }
      }

      feverWrapper.addEventListener('pointerdown', (e) => {
        registerPurrTap();
        isPointerDownOnCat = true;
        lastPetMoveX = e.clientX;
        lastPetMoveY = e.clientY;

        try {
          const ripple = document.createElement('div');
          ripple.className = 'click-ripple';
          const fr = feverWrapper.getBoundingClientRect();
          const maxDim = Math.max(fr.width, fr.height);
          ripple.style.left = `${e.clientX - fr.left}px`;
          ripple.style.top = `${e.clientY - fr.top}px`;
          ripple.style.width = `${maxDim}px`;
          ripple.style.height = `${maxDim}px`;
          feverWrapper.appendChild(ripple);
          setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 500);
        } catch (err) {}

        triggerSquash();
        __ultraPatched = true;
        processTap(state, floatingContainer, e.clientX, e.clientY);
        checkAchievements(state, showAchievementToast);
        renderStaticUI();
      });

      window.addEventListener('pointermove', (e) => {
        if (isPointerDownOnCat) {
          handleCatStroke(e.clientX, e.clientY);
        }
      });

      window.addEventListener('pointerup', () => {
        isPointerDownOnCat = false;
      });

      window.addEventListener('pointercancel', () => {
        isPointerDownOnCat = false;
      });

      feverWrapper.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isPointerDownOnCat && e.touches[0]) {
          handleCatStroke(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: false });

      btnUpgradeClick.addEventListener('click', () => {
        if (buyClickUpgrade(state)) {
          SoundFX.playBuy(state.settings.soundMuted);
          renderStaticUI();
        }
      });

      btnAdBoost.addEventListener('click', () => {
        showRewardedAd(() => {
          const twentyMins = 20 * 60 * 1000;
          const currentExpiry = Math.max(Date.now(), state.boosts.adMultiplierExpiresAt || 0);
          state.boosts.adMultiplierExpiresAt = currentExpiry + twentyMins;
          SoundFX.playBuy(state.settings.soundMuted);
          saveToLocal(state);
          renderStaticUI();
          showGenericToast(getSvgIcon('lightning', 22), 'Множитель удвоен!', 'Выпечка x2 активна на 20 минут', 'Все доходы увеличены');
        });
      });

      // Механика 2: Мгновенный таймлапс (+2 часа выпечки)
      const btnTimelapse = document.getElementById('btn-timelapse-boost');
      const timelapseLabel = document.getElementById('timelapse-btn-label');

      if (btnTimelapse) {
        btnTimelapse.addEventListener('click', () => {
          const now = Date.now();
          if ((state.boosts.timelapseCooldownUntil || 0) > now) return;

          showRewardedAd(() => {
            const currentRate = calculateTotalRate(state);
            const clickPower = getClickPower(state);
            const earned = currentRate > 0 ? (currentRate * 7200) : (clickPower * 1200);

            state.run.cookies += earned;
            state.run.lifetimeCookiesRun += earned;
            state.stats.totalCookiesAllTime += earned;
            state.boosts.timelapseCooldownUntil = Date.now() + (20 * 60 * 1000); // 20 мин кд

            SoundFX.playFever(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
            showGenericToast(getSvgIcon('timelapse', 24), 'Машина времени!', '+2 часа выпечки начислено!', `+${formatNumber(earned)} ${getSvgIcon('cookie', 16)}`);
          });
        });
      }

      // Механика 3: Гарантированный призыв Посылки или Рыбки
      const btnSummonSpawner = document.getElementById('btn-summon-spawner');
      if (btnSummonSpawner) {
        btnSummonSpawner.addEventListener('click', () => {
          showRewardedAd(() => {
            const summonFish = Math.random() < 0.5;
            if (summonFish) {
              spawnFlyingFish();
              nextFishSpawnTimestamp = Date.now() + 1000 * getNextFishIntervalSec();
              showGenericToast(getFishIconSvg(22), 'Призыв улова!', 'Золотая рыбка выпрыгнула на экран!', 'Ловите скорее!');
            } else {
              hideMysteryBox();
              spawnSurpriseBox();
              nextBoxSpawnTimestamp = Date.now() + 1000 * getNextBoxIntervalSec();
              showGenericToast(getSvgIcon('box', 22), 'Посылка шефа!', 'Срочная доставка прибыла!', 'Стукните 3 раза!');
            }
            SoundFX.playBuy(state.settings.soundMuted);
          });
        });
      }

      // Механика 1: Логика Колеса фортуны
      const modalWheel = document.getElementById('modal-fortune-wheel');
      const btnOpenWheel = document.getElementById('btn-open-wheel');
      const btnCloseWheel = document.getElementById('btn-close-wheel');
      const btnSpinWheel = document.getElementById('btn-spin-wheel');
      const spinWheelBtnText = document.getElementById('spin-wheel-btn-text');
      const wheelCanvas = document.getElementById('fortune-wheel-canvas');

      const WHEEL_SECTORS = [
        { label: '+1 Рыбка', type: 'fish', val: 1, color: '#fef3c7', textCol: '#b45309' },
        { label: '300с выпечки', type: 'cookies', val: 300, color: '#fed7aa', textCol: '#9a3412' },
        { label: '+2 Клубка', type: 'yarn', val: 2, color: '#dcfce7', textCol: '#166534' },
        { label: 'Сахар x3 (30с)', type: 'sugar', val: 30, color: '#ffe4e6', textCol: '#be123c' },
        { label: '+3 Рыбки', type: 'fish', val: 3, color: '#fef9c3', textCol: '#854d0e' },
        { label: '600с выпечки', type: 'cookies', val: 600, color: '#ffedd5', textCol: '#c2410c' },
        { label: '+4 Клубка', type: 'yarn', val: 4, color: '#bbf7d0', textCol: '#14532d' },
        { label: '+1 Звезда', type: 'star', val: 1, color: '#fef08a', textCol: '#713f12' }
      ];

      let isWheelSpinning = false;
      let wheelCurrentRotation = 0;

      function drawFortuneWheel() {
        if (!wheelCanvas) return;
        const ctx = wheelCanvas.getContext('2d');
        const numSectors = WHEEL_SECTORS.length;
        const arc = (2 * Math.PI) / numSectors;
        const r = wheelCanvas.width / 2;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

        for (let i = 0; i < numSectors; i++) {
          const angle = i * arc;
          const sec = WHEEL_SECTORS[i];

          ctx.beginPath();
          ctx.fillStyle = sec.color;
          ctx.moveTo(r, r);
          ctx.arc(r, r, r - 6, angle, angle + arc);
          ctx.lineTo(r, r);
          ctx.fill();

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.save();
          const midAngle = angle + arc / 2;
          const normalizedAngle = (midAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
          const isFlipped = normalizedAngle > Math.PI / 2 && normalizedAngle < (3 * Math.PI) / 2;

          ctx.translate(r, r);
          ctx.rotate(midAngle);
          ctx.fillStyle = sec.textCol;
          ctx.font = 'bold 24px -apple-system, sans-serif';

          if (isFlipped) {
            // Переворачиваем текст на 180° в левой половине, чтобы надписи не были вверх ногами
            ctx.rotate(Math.PI);
            ctx.textAlign = 'left';
            ctx.fillText(sec.label, -r + 26, 8);
          } else {
            ctx.textAlign = 'right';
            ctx.fillText(sec.label, r - 26, 8);
          }

          ctx.restore();
        }

        // Центр барабана
        ctx.beginPath();
        ctx.fillStyle = '#ea580c';
        ctx.arc(r, r, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      function updateWheelBtnState() {
        const now = Date.now();
        const lastSpin = state.boosts.lastFreeWheelSpinTime || 0;
        const isFree = (now - lastSpin) >= (24 * 3600 * 1000);

        const wheelDot = document.getElementById('wheel-badge-dot');
        if (wheelDot) {
          wheelDot.style.display = isFree ? 'block' : 'none';
        }

        if (spinWheelBtnText) {
          if (isFree) {
            spinWheelBtnText.innerHTML = `${getSvgIcon('star', 16)} Крутить бесплатно`;
          } else {
            spinWheelBtnText.innerHTML = `${getSvgIcon('video_cam', 16)} Крутить за рекламу`;
          }
        }
      }

      function executeWheelSpin() {
        if (isWheelSpinning) return;
        isWheelSpinning = true;
        btnSpinWheel.disabled = true;

        // Расчёт выигрышного сектора (индекс 7 — Звезда: 5% шанс, остальные равномерно)
        let targetIndex = 0;
        const rnd = Math.random();
        if (rnd < 0.05) {
          targetIndex = 7; // Звезда
        } else if (rnd < 0.20) {
          targetIndex = 3; // Сахар x3
        } else {
          const normalPool = [0, 1, 2, 4, 5, 6];
          targetIndex = normalPool[Math.floor(Math.random() * normalPool.length)];
        }

        const numSectors = WHEEL_SECTORS.length;
        const sectorAngleDeg = 360 / numSectors;
        const extraTurns = 7 + Math.floor(Math.random() * 2);
        const targetDeg = (360 - (targetIndex * sectorAngleDeg) - (sectorAngleDeg / 2)) - 90;
        const finalRotation = wheelCurrentRotation + (extraTurns * 360) + ((targetDeg - (wheelCurrentRotation % 360) + 360) % 360);

        wheelCurrentRotation = finalRotation;
        wheelCanvas.style.transform = `rotate(${finalRotation}deg)`;

        SoundFX.playBuy(state.settings.soundMuted);

        // Мягкая реалистичная физика стрелки с плавным затуханием
        const arrowEl = document.querySelector('.wheel-arrow-pointer');
        const spinStartTime = performance.now();
        const spinDuration = 5300;
        let ratchetTimer = null;

        const triggerRatchetTick = () => {
          if (!isWheelSpinning) return;
          const elapsed = performance.now() - spinStartTime;
          if (elapsed >= spinDuration) return;

          SoundFX.playClick(state.settings.soundMuted);

          const progress = Math.min(1, elapsed / spinDuration);

          if (arrowEl) {
            // Мягкое отклонение: 9-10° на скорости и деликатные 3-5° на финише
            const angle = progress < 0.7 
              ? (8 + (1 - progress) * 3) 
              : Math.max(3, (1 - progress) * 12);
            
            arrowEl.style.transform = `translateX(-50%) rotate(${angle.toFixed(1)}deg)`;

            const returnDelay = progress < 0.7 ? 35 : 75;
            setTimeout(() => {
              if (arrowEl) {
                arrowEl.style.transform = 'translateX(-50%) rotate(0deg)';
              }
            }, returnDelay);
          }

          // Плавное нарастание интервала тиков без резких перепадов
          const nextDelay = 45 + Math.pow(progress, 2.8) * 620;
          ratchetTimer = setTimeout(triggerRatchetTick, nextDelay);
        };

        triggerRatchetTick();

        setTimeout(() => {
          if (ratchetTimer) clearTimeout(ratchetTimer);
          isWheelSpinning = false;
          btnSpinWheel.disabled = false;

          // Финальная мягкая фиксация с микро-колебанием в 1.5 градуса
          wheelCanvas.style.transform = `rotate(${finalRotation}deg)`;
          if (arrowEl) {
            arrowEl.style.transform = 'translateX(-50%) rotate(-1.5deg)';
            setTimeout(() => {
              if (arrowEl) arrowEl.style.transform = 'translateX(-50%) rotate(0deg)';
            }, 150);
          }

          const prize = WHEEL_SECTORS[targetIndex];
          let claimCallback = null;

          if (prize.type === 'fish') {
            boxRewardIcon.innerHTML = getFishIconSvg(48);
            boxRewardTitle.textContent = 'Приз Колеса фортуны!';
            boxRewardDesc.textContent = 'Стрелка указала на золотую чешуйку для редких артефактов Лавки!';
            boxRewardBadgeIcon.innerHTML = getFishIconSvg(24);
            boxRewardAmount.textContent = `+${prize.val} Золотая рыбка`;
            claimCallback = () => {
              state.meta.fish += prize.val; state.stats.fishCaught = (state.stats.fishCaught || 0) + prize.val;
            };
          } else if (prize.type === 'yarn') {
            boxRewardIcon.innerHTML = getYarnIconSvg(48);
            boxRewardTitle.textContent = 'Приз Колеса фортуны!';
            boxRewardDesc.textContent = 'Уютные изумрудные клубки пряжи для стильных нарядов и шапочек шефа!';
            boxRewardBadgeIcon.innerHTML = getYarnIconSvg(24);
            boxRewardAmount.textContent = `+${prize.val} Клубка пряжи`;
            claimCallback = () => {
              state.meta.yarn += prize.val;
            };
          } else if (prize.type === 'star') {
            boxRewardIcon.innerHTML = getSvgIcon('star', 48);
            boxRewardTitle.textContent = 'Королевский джекпот!';
            boxRewardDesc.textContent = 'Невероятная удача! Колесо подарило редчайшую постоянную Звезду Мишлен!';
            boxRewardBadgeIcon.innerHTML = getSvgIcon('star', 24);
            boxRewardAmount.textContent = `+${prize.val} Звезда Мишлен`;
            claimCallback = () => {
              state.meta.stars += prize.val;
              state.meta.lifetimeStars += prize.val;
            };
          } else if (prize.type === 'sugar') {
            boxRewardIcon.innerHTML = getSvgIcon('lightning', 48);
            boxRewardTitle.textContent = 'Сахарный раж!';
            boxRewardDesc.textContent = 'Колоссальный взрыв энергии! Доход всех пекарей увеличен в 3 раза на 30 секунд!';
            boxRewardBadgeIcon.innerHTML = getSvgIcon('lightning', 24);
            boxRewardAmount.textContent = 'Выпечка x3 на 30 секунд!';
            claimCallback = () => {
              state.boosts.sugarRushExpiresAt = Date.now() + (prize.val * 1000);
            };
          } else if (prize.type === 'cookies') {
            const currentCps = calculateTotalRate(state);
            const clickPower = getClickPower(state);
            const reward = currentCps > 0 ? (currentCps * prize.val) : (clickPower * (prize.val / 5));
            boxRewardIcon.innerHTML = getSvgIcon('cookie', 48);
            boxRewardTitle.textContent = 'Приз Колеса фортуны!';
            boxRewardDesc.textContent = `Горячий куш выпечки прямиком из жарочных печей за целых ${prize.val} секунд дохода!`;
            boxRewardBadgeIcon.innerHTML = getSvgIcon('cookie', 24);
            boxRewardAmount.textContent = `+${formatNumber(reward)} печенек`;
            claimCallback = () => {
              state.run.cookies += reward;
              state.run.lifetimeCookiesRun += reward;
              state.stats.totalCookiesAllTime += reward;
            };
          }

          modalWheel.classList.add('hidden');
          modalBoxReward.classList.remove('hidden');
          SoundFX.playFever(state.settings.soundMuted);

          btnClaimBoxReward.onclick = () => {
            if (claimCallback) claimCallback();
            modalBoxReward.classList.add('hidden');

            const rootRect = appRoot.getBoundingClientRect();
            triggerConfetti(rootRect.width / 2, rootRect.height / 2);

            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
            updateWheelBtnState();
          };
        }, 5400);
      }

      if (btnOpenWheel) {
        btnOpenWheel.addEventListener('click', () => {
          drawFortuneWheel();
          updateWheelBtnState();
          modalWheel.classList.remove('hidden');
        });
      }

      if (btnCloseWheel) {
        btnCloseWheel.addEventListener('click', () => {
          if (!isWheelSpinning) modalWheel.classList.add('hidden');
        });
      }

      if (btnSpinWheel) {
        btnSpinWheel.addEventListener('click', () => {
          if (isWheelSpinning) return;
          const now = Date.now();
          const lastSpin = state.boosts.lastFreeWheelSpinTime || 0;
          const isFree = (now - lastSpin) >= (24 * 3600 * 1000);

          if (isFree) {
            state.boosts.lastFreeWheelSpinTime = now;
            saveToLocal(state);
            executeWheelSpin();
          } else {
            showRewardedAd(() => {
              executeWheelSpin();
            });
          }
        });
      }
      let rainbowBubblesLeft = 0;

      function triggerRandomOrder(force = false) {
        if (state.boosts?.activeOrder) {
          if (force) {
            cancelActiveOrder();
          } else {
            return;
          }
        }

        const currentRate = Math.max(20, calculateTotalRate(state));
        const rand = Math.random();
        let diff = 'easy';
        let mult = 1.35;
        let dur = 35;
        let rewardFish = 0;
        let rewardCookiesSec = 45; // 45 сек текущего дохода
        let buffMult = 2.0;
        let buffDur = 15;

        if (rand < 0.55) {
          // Легкий: разгон на +30–50%
          diff = 'easy';
          mult = 1.30 + Math.random() * 0.20;
          dur = 35;
          rewardFish = 0;
          rewardCookiesSec = 45;
          buffMult = 2.0;
          buffDur = 15;
        } else if (rand < 0.85) {
          // Средний: разгон на +60–90%
          diff = 'medium';
          mult = 1.60 + Math.random() * 0.30;
          dur = 45;
          rewardFish = 0;
          rewardCookiesSec = 80;
          buffMult = 2.5;
          buffDur = 20;
        } else {
          // Королевский: разгон в 2–2.5 раза
          diff = 'hard';
          mult = 2.0 + Math.random() * 0.50;
          dur = 60;
          rewardFish = 1;
          rewardCookiesSec = 140;
          buffMult = 4.0;
          buffDur = 25;
        }

        state.boosts.activeOrder = {
          diff: diff,
          targetRate: Math.ceil(currentRate * mult),
          initialRate: currentRate,
          duration: dur,
          timeLeft: dur,
          rewardFish: rewardFish,
          rewardCookies: Math.floor(currentRate * rewardCookiesSec),
          buffMult: buffMult,
          buffDur: buffDur
        };

        renderOrderBadge();
      }

      function renderOrderBadge() {
        let badge = document.getElementById('urgent-order-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.id = 'urgent-order-badge';
          badge.className = 'urgent-order-badge';
          badge.innerHTML = `
            ${getSvgIcon('scroll', 26)}
            <div class="order-alert-dot"></div>
            <div class="order-mini-timer">
              <div id="order-mini-fill" class="order-mini-fill"></div>
            </div>
          `;
          badge.addEventListener('click', (e) => {
            e.stopPropagation();
            openOrderModal();
          });
          const clickZone = document.querySelector('.click-zone');
          if (clickZone) clickZone.appendChild(badge);
        }
        updateOrderUI();
      }

      function updateOrderUI() {
        const ord = state.boosts?.activeOrder;
        if (!ord) return;

        const fill = document.getElementById('order-mini-fill');
        if (fill && ord.duration > 0) {
          fill.style.width = `${Math.max(0, (ord.timeLeft / ord.duration) * 100)}%`;
        }

        const modalLiveRate = document.getElementById('order-modal-live-rate');
        const modalLiveTime = document.getElementById('order-modal-live-time');
        const currentRate = calculateTotalRate(state);

        if (modalLiveRate) {
          modalLiveRate.textContent = `${formatNumber(currentRate)}/сек`;
          modalLiveRate.style.color = currentRate >= ord.targetRate ? '#10b981' : '#b45309';
        }
        if (modalLiveTime) {
          modalLiveTime.textContent = `${Math.ceil(Math.max(0, ord.timeLeft))} сек`;
        }

        // Если цель достигнута — завершаем и сразу выходим
        if (currentRate >= ord.targetRate) {
          completeActiveOrder();
          return;
        }
      }

      function openOrderModal() {
        const ord = state.boosts.activeOrder;
        if (!ord) return;

        const currentRate = calculateTotalRate(state);
        const diffLabels = {
          easy: '<span class="order-difficulty-pill diff-easy">Легкий заказ</span>',
          medium: '<span class="order-difficulty-pill diff-medium">Особый заказ</span>',
          hard: '<span class="order-difficulty-pill diff-hard">Королевский челлендж</span>'
        };

        const overlay = document.createElement('div');
        overlay.id = 'order-modal-overlay';
        overlay.className = 'modal-backdrop';
        overlay.style.zIndex = '999';

        overlay.innerHTML = `
          <div class="order-modal-card">
            ${diffLabels[ord.diff]}
            <div style="font-size:1.15rem; font-weight:900; color:#1e293b;">Срочный контракт!</div>
            <div style="font-size:0.85rem; color:#475569; line-height:1.4;">
              Разгоните кухню до целевой скорости выпечки, докупая пекарей и прокачки:
            </div>
            
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px; display:flex; justify-content:space-around;">
              <div>
                <div style="font-size:0.75rem; color:#64748b;">Сейчас:</div>
                <div id="order-modal-live-rate" style="font-weight:900; font-size:1rem; color:#b45309;">${formatNumber(currentRate)}/сек</div>
              </div>
              <div style="border-left:1px solid #cbd5e1;"></div>
              <div>
                <div style="font-size:0.75rem; color:#64748b;">Нужно:</div>
                <div style="font-weight:900; font-size:1rem; color:#059669;">${formatNumber(ord.targetRate)}/сек</div>
              </div>
            </div>

            <div style="font-size:0.8rem; font-weight:700; color:#64748b;">
              Осталось времени: <span id="order-modal-live-time" style="color:#ef4444;">${Math.ceil(ord.timeLeft)} сек</span>
            </div>

            <div style="font-size:0.78rem; color:#64748b; background:#f8fafc; border:1.5px dashed #cbd5e1; padding:8px 12px; border-radius:12px; text-align:left; display:flex; flex-direction:column; gap:3px;">
              <div style="font-weight:800; color:#334155; display:flex; align-items:center; gap:5px;">
                ${getSvgIcon('lock', 14)}
                <span>Награда при выполнении:</span>
              </div>
              <div style="color:#475569; font-weight:700; display:flex; align-items:center; gap:4px;">
                ${getSvgIcon('cookie', 14)}
                <span>+${formatNumber(ord.rewardCookies)} печенек</span>
              </div>
              <div style="color:#0284c7; font-weight:700; display:flex; align-items:center; gap:4px;">
                ${getSvgIcon('lightning', 14)}
                <span>Выпечка х${ord.buffMult} на ${ord.buffDur || 15}с</span>
              </div>
              ${ord.rewardFish > 0 ? `
                <div style="color:#b45309; font-weight:800; display:flex; align-items:center; gap:4px;">
                  ${getFishIconSvg(15)}                   <span>+${ord.rewardFish} Золотая рыбка</span>
                </div>
              ` : ''}
            </div>

            <button id="btn-close-order-modal" style="background: linear-gradient(180deg, #f59e0b, #d97706); color:#fff; border:none; padding:11px; border-radius:12px; font-weight:900; font-size:0.9rem; cursor:pointer; box-shadow:0 3px 10px rgba(217,119,6,0.3);">
              Принять вызов!
            </button>
          </div>
        `;

        overlay.querySelector('#btn-close-order-modal').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
      }

      function completeActiveOrder() {
        const ord = state.boosts?.activeOrder;
        if (!ord) return;

        const fishGained = Number(ord.rewardFish) || 0;
        const cookiesGained = Number(ord.rewardCookies) || 0;
        const buffMult = Number(ord.buffMult) || 2.0;
        const buffDur = Number(ord.buffDur) || 20;

        if (fishGained > 0) { state.meta.fish = (state.meta.fish || 0) + fishGained; state.stats.fishCaught = (state.stats.fishCaught || 0) + fishGained; }
        state.run.cookies = (state.run.cookies || 0) + cookiesGained;
        state.stats.totalCookiesAllTime = (state.stats.totalCookiesAllTime || 0) + cookiesGained;

        state.boosts.orderRushMultiplier = buffMult;
        state.boosts.orderRushTimer = buffDur;

        state.boosts.activeOrder = null;
        state.boosts.nextOrderCooldown = 150 + Math.random() * 120;

        document.getElementById('urgent-order-badge')?.remove();
        document.getElementById('order-modal-overlay')?.remove();

        try {
          SoundFX.playBuy(state.settings?.soundMuted);
        } catch (e) {}

        saveToLocal(state);

        if (typeof renderStaticUI === 'function') renderStaticUI();
        else if (typeof updateUI === 'function') updateUI();

        showOrderCompleteScreen(fishGained, cookiesGained, buffMult, buffDur);
      }

      function showOrderCompleteScreen(rewardFish, rewardCookies, buffMult, buffDur) {
        const existing = document.getElementById('order-complete-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'order-complete-modal';
        overlay.className = 'order-complete-overlay';

        overlay.innerHTML = `
          <div class="order-complete-card">
            <div style="filter: drop-shadow(0 4px 12px rgba(245,158,11,0.35));">${getSvgIcon('scroll', 54)}</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #1e293b;">Контракт закрыт!</div>
            <div style="font-size: 0.86rem; color: #64748b; line-height: 1.4;">
              Отличный разгон кухни! Ваша заслуженная выплата:
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin: 4px 0;">
              <div class="order-reward-badge-pill" style="background: #fffbeb; border-color: #fde68a; color: #b45309;">
                ${getSvgIcon('cookie', 18)}
                <span>+${formatNumber(rewardCookies)} печенек</span>
              </div>
              <div class="order-reward-badge-pill" style="background: #f0fdf4; border-color: #86efac; color: #166534;">
                ${getSvgIcon('lightning', 18)}
                <span>Выпечка х${buffMult} на ${buffDur}с!</span>
              </div>
              ${rewardFish > 0 ? `
                <div class="order-reward-badge-pill" style="background: #fefce8; border-color: #facc15; color: #854d0e;">
                  <span>+${rewardFish}</span>
                  ${getFishIconSvg(18)}
                  <span>Золотая рыбка</span>
                </div>
              ` : ''}
            </div>

            <button id="btn-claim-order-reward" style="width: 100%; padding: 12px; background: linear-gradient(180deg, #f59e0b, #d97706); color: #ffffff; font-weight: 900; font-size: 1rem; border: none; border-radius: 14px; box-shadow: 0 4px 14px rgba(217,119,6,0.35); cursor: pointer;">
              Забрать награду!
            </button>
          </div>
        `;

        overlay.querySelector('#btn-claim-order-reward').addEventListener('click', () => {
          overlay.remove();
          SoundFX.playClick(state.settings?.soundMuted);
        });

        document.body.appendChild(overlay);
      }

      function cancelActiveOrder() {
        state.boosts.activeOrder = null;
        state.boosts.nextOrderCooldown = 120 + Math.random() * 60;
        document.getElementById('urgent-order-badge')?.remove();
        document.getElementById('order-modal-overlay')?.remove();
      }

      function startRainbowBubbleGame() {
        rainbowBubblesLeft = 5;
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'rainbow-bubble-target';
            bubble.style.left = `${15 + Math.random() * 70}%`;
            bubble.style.top = `${25 + Math.random() * 55}%`;
            bubble.innerHTML = getSvgIcon('bubble', 32);

            const onPop = (e) => {
              e.stopPropagation();
              e.preventDefault();
              bubble.remove();
              rainbowBubblesLeft--;
              SoundFX.playClick(state.settings?.soundMuted);
              if (rainbowBubblesLeft <= 0) {
                state.meta.yarn += 1;
                const rewardCookies = Math.max(1000, calculateTotalRate(state) * 1800);
                state.run.cookies += rewardCookies;
                state.stats.totalCookiesAllTime += rewardCookies;
                showGenericToast(getYarnIconSvg(20), 'Радужная магия!', 'Все пузыри лопнуты!', `+1 ${getYarnIconSvg(16)} +${formatNumber(rewardCookies)} ${getSvgIcon('cookie', 16)}`);
                saveToLocal(state);
                renderStaticUI();
              }
            };

            bubble.addEventListener('pointerdown', onPop);
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 6000);
          }, i * 350);
        }
      }

      let activeFlyingFish = null;

      function getNextFishIntervalSec() {
        const bellLvl = state.meta?.shop?.catBell || 0;
        const baseInterval = 60 + Math.random() * 30;
        return Math.max(45, baseInterval - bellLvl * 3);
      }

      let nextFishSpawnTimestamp = Date.now() + 1000 * getNextFishIntervalSec();

      function spawnFlyingFish() {
        if (activeFlyingFish && activeFlyingFish.parentNode) {
          activeFlyingFish.remove();
        }

        const isRainbow = Math.random() < 0.05;
        const fish = document.createElement('div');
        fish.className = 'flying-fish-entity' + (isRainbow ? ' rainbow-fish' : '');
        fish.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;"><use href="#universal-gold-fish" /></svg>`;
        if (isRainbow) {
          fish.style.filter = 'drop-shadow(0 0 10px #ec4899) drop-shadow(0 0 16px #06b6d4)';
        }

        const fromLeft = Math.random() > 0.5;
        const appWidth = Math.max(280, appRoot.clientWidth || 480);
        const topY = 70 + Math.random() * 90;
        const startX = fromLeft ? -70 : (appWidth + 70);
        const endX = fromLeft ? (appWidth + 70) : -70;

        fish.style.top = `${topY}px`;
        fish.style.left = `${startX}px`;
        if (!fromLeft) fish.style.transform = 'scaleX(-1)';

        appRoot.appendChild(fish);
        activeFlyingFish = fish;

        const startTime = performance.now();
        const duration = 5000;
        let animationFrameId = null;
        let lastSparkleTime = 0;

        function moveFish(currTime) {
          const elapsed = currTime - startTime;
          const p = Math.min(1, elapsed / duration);
          const curX = startX + (endX - startX) * p;
          const wobbleY = Math.sin(p * Math.PI * 4) * 12;
          const actualY = topY + wobbleY;

          fish.style.left = `${curX}px`;
          fish.style.top = `${actualY}px`;

          if (currTime - lastSparkleTime > 75) {
            lastSparkleTime = currTime;
            const sparkle = document.createElement('div');
            sparkle.className = 'fish-sparkle';
            const sparkleSize = 4 + Math.random() * 6;
            sparkle.style.width = `${sparkleSize}px`;
            sparkle.style.height = `${sparkleSize}px`;
            sparkle.style.left = `${curX + (fromLeft ? 4 : 40)}px`;
            sparkle.style.top = `${actualY + 16 + (Math.random() * 10 - 5)}px`;
            appRoot.appendChild(sparkle);
            setTimeout(() => {
              if (sparkle.parentNode) sparkle.remove();
            }, 450);
          }

          if (p < 1 && activeFlyingFish === fish) {
            animationFrameId = requestAnimationFrame(moveFish);
          } else {
            if (activeFlyingFish === fish) {
              fish.remove();
              activeFlyingFish = null;
            }
          }
        }
        animationFrameId = requestAnimationFrame(moveFish);

        const onCatch = (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          if (fish.parentNode) fish.remove();
          activeFlyingFish = null;

          SoundFX.playFever(state.settings.soundMuted);

          const rect = fish.getBoundingClientRect();
          const rootRect = appRoot.getBoundingClientRect();
          triggerConfetti(rect.left - rootRect.left + 23, rect.top - rootRect.top + 23);

          boxRewardIcon.innerHTML = getSvgIcon('fish', 48);
          boxRewardTitle.textContent = 'Золотая добыча!';
          boxRewardDesc.textContent = 'Редкая чешуйчатая красавица попалась в лапки!';
          boxRewardBadgeIcon.innerHTML = getFishIconSvg(24);
          boxRewardAmount.textContent = '+1 Золотая рыбка';

          modalBoxReward.classList.remove('hidden');

          btnClaimBoxReward.onclick = () => {
            state.meta.fish += 1; state.stats.fishCaught = (state.stats.fishCaught || 0) + 1; state.stats.boxesCaught = (state.stats.boxesCaught || 0) + 1;
            modalBoxReward.classList.add('hidden');
            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          };
        };

        fish.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (animationFrameId) cancelAnimationFrame(animationFrameId);

          const rect = fish.getBoundingClientRect();
          const rootRect = appRoot.getBoundingClientRect();
          triggerConfetti(rect.left - rootRect.left + 23, rect.top - rootRect.top + 23);

          if (fish.parentNode) fish.remove();
          activeFlyingFish = null;

          SoundFX.playFever(state.settings.soundMuted);

          if (isRainbow) {
            startRainbowBubbleGame();
            return;
          }

          let catchChance = 0.65;
          if (hasWardrobeUnlocked(state, 'devil_horns')) catchChance += 0.10;
          if (hasWardrobeUnlocked(state, 'gold_medal')) catchChance += 0.15;
          if (hasWardrobeUnlocked(state, 'star_pendant')) catchChance += 0.20;

          const isSuccess = Math.random() < catchChance;
          let claimCallback = null;

          if (isSuccess) {
            boxRewardIcon.innerHTML = getSvgIcon('fish', 48);
            boxRewardTitle.textContent = 'Золотая добыча!';
            boxRewardDesc.textContent = 'Редкая чешуйчатая красавица благополучно поймана в лапки!';
            boxRewardBadgeIcon.innerHTML = getFishIconSvg(24);
            boxRewardAmount.textContent = '+1 Золотая рыбка';

            claimCallback = () => {
              state.meta.fish += 1; state.stats.fishCaught = (state.stats.fishCaught || 0) + 1;
            };
          } else {
            const fallbackYarn = Math.random() < 0.4;
            if (fallbackYarn) {
              boxRewardIcon.innerHTML = getYarnIconSvg(48);
              boxRewardTitle.textContent = 'Рыбка выскользнула!';
              boxRewardDesc.textContent = 'Рыбка вильнула хвостом и уплыла, но обронила в воду клубок!';
              boxRewardBadgeIcon.innerHTML = getYarnIconSvg(24);
              boxRewardAmount.textContent = '+1 Клубок';

              claimCallback = () => {
                state.meta.yarn += 1;
              };
            } else {
              const currentCps = calculateTotalRate(state);
              const rawConsolation = currentCps > 0 
                ? Math.min(currentCps * 90, Math.max(100, Math.floor(state.run.cookies * 0.08)))
                : getClickPower(state) * 30;
              const consolation = Math.max(50, Math.floor(rawConsolation));
              boxRewardIcon.innerHTML = getSvgIcon('cookie', 48);
              boxRewardTitle.textContent = 'Рыбка сорвалась!';
              boxRewardDesc.textContent = 'Она уплыла в глубину, но подняла со дна корзинку свежей выпечки!';
              boxRewardBadgeIcon.innerHTML = getSvgIcon('cookie', 24);
              boxRewardAmount.textContent = `+${formatNumber(consolation)}`;

              claimCallback = () => {
                state.run.cookies += consolation;
                state.run.lifetimeCookiesRun += consolation;
                state.stats.totalCookiesAllTime += consolation;
              };
            }
          }

          modalBoxReward.classList.remove('hidden');

          btnClaimBoxReward.onclick = () => {
            if (claimCallback) claimCallback();
            modalBoxReward.classList.add('hidden');
            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          };
        });
      }

      const mysteryBoxEl = document.getElementById('mystery-box');
      const boxTapsLeftEl = document.getElementById('box-taps-left');
      const modalBoxReward = document.getElementById('modal-box-reward');
      const boxRewardIcon = document.getElementById('box-reward-icon');
      const boxRewardTitle = document.getElementById('box-reward-title');
      const boxRewardDesc = document.getElementById('box-reward-desc');
      const boxRewardBadgeIcon = document.getElementById('box-reward-badge-icon');
      const boxRewardAmount = document.getElementById('box-reward-amount');
      const btnClaimBoxReward = document.getElementById('btn-claim-box-reward');

      let boxTapsRemaining = 3;
      let boxDespawnTimeout = null;

      function getNextBoxIntervalSec() {
        return 90 + Math.random() * 50; // 90–140 сек
      }

      let nextBoxSpawnTimestamp = Date.now() + 1000 * getNextBoxIntervalSec();

      function triggerConfetti(centerX, centerY) {
        const colors = ['#FF5722', '#FF9800', '#FFD54F', '#10B981', '#E91E63', '#9C27B0'];
        for (let i = 0; i < 24; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti-piece';
          confetti.style.left = `${centerX}px`;
          confetti.style.top = `${centerY}px`;
          confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

          const angle = Math.random() * Math.PI * 2;
          const distance = 40 + Math.random() * 90;
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance - 20;
          const rot = `${Math.floor(Math.random() * 720 - 360)}deg`;

          confetti.style.setProperty('--dx', `${dx}px`);
          confetti.style.setProperty('--dy', `${dy}px`);
          confetti.style.setProperty('--rot', rot);

          appRoot.appendChild(confetti);
          setTimeout(() => {
            if (confetti.parentNode) confetti.remove();
          }, 650);
        }
      }

      function hideMysteryBox() {
        if (boxDespawnTimeout) {
          clearTimeout(boxDespawnTimeout);
          boxDespawnTimeout = null;
        }
        mysteryBoxEl.classList.add('hidden');
        mysteryBoxEl.classList.remove('shake');
        nextBoxSpawnTimestamp = Date.now() + 1000 * getNextBoxIntervalSec();
      }

      function spawnSurpriseBox() {
        if (!mysteryBoxEl) return;
        if (!mysteryBoxEl.classList.contains('hidden')) return;

        if (mysteryBoxEl.parentElement !== appRoot) {
          appRoot.appendChild(mysteryBoxEl);
        }

        boxTapsRemaining = 3;
        boxTapsLeftEl.textContent = '3';

        // Спавн строго в безопасной зоне: левее или ниже кнопок и квестов
        mysteryBoxEl.style.top = `${48 + Math.floor(Math.random() * 8)}%`;
        mysteryBoxEl.style.bottom = 'auto';
        mysteryBoxEl.style.left = '20px';
        mysteryBoxEl.style.right = 'auto';

        mysteryBoxEl.classList.remove('hidden');

        boxDespawnTimeout = setTimeout(() => {
          hideMysteryBox();
        }, 20000); // 20 сек
      }

      let sugarRushExpiresAt = 0;

      function openMysteryBoxReward() {
        const rect = mysteryBoxEl.getBoundingClientRect();
        const rootRect = appRoot.getBoundingClientRect();
        triggerConfetti(rect.left - rootRect.left + 27, rect.top - rootRect.top + 27);

        hideMysteryBox();
        SoundFX.playFever(state.settings.soundMuted);

        const roll = Math.random();
        let claimCallback = null;

        if (roll < 0.50) {
          // 50%: Щедрый мешок муки (350–500 сек текущего пассивного дохода)
          const currentCps = calculateTotalRate(state);
          const currentClick = getClickPower(state);
          const secondsYield = 350 + Math.random() * 150;
          const prize = currentCps > 0
            ? Math.max(300, Math.floor(currentCps * secondsYield))
            : Math.max(100, currentClick * 80);

          boxRewardIcon.innerHTML = getSvgIcon('cookie', 48);
          boxRewardTitle.textContent = 'Куш пекарни!';
          boxRewardDesc.textContent = 'В коробке оказался отборный запас муки высшего сорта от шефа!';
          boxRewardBadgeIcon.innerHTML = getSvgIcon('cookie', 22);
          boxRewardAmount.textContent = `+${formatNumber(prize)} печенек`;

          claimCallback = () => {
            state.run.cookies += prize;
            state.run.lifetimeCookiesRun += prize;
            state.stats.totalCookiesAllTime += prize;
          };
        } else if (roll < 0.75) {
          // 25%: Клубки мастерицы (2-4 шт. зелёной пряжи)
          const yarnCount = 2 + Math.floor(Math.random() * 3);

          boxRewardIcon.innerHTML = getYarnIconSvg(48);
          boxRewardTitle.textContent = 'Пряжа для шефа!';
          boxRewardDesc.textContent = 'Мягкие клубки изумрудной пряжи для новых нарядов и головных уборов!';
          boxRewardBadgeIcon.innerHTML = getYarnIconSvg(22);
          boxRewardAmount.textContent = `+${yarnCount} клубка`;

          claimCallback = () => {
            state.meta.yarn += yarnCount;
          };
        } else if (roll < 0.90) {
          // 15%: Сахарный раж (доход x3 на 20 сек)
          boxRewardIcon.innerHTML = getSvgIcon('lightning', 48);
          boxRewardTitle.textContent = 'Сахарный раж!';
          boxRewardDesc.textContent = 'Кондитеры поймали кулинарный экстаз! Выпечка всей пекарни увеличена в 3 раза на 20 секунд!';
          boxRewardBadgeIcon.innerHTML = getSvgIcon('lightning', 22);
          boxRewardAmount.textContent = 'Выпечка x3 на 20 секунд!';

          claimCallback = () => {
            state.boosts.sugarRushExpiresAt = Date.now() + 20000;
            saveToLocal(state);
            renderStaticUI();
          };
        } else {
          // 10%: Золотая чешуйка (1 Золотая рыбка)
          boxRewardIcon.innerHTML = getFishIconSvg(48);
          boxRewardTitle.textContent = 'Редкий улов!';
          boxRewardDesc.textContent = 'На самом дне коробки поблескивает драгоценная золотая рыбка для Лавки редкостей!';
          boxRewardBadgeIcon.innerHTML = getFishIconSvg(22);
          boxRewardAmount.textContent = '+1 Золотая рыбка';

          claimCallback = () => {
            state.meta.fish += 1; state.stats.fishCaught = (state.stats.fishCaught || 0) + 1;
          };
        }

        modalBoxReward.classList.remove('hidden');

        btnClaimBoxReward.onclick = () => {
          if (claimCallback) claimCallback();
          modalBoxReward.classList.add('hidden');
          SoundFX.playBuy(state.settings.soundMuted);
          saveToLocal(state);
          renderStaticUI();
        };
      }

      mysteryBoxEl.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();

        boxTapsRemaining--;
        mysteryBoxEl.classList.remove('shake');
        void mysteryBoxEl.offsetWidth;
        mysteryBoxEl.classList.add('shake');

        SoundFX.playClick(state.settings.soundMuted);
        boxTapsLeftEl.textContent = String(boxTapsRemaining);

        if (boxTapsRemaining <= 0) {
          openMysteryBoxReward();
        }
      });
      /* Обработчики Super-DevTools */
      devAdd100k.addEventListener('click', () => {
        const bonus = 100000;
        state.run.cookies += bonus;
        state.run.lifetimeCookiesRun += bonus;
        state.stats.totalCookiesAllTime += bonus;
        saveToLocal(state);
        renderStaticUI();
      });

      devAdd10m.addEventListener('click', () => {
        const bonus = 10000000;
        state.run.cookies += bonus;
        state.run.lifetimeCookiesRun += bonus;
        state.stats.totalCookiesAllTime += bonus;
        saveToLocal(state);
        renderStaticUI();
      });

      devAdd10b?.addEventListener('click', () => {
        const bonus = 10000000000;
        state.run.cookies += bonus;
        state.run.lifetimeCookiesRun += bonus;
        state.stats.totalCookiesAllTime += bonus;
        saveToLocal(state);
        renderStaticUI();
      });

      devAdd1t?.addEventListener('click', () => {
        const bonus = 1000000000000;
        state.run.cookies += bonus;
        state.run.lifetimeCookiesRun += bonus;
        state.stats.totalCookiesAllTime += bonus;
        saveToLocal(state);
        renderStaticUI();
      });

      devAdd50Fish.addEventListener('click', () => {
        state.meta.fish += 50;
        saveToLocal(state);
        renderStaticUI();
      });

      devAdd5Stars.addEventListener('click', () => {
        state.meta.stars += 5;
        state.meta.lifetimeStars += 5;
        saveToLocal(state);
        renderStaticUI();
      });

      devAdd20Yarn.addEventListener('click', () => {
        state.meta.yarn += 20;
        saveToLocal(state);
        renderStaticUI();
      });

      devToggleFever.addEventListener('click', () => {
        if (state.boosts.feverActive) {
          state.boosts.feverActive = false;
          state.boosts.feverProgress = 0;
          state.boosts.feverBonusMultiplier = 0;
          feverRemainingTimer = 0;
          clearAllCroissants();
        } else {
          triggerFeverMode(state);
        }
        renderStaticUI();
      });

      devUnlockWardrobe.addEventListener('click', () => {
        [...WARDROBE_CATALOG.head, ...WARDROBE_CATALOG.neck].forEach(item => {
          if (!state.meta.wardrobe.unlocked.includes(item.id)) {
            state.meta.wardrobe.unlocked.push(item.id);
          }
        });
        saveToLocal(state);
        renderStaticUI();
      });

      devSpawnFish.addEventListener('click', () => spawnFlyingFish());
      devSpawnBox.addEventListener('click', () => {
        if (typeof hideMysteryBox === 'function') hideMysteryBox();
        spawnSurpriseBox();
      });
      document.getElementById('dev-btn-order')?.addEventListener('click', () => {
        triggerRandomOrder(true);
        showGenericToast(getSvgIcon('scroll', 22), 'Срочный заказ!', 'Контракт призван через DevTools', 'Проверьте условия в углу');
      });
      document.getElementById('dev-mood-purr')?.addEventListener('click', () => {
        triggerCatMoodEvent('purr');
      });
      document.getElementById('dev-mood-pet')?.addEventListener('click', () => {
        triggerCatMoodEvent('scratch');
      });
      document.getElementById('dev-mood-sleep')?.addEventListener('click', () => {
        triggerCatMoodEvent('sleep');
      });

      function applyDevLocation(targetStage) {
        state.meta.prestigeCount = targetStage;
        const loc = LOCATIONS_CONFIG[targetStage] || LOCATIONS_CONFIG[0];
        
        if (targetStage === 0) {
          state.meta.wardrobe.equippedHead = 'chef_hat_1';
          state.meta.wardrobe.equippedNeck = 'neck_none';
        } else if (loc.rewardItem) {
          if (loc.rewardItem.head) {
            if (!state.meta.wardrobe.unlocked.includes(loc.rewardItem.head)) {
              state.meta.wardrobe.unlocked.push(loc.rewardItem.head);
            }
            state.meta.wardrobe.equippedHead = loc.rewardItem.head;
          }
          if (loc.rewardItem.neck) {
            if (!state.meta.wardrobe.unlocked.includes(loc.rewardItem.neck)) {
              state.meta.wardrobe.unlocked.push(loc.rewardItem.neck);
            }
            state.meta.wardrobe.equippedNeck = loc.rewardItem.neck;
          }
        }
        
        updateCatVisuals(state);
        saveToLocal(state);
        renderStaticUI();
      }

      devLoc0?.addEventListener('click', () => applyDevLocation(0));
      devLoc1?.addEventListener('click', () => applyDevLocation(1));
      devLoc2?.addEventListener('click', () => applyDevLocation(2));
      document.getElementById('dev-loc-3')?.addEventListener('click', () => applyDevLocation(3));
      document.getElementById('dev-loc-4')?.addEventListener('click', () => applyDevLocation(4));
      document.getElementById('dev-loc-5')?.addEventListener('click', () => applyDevLocation(5));

      devTestOffline.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        checkAndTriggerOffline(4 * 3600);
      });
      /* Навигация по вкладкам */
      tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          tabButtons.forEach((b) => b.classList.remove('active'));
          Object.values(tabPanes).forEach((pane) => pane.classList.remove('active'));

          btn.classList.add('active');
          const tabKey = btn.dataset.tab;
          activeTabId = tabKey;

          if (tabPanes[tabKey]) {
            tabPanes[tabKey].classList.add('active');
          }

          if (tabKey === 'generators') {
            batchContainer.classList.remove('invisible');
          } else {
            batchContainer.classList.add('invisible');
          }

          if (tabKey === 'prestige' && !state.tutorials.prestigeSeen) {
            showTutorial(
              getSvgIcon('star', 48),
              `${getSvgIcon('star', 22)} Новый филиал пекарни!`,
              'Переезд сбрасывает текущих нанятых пекарей, но награждает постоянными Звёздами Мишлен. Каждая звезда навсегда увеличивает базовый клик на +1 и повышает пассивный доход пекарни на +25%!',
              'Понятно!',
              () => {
                state.tutorials.prestigeSeen = true;
                saveToLocal(state);
              }
            );
          } else if (tabKey === 'shop' && !state.tutorials.shopSeen) {
            showTutorial(
              getFishIconSvg(48),
              `${getFishIconSvg(22)} Лавка редкостей!`,
              `Здесь можно обменять пойманные золотые рыбки на постоянные улучшения скорости Лихорадки, силы клика и помощи верных пекарей!`,
              'Замечательно!',
              () => {
                state.tutorials.shopSeen = true;
                saveToLocal(state);
              }
            );
          } else if (tabKey === 'wardrobe' && !state.tutorials.wardrobeSeen) {
            showTutorial(
              getYarnIconSvg(48),
              `${getYarnIconSvg(22)} Гардероб шефа!`,
              `Здесь за зелёные клубки пряжи можно примерить стильные головные уборы и шейные украшения. Все бонусы действуют навсегда за сам факт открытия, так что наряжайте котика в своё удовольствие!`,
              'Какая красота!',
              () => {
                state.tutorials.wardrobeSeen = true;
                saveToLocal(state);
              }
            );
          }

          renderStaticUI();
        });
      });

      batchButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          batchButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          currentBatchMode = btn.dataset.batch;
          renderGeneratorsList();
        });
      });


      function registerPurrTap() {
        if (purrComboTapTimes === null) return;
        const now = performance.now();
        purrComboTapTimes.push(now);
        // держим только последнюю секунду
        while (purrComboTapTimes.length && now - purrComboTapTimes[0] > 1000) purrComboTapTimes.shift();
        // если больше 4 кликов/сек — комбо растёт
        if (purrComboTapTimes.length > 4 && !ultraBakeActive) {
          purrComboValue = Math.min(100, purrComboValue + 12);
          updatePurrComboUI();
          if (purrComboValue >= 100) startUltraBake();
        }
      }

      function updatePurrComboUI() {
        if (purrComboFillEl) purrComboFillEl.style.width = purrComboValue + '%';
        if (purrComboLabelEl) {
          purrComboLabelEl.textContent = ultraBakeActive
            ? ('Ультра-Выпечка ' + Math.ceil(ultraBakeRemaining) + 'с')
            : (purrComboValue > 0 ? ('Мур-комбо ' + Math.round(purrComboValue) + '%') : 'Мур-комбо');
        }
        if (purrComboWrapEl) purrComboWrapEl.classList.toggle('ultra', ultraBakeActive);
      }

      function startUltraBake() {
        ultraBakeActive = true;
        ultraBakeRemaining = 10;
        purrComboValue = 100;
        document.body.classList.add('ultra-bake');
        if (SoundFX && SoundFX.setTempo) SoundFX.setTempo(85);
        if (SoundFX && SoundFX.playClick) SoundFX.playClick(state.settings?.soundMuted);
        updatePurrComboUI();
        showGenericToast(getSvgIcon('fire', 22), 'Ультра-Выпечка!', 'Клик x2 на 10 секунд!', 'Мур-комбо заполнено');
      }

      function endUltraBake() {
        ultraBakeActive = false;
        ultraBakeRemaining = 0;
        purrComboValue = 0;
        purrComboTapTimes = [];
        document.body.classList.remove('ultra-bake');
        if (SoundFX && SoundFX.resetTempo) SoundFX.resetTempo();
        updatePurrComboUI();
      }

      function renderGeneratorsList() {
        const targetContainer = tabPanes.generators;
        targetContainer.innerHTML = '';

        GENERATOR_IDS.forEach((id) => {
          const data = getGeneratorDisplayData(id, state);
          if (!data) return;

          let countToBuy = 1;
          let cost = data.nextCost;
          let canBuy = false;

          if (currentBatchMode === '10') {
            countToBuy = 10;
            cost = getBatchCost(id, 10, state);
            canBuy = state.run.cookies >= cost && cost > 0;
          } else if (currentBatchMode === 'milestone') {
            const mInfo = getBatchToMilestone(id, state);
            countToBuy = mInfo.count;
            cost = mInfo.cost;
            canBuy = mInfo.canAfford && mInfo.count > 0;
          } else if (currentBatchMode === 'max') {
            const maxInfo = getMaxAffordable(id, state);
            if (maxInfo.count > 0) {
              countToBuy = maxInfo.count;
              cost = maxInfo.cost;
              canBuy = state.run.cookies >= cost;
            } else {
              countToBuy = 1;
              cost = maxInfo.cost;
              canBuy = false;
            }
          } else {
            countToBuy = 1;
            cost = data.nextCost;
            canBuy = state.run.cookies >= cost && cost > 0;
          }

          const card = document.createElement('div');
          card.className = `generator-card${canBuy ? ' can-afford' : ''}`;
          card.dataset.cardGenId = id;

          const spikeBadge = data.milestoneMult > 1 
            ? `<span class="milestone-badge-spike">x${data.milestoneMult} СКОРОСТЬ!</span>` 
            : '';

          card.innerHTML = `
            <div class="generator-left">
              <div class="generator-avatar">${GENERATOR_ICONS[id] || getSvgIcon('paw', 24)}</div>
              <div class="generator-info">
                <div class="gen-title-row">
                  <span class="gen-name">${data.name} ${spikeBadge}</span>
                  <span class="gen-level-badge">ур. ${data.currentLevel}</span>
                </div>
                <div class="gen-rate">+${formatNumber(data.currentTotalRate)}/сек</div>
                <div class="milestone-progress-wrap">
                  <div class="milestone-bar-bg">
                    <div class="milestone-bar-fill" style="width: ${Math.round(data.milestoneProgress * 100)}%"></div>
                  </div>
                  <span class="milestone-text">${data.progressText}</span>
                </div>
              </div>
            </div>
            <button class="gen-buy-btn" data-gen-id="${id}" ${!canBuy ? 'disabled' : ''}>
              <span class="btn-buy-count">+${countToBuy}</span>
              <span class="btn-buy-cost">${getSvgIcon('cookie', 14)} ${formatNumber(cost)}</span>
            </button>
          `;

          const buyBtn = card.querySelector('.gen-buy-btn');
          buyBtn.addEventListener('click', () => {
            const result = buyGenerator(id, state, currentBatchMode === 'max' ? 'max' : countToBuy);
            if (result.success) {
              SoundFX.playBuy(state.settings.soundMuted);

              if (result.milestoneSpiked) {
                SoundFX.playFever(state.settings.soundMuted);
                card.classList.add('milestone-flash');
                setTimeout(() => card.classList.remove('milestone-flash'), 1000);
              }

              checkAchievements(state, showAchievementToast);
              renderStaticUI();
            }
          });

          targetContainer.appendChild(card);
        });
      }
      function performPrestige() {
        const rewardStars = calculatePrestigeReward(state);
        if (rewardStars <= 0) return;

        const prevPrestige = state.meta.prestigeCount || 0;

        state.meta.stars += rewardStars;
        state.meta.lifetimeStars += rewardStars;
        state.meta.prestigeCount += 1;

        if (state.meta.prestigeCount === 1) {
          state.meta.yarn += 5;
          if (!state.meta.wardrobe.unlocked.includes('chef_hat_2')) state.meta.wardrobe.unlocked.push('chef_hat_2');
          if (!state.meta.wardrobe.unlocked.includes('red_bowtie')) state.meta.wardrobe.unlocked.push('red_bowtie');
          state.meta.wardrobe.equippedHead = 'chef_hat_2';
          state.meta.wardrobe.equippedNeck = 'red_bowtie';
        } else if (state.meta.prestigeCount === 2) {
          state.meta.yarn += 10;
          if (!state.meta.wardrobe.unlocked.includes('beret_royal')) state.meta.wardrobe.unlocked.push('beret_royal');
          if (!state.meta.wardrobe.unlocked.includes('gold_medal')) state.meta.wardrobe.unlocked.push('gold_medal');
          state.meta.wardrobe.equippedHead = 'beret_royal';
          state.meta.wardrobe.equippedNeck = 'gold_medal';
        } else if (state.meta.prestigeCount >= 3) {
          state.meta.yarn += 15;
          const activeLocReward = LOCATIONS_CONFIG[Math.min(state.meta.prestigeCount, LOCATIONS_CONFIG.length - 1)]?.rewardItem;
          if (activeLocReward) {
            if (activeLocReward.head && !state.meta.wardrobe.unlocked.includes(activeLocReward.head)) {
              state.meta.wardrobe.unlocked.push(activeLocReward.head);
              state.meta.wardrobe.equippedHead = activeLocReward.head;
            }
            if (activeLocReward.neck && !state.meta.wardrobe.unlocked.includes(activeLocReward.neck)) {
              state.meta.wardrobe.unlocked.push(activeLocReward.neck);
              state.meta.wardrobe.equippedNeck = activeLocReward.neck;
            }
          }
        }

        const vanLevel = state.meta?.perks?.start_van || 0;

        state.run.cookies = 0;
        state.run.lifetimeCookiesRun = 0;
        state.run.clickLevel = 1;
        subCookieAccumulator = 0;

        for (const id of GENERATOR_IDS) {
          state.run.generators[id] = 0;
        }

        if (vanLevel > 0) {
          state.run.generators.lapkolap = vanLevel * 2;
        }

        updateCatVisuals(state);
        SoundFX.playFever(state.settings.soundMuted);
        saveToLocal(state);
        checkAchievements(state, showAchievementToast);
        renderStaticUI();

        if (prevPrestige === 0 && state.meta.prestigeCount === 1) {
          showTutorial(
            getSvgIcon('baker', 48),
            `${getSvgIcon('baker', 22)} Новый филиал: Городское кафе!`,
            'Поздравляем! Ваша пекарня вышла на городской уровень! Котику открылись высокий колпак шефа и шейная бабочка, а также начислено +5 зелёных клубков пряжи!',
            'Великолепно!'
          );
        } else if (prevPrestige === 1 && state.meta.prestigeCount >= 2) {
          showTutorial(
            getSvgIcon('crown', 48),
            `${getSvgIcon('crown', 22)} Новый филиал: Королевский дворец!`,
            'Триумф кондитерского искусства! На груди засиял золотой орден мастера с лапкой, открылся бархатный берет с пером и получено +10 зелёных клубков пряжи!',
            'Вперёд к новым вершинам!'
          );
        }
      }

      function renderPrestigeView() {
        const targetContainer = tabPanes.prestige;
        if (!targetContainer) return;
        targetContainer.innerHTML = '';

        // Прогресс считается от напеченного в этом забеге
        const runBaked = Math.max(state.run?.cookies || 0, state.run?.lifetimeCookiesRun || 0);
        const currentPrestige = state.meta?.prestigeCount || 0;
        const maxTier = LOCATIONS_CONFIG.length - 1;
        const isMaxBranch = currentPrestige >= maxTier;

        const targetLocIdx = Math.min(currentPrestige + 1, maxTier);
        const targetLoc = LOCATIONS_CONFIG[targetLocIdx] || LOCATIONS_CONFIG[0];

        const inspectorLvl = state?.meta?.perks?.generous_inspector || 0;
        const discountMult = 1 - Math.min(0.25, inspectorLvl * 0.05);
        const targetReq = isMaxBranch ? 1 : Math.max(1, Math.floor(targetLoc.reqCookies * discountMult));

        const progressPct = isMaxBranch ? 100 : Math.min(100, Math.max(0, Math.floor((runBaked / targetReq) * 100)));
        const neededToNext = Math.max(0, targetReq - runBaked);

        const starsByBranch = [0, 5, 15, 35, 75, 150];
        const rewardStars = starsByBranch[currentPrestige + 1] || 10;
        const canPrestige = !isMaxBranch && runBaked >= targetReq;

        const branchTitle = isMaxBranch ? `${targetLoc.name} (Макс. уровень)` : `Новый филиал: ${targetLoc.name}`;
        const currentStarsMult = Math.round((state.meta.stars || 0) * 10);

        const btnText = isMaxBranch 
          ? `Все филиалы открыты!` 
          : (canPrestige 
              ? `${getSvgIcon('crown', 15)} Открыть «${targetLoc.name}» (+${rewardStars} Звёзд)` 
              : `До переезда: ${formatNumber(neededToNext)} ${getSvgIcon('cookie', 14)}`);

        const banner = document.createElement('div');
        banner.className = 'prestige-banner';
        banner.innerHTML = `
          <div class="prestige-header-row">
            <div class="prestige-banner-title">
              <span>${getSvgIcon('star', 18)}</span>
              <span>${branchTitle}</span>
            </div>
            <div class="prestige-badge-mult">+${currentStarsMult}% выпечка / +${state.meta.stars || 0} к клику</div>
          </div>
          <div class="prestige-progress-box">
            <div class="prestige-progress-label">
              <span id="prestige-progress-text">${isMaxBranch ? 'Филиал максимального уровня' : `След. филиал: ${formatNumber(runBaked)} / ${formatNumber(targetReq)} (${progressPct}%)`}</span>
              <span id="prestige-progress-pct">${progressPct}%</span>
            </div>
            <div class="milestone-bar-bg" style="height: 5px;">
              <div id="prestige-bar-fill" class="milestone-bar-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>
          <button id="btn-do-prestige" class="btn-prestige-reset" ${!canPrestige ? 'disabled' : ''}>
            <span id="btn-do-prestige-text">${btnText}</span>
          </button>
        `;

        banner.querySelector('#btn-do-prestige').addEventListener('click', performPrestige);
        targetContainer.appendChild(banner);

        Object.values(PRESTIGE_PERKS_CONFIG).forEach((perk) => {
          const currentLevel = state.meta.perks[perk.id] || 0;
          const isMax = currentLevel >= perk.maxLevel;
          const cost = isMax ? 0 : perk.getCost(currentLevel);
          const canAfford = !isMax && state.meta.stars >= cost;

          const card = document.createElement('div');
          card.className = 'perk-card';
          card.innerHTML = `
            <div class="perk-left">
              <div class="perk-icon-wrap">${perk.icon}</div>
              <div class="perk-info">
                <div class="perk-title-row">
                  <span class="perk-title">${perk.name}</span>
                  <span class="perk-level">${currentLevel} / ${perk.maxLevel}</span>
                </div>
                <span class="perk-desc">${perk.desc}</span>
              </div>
            </div>
            <button class="perk-buy-btn" ${!canAfford || isMax ? 'disabled' : ''}>
              ${isMax ? 'МАКС' : `${getSvgIcon('star', 13)} ${cost}`}
            </button>
          `;

          const btn = card.querySelector('.perk-buy-btn');
          if (!isMax) {
            btn.addEventListener('click', () => {
              if (state.meta.stars >= cost) {
                state.meta.stars -= cost;
                state.meta.perks[perk.id] = currentLevel + 1;
                SoundFX.playBuy(state.settings.soundMuted);
                saveToLocal(state);
                renderStaticUI();
              }
            });
          }
          targetContainer.appendChild(card);
        });
      }
      function renderShopView() {
        const targetContainer = tabPanes.shop;
        const catnipLvl = state.meta?.shop?.catnip || 0;
        const pinLvl = state.meta?.shop?.goldenRollingPin || 0;
        const sauceLvl = state.meta?.shop?.creamSauce || 0;
        const bellLvl = state.meta?.shop?.catBell || 0;
        const jarLvl = state.meta?.shop?.fishJar || 0;

        const meteorLvl = state.meta?.shop?.meteorFlour || 0;
        const catnipCost = (catnipLvl + 1) * 3;
        const pinCost = (pinLvl + 1) * 6;
        const sauceCost = (sauceLvl + 1) * 10;
        const bellCost = (bellLvl + 1) * 5;
        const jarCost = (jarLvl + 1) * 8;
        const meteorCost = (meteorLvl + 1) * 15;

        const isBellMax = bellLvl >= 8;

        targetContainer.innerHTML = `
          <div class="shop-card">
            <div class="shop-card-left">
              <div class="shop-card-avatar">${getSvgIcon('herb', 26)}</div>
              <div class="shop-card-info">
                <div class="gen-title-row">
                  <span class="gen-name">Кошачья мята</span>
                  <span class="gen-level-badge">ур. ${catnipLvl}</span>
                </div>
                <span class="shop-card-desc">+25% к скорости Лихорадки</span>
              </div>
            </div>
            <button id="btn-shop-catnip" class="shop-buy-btn" ${state.meta.fish < catnipCost ? 'disabled' : ''}>
              ${catnipCost} ${getFishIconSvg(16)}
            </button>
          </div>

          <div class="shop-card">
            <div class="shop-card-left">
              <div class="shop-card-avatar">${getSvgIcon('pin', 26)}</div>
              <div class="shop-card-info">
                <div class="gen-title-row">
                  <span class="gen-name">Золотая скалка</span>
                  <span class="gen-level-badge">ур. ${pinLvl}</span>
                </div>
                <span class="shop-card-desc">+15% к клику и синергии</span>
              </div>
            </div>
            <button id="btn-shop-rolling-pin" class="shop-buy-btn" ${state.meta.fish < pinCost ? 'disabled' : ''}>
              ${pinCost} ${getFishIconSvg(16)}
            </button>
          </div>

          <div class="shop-card">
            <div class="shop-card-left">
              <div class="shop-card-avatar">${getSvgIcon('sauce', 26)}</div>
              <div class="shop-card-info">
                <div class="gen-title-row">
                  <span class="gen-name">Сливочный соус</span>
                  <span class="gen-level-badge">ур. ${sauceLvl}</span>
                </div>
                <span class="shop-card-desc">+15% к выпечке пекарей</span>
              </div>
            </div>
            <button id="btn-shop-cream-sauce" class="shop-buy-btn" ${state.meta.fish < sauceCost ? 'disabled' : ''}>
              ${sauceCost} ${getFishIconSvg(16)}
            </button>
          </div>

          <div class="shop-card">
            <div class="shop-card-left">
              <div class="shop-card-avatar">${getSvgIcon('bell', 26)}</div>
              <div class="shop-card-info">
                <div class="gen-title-row">
                  <span class="gen-name">Кошачий колокольчик</span>
                  <span class="gen-level-badge">${bellLvl} / 8</span>
                </div>
                <span class="shop-card-desc">Рыбка прилетает на 3 сек чаще</span>
              </div>
            </div>
            <button id="btn-shop-bell" class="shop-buy-btn" ${isBellMax || state.meta.fish < bellCost ? 'disabled' : ''}>
              ${isBellMax ? 'МАКС' : `${bellCost} ${getFishIconSvg(16)}`}
            </button>
          </div>

          <div class="shop-card">
            <div class="shop-card-left">
              <div class="shop-card-avatar">${getSvgIcon('jar', 26)}</div>
              <div class="shop-card-info">
                <div class="gen-title-row">
                  <span class="gen-name">Золотая банка</span>
                  <span class="gen-level-badge">ур. ${jarLvl}</span>
                </div>
                <span class="shop-card-desc">+2 сек к Лихорадке (${Math.round(getMaxFeverDuration(state))}с)</span>
              </div>
            </div>
            <button id="btn-shop-jar" class="shop-buy-btn" ${state.meta.fish < jarCost ? 'disabled' : ''}>
              ${jarCost} ${getFishIconSvg(16)}
            </button>
          </div>

          <div class="shop-card">
            <div class="shop-card-left">
              <div class="shop-card-avatar">${getSvgIcon('star', 26)}</div>
              <div class="shop-card-info">
                <div class="gen-title-row">
                  <span class="gen-name">Метеоритная мука</span>
                  <span class="gen-level-badge">ур. ${meteorLvl}</span>
                </div>
                <span class="shop-card-desc">+30% к общему доходу пекарни</span>
              </div>
            </div>
            <button id="btn-shop-meteor" class="shop-buy-btn" ${state.meta.fish < meteorCost ? 'disabled' : ''}>
              ${meteorCost} ${getFishIconSvg(16)}
            </button>
          </div>
        `;

        targetContainer.querySelector('#btn-shop-meteor')?.addEventListener('click', () => {
          if (state.meta.fish >= meteorCost) {
            state.meta.fish -= meteorCost;
            state.meta.shop.meteorFlour = (state.meta.shop.meteorFlour || 0) + 1;
            SoundFX.playBuy(state.settings?.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          }
        });

        targetContainer.querySelector('#btn-shop-catnip').addEventListener('click', () => {
          if (state.meta.fish >= catnipCost) {
            state.meta.fish -= catnipCost;
            state.meta.shop.catnip = (state.meta.shop.catnip || 0) + 1;
            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          }
        });

        targetContainer.querySelector('#btn-shop-rolling-pin').addEventListener('click', () => {
          if (state.meta.fish >= pinCost) {
            state.meta.fish -= pinCost;
            state.meta.shop.goldenRollingPin = (state.meta.shop.goldenRollingPin || 0) + 1;
            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          }
        });

        targetContainer.querySelector('#btn-shop-cream-sauce').addEventListener('click', () => {
          if (state.meta.fish >= sauceCost) {
            state.meta.fish -= sauceCost;
            state.meta.shop.creamSauce = (state.meta.shop.creamSauce || 0) + 1;
            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          }
        });

        const bellBtn = targetContainer.querySelector('#btn-shop-bell');
        if (!isBellMax) {
          bellBtn.addEventListener('click', () => {
            if (state.meta.fish >= bellCost) {
              state.meta.fish -= bellCost;
              state.meta.shop.catBell = (state.meta.shop.catBell || 0) + 1;
              SoundFX.playBuy(state.settings.soundMuted);
              saveToLocal(state);
              renderStaticUI();
            }
          });
        }

        targetContainer.querySelector('#btn-shop-jar').addEventListener('click', () => {
          if (state.meta.fish >= jarCost) {
            state.meta.fish -= jarCost;
            state.meta.shop.fishJar = (state.meta.shop.fishJar || 0) + 1;
            SoundFX.playBuy(state.settings.soundMuted);
            saveToLocal(state);
            renderStaticUI();
          }
        });
      }
      function renderWardrobeView() {
        const targetContainer = tabPanes.wardrobe;
        const currentSkin = state.meta?.wardrobe?.selectedSkin || 'default';

        let skinPillsHtml = `
          <div class="skin-palette-selector">
            <span style="font-size: 0.76rem; font-weight: 800; color: var(--color-text-main); margin-right: 4px;">Окрас:</span>
            <div style="display: flex; gap: 8px; align-items: center;">
        `;

        CAT_SKINS_CATALOG.forEach(skin => {
          const isActive = skin.id === currentSkin;
          skinPillsHtml += `
            <button class="skin-circle-btn ${isActive ? 'active' : ''}" 
                    data-skin-id="${skin.id}" 
                    title="${skin.name}" 
                    style="background: ${skin.color};"></button>
          `;
        });
        skinPillsHtml += `</div></div>`;

        targetContainer.innerHTML = `
          <div class="wardrobe-slots-nav">
            <button id="slot-tab-head" class="wardrobe-slot-tab ${activeWardrobeSlot === 'head' ? 'active' : ''}">Головные уборы</button>
            <button id="slot-tab-neck" class="wardrobe-slot-tab ${activeWardrobeSlot === 'neck' ? 'active' : ''}">Шея и аксессуары</button>
          </div>
          ${skinPillsHtml}
          <div class="wardrobe-grid" id="wardrobe-grid-content"></div>
        `;

        targetContainer.querySelectorAll('.skin-circle-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const skinId = btn.dataset.skinId;
            if (!state.meta.wardrobe) state.meta.wardrobe = {};
            state.meta.wardrobe.selectedSkin = skinId;

            if (navigator.vibrate) {
              navigator.vibrate(15);
            }

            saveToLocal(state);
            updateCatVisuals(state);
            renderWardrobeView();
          });
        });

        targetContainer.querySelector('#slot-tab-head').addEventListener('click', () => {
          activeWardrobeSlot = 'head';
          renderWardrobeView();
        });

        targetContainer.querySelector('#slot-tab-neck').addEventListener('click', () => {
          activeWardrobeSlot = 'neck';
          renderWardrobeView();
        });

        const grid = targetContainer.querySelector('#wardrobe-grid-content');
        const items = WARDROBE_CATALOG[activeWardrobeSlot] || [];
        const unlocked = new Set(state.meta?.wardrobe?.unlocked || []);
        const currentStage = state.meta?.prestigeCount || 0;
        const equippedCurrent = activeWardrobeSlot === 'head' 
          ? state.meta?.wardrobe?.equippedHead 
          : state.meta?.wardrobe?.equippedNeck;

        items.forEach((item) => {
          const isUnlocked = unlocked.has(item.id);
          const isEquipped = equippedCurrent === item.id;
          const canAfford = state.meta.yarn >= item.cost;
          const isStageLocked = (item.unlockStage !== undefined && currentStage < item.unlockStage);

          const card = document.createElement('div');
          card.className = `wardrobe-card${isEquipped ? ' equipped' : ''}`;

          let btnClass = 'buy';
          let btnText = item.cost === 0 ? 'Получить' : `Купить ${item.cost} ${getYarnIconSvg(14)}`;
          let btnDisabled = false;

          // Стало:
          /* ЖЁСТКАЯ БЛОКИРОВКА ПРЕСТИЖНЫХ ШАПОК И АКСЕССУАРОВ */
          if (isStageLocked) {
            btnClass = 'loc-locked';
            btnText = `${getSvgIcon('lock', 13)} Локация ${item.unlockStage + 1}`;
            btnDisabled = true;
          } else if (item.isBase) {
            btnClass = 'base-locked';
            btnText = 'По умолчанию ✓';
            btnDisabled = true;
          } else if (isEquipped) {
            /* Кнопка «Снять ✕» доступна ТОЛЬКО на надетых купленных/престижных вещах */
            btnClass = 'unequip';
            btnText = 'Снять ✕';
          } else if (isUnlocked) {
            btnClass = 'equip';
            btnText = 'Надеть';
          } else {
            btnDisabled = !canAfford;
          }

          let previewContent = item.icon || getSvgIcon('bow', 28);
          if (item.iconSvg) {
            previewContent = `<svg width="34" height="34" viewBox="0 0 28 24"><use href="#${item.iconSvg}" /></svg>`;
          }

          card.innerHTML = `
            <div class="wardrobe-preview">${previewContent}</div>
            <div class="wardrobe-title">${item.name}</div>
            <div class="wardrobe-bonus-badge">${item.bonusDesc}</div>
            <div class="wardrobe-desc">${item.desc}</div>
            <button class="wardrobe-btn ${btnClass}" ${btnDisabled ? 'disabled' : ''}>${btnText}</button>
          `;

          const btn = card.querySelector('.wardrobe-btn');
          btn.addEventListener('click', () => {
            if (isStageLocked) return;
            if (item.isBase && isEquipped) return;

            if (isEquipped) {
              /* Снятие аксессуара мгновенно возвращает слот к базовому виду */
              if (activeWardrobeSlot === 'head') {
                state.meta.wardrobe.equippedHead = 'chef_hat_1';
              } else {
                state.meta.wardrobe.equippedNeck = 'neck_none';
              }
              SoundFX.playClick(state.settings.soundMuted);
              saveToLocal(state);
              updateCatVisuals(state);
              renderWardrobeView();
            } else if (isUnlocked) {
              if (activeWardrobeSlot === 'head') {
                state.meta.wardrobe.equippedHead = item.id;
              } else {
                state.meta.wardrobe.equippedNeck = item.id;
              }
              SoundFX.playBuy(state.settings.soundMuted);
              saveToLocal(state);
              updateCatVisuals(state);
              renderWardrobeView();
            } else {
              if (state.meta.yarn >= item.cost) {
                state.meta.yarn -= item.cost;
                if (!state.meta.wardrobe.unlocked.includes(item.id)) {
                  state.meta.wardrobe.unlocked.push(item.id);
                }
                if (activeWardrobeSlot === 'head') {
                  state.meta.wardrobe.equippedHead = item.id;
                } else {
                  state.meta.wardrobe.equippedNeck = item.id;
                }
                SoundFX.playFever(state.settings.soundMuted);
                saveToLocal(state);
                updateCatVisuals(state);
                renderStaticUI();
                showGenericToast(getSvgIcon('bow', 20), 'Гардероб шефа!', `Открыто: ${item.name}!`, `${item.bonusDesc} активен!`);
              }
            }
          });

          grid.appendChild(card);
        });
      }
      function renderAchievementsModal() {
        achievementsModalList.innerHTML = '';
        const unlockedSet = new Set(Array.isArray(state.meta?.achievements) ? state.meta.achievements : []);

        const total = ACHIEVEMENTS_CONFIG.length;
        const done = unlockedSet.size;
        const header = document.createElement('div');
        header.className = 'ach-progress-header';
        header.innerHTML = '<div class="ach-progress-title">Открыто ' + done + ' из ' + total + ' достижений</div>' +
          '<div class="ach-progress-bar-bg"><div class="ach-progress-bar-fill" style="width:' + Math.round((done/total)*100) + '%"></div></div>';
        achievementsModalList.appendChild(header);

        ACHIEVEMENTS_CONFIG.forEach((ach) => {
          const isDone = unlockedSet.has(ach.id);
          const goal = ach.goal || 1;
          let cur = 0;
          try { cur = ach.getProgress ? ach.getProgress(state) : (isDone ? goal : 0); } catch (e) { cur = 0; }
          cur = Math.max(0, Math.min(cur, goal));
          const pct = Math.round((cur / goal) * 100);
          const fmt = (v) => {
            if (v >= 1e9) return (v/1e9).toFixed(v % 1e9 === 0 ? 0 : 1) + ' млрд';
            if (v >= 1e6) return (v/1e6).toFixed(v % 1e6 === 0 ? 0 : 1) + ' млн';
            if (v >= 1e3) return (v/1e3).toFixed(v % 1e3 === 0 ? 0 : 1) + ' тыс';
            return String(Math.floor(v));
          };
          const item = document.createElement('div');
          item.className = 'achievement-item' + (isDone ? ' unlocked' : '');
          item.innerHTML = `
            <div class="ach-left">
              <div class="ach-icon">${ach.icon}</div>
              <div class="ach-texts">
                <span class="ach-title">${ach.title}</span>
                <span class="ach-desc">${ach.desc}</span>
                ${isDone ? '' : `<div class="ach-progress-wrap"><div class="ach-mini-bar-bg"><div class="ach-mini-bar-fill" style="width:${pct}%"></div></div><span class="ach-progress-text">${fmt(cur)} / ${fmt(goal)}</span></div>`}
              </div>
            </div>
            <div class="ach-status-badge ${isDone ? 'done' : 'locked'}">
              ${isDone ? '✓ Выполнено' : `+${ach.rewardFish} ${getFishIconSvg(15)}`}
            </div>
          `;
          achievementsModalList.appendChild(item);
        });
      }

      function renderBakerPassport() {
        if (!passportModalList) return;
        passportModalList.innerHTML = '';
        const totalTime = Math.floor(state.stats?.playTimeSeconds || 0);
        const hrs = Math.floor(totalTime / 3600);
        const mins = Math.floor((totalTime % 3600) / 60);
        const secs = totalTime % 60;
        const timeStr = hrs > 0 ? (hrs + ' ч ' + mins + ' мин') : (mins > 0 ? (mins + ' мин ' + secs + ' с') : (secs + ' с'));
        const clickPower = getClickPower(state);
        const passiveRate = calculateTotalRate(state);
        const passiveMult = getComboMultiplier ? 1 : 1;
        const critLvl = state.meta?.perks?.crit_crust || 0;
        const stats = [
          { label: 'Время в игре', value: timeStr, icon: 'clock' },
          { label: 'Всего испечено', value: formatNumber(state.stats?.totalCookiesAllTime || 0), icon: 'cookie' },
          { label: 'Всего кликов', value: formatNumber(state.stats?.totalClicks || 0), icon: 'paw' },
          { label: 'Поймано рыбок', value: formatNumber(state.stats?.fishCaught || 0), icon: 'fish' },
          { label: 'Открыто посылок', value: formatNumber(state.stats?.boxesCaught || 0), icon: 'box' },
          { label: 'Переездов (престиж)', value: String(state.meta?.prestigeCount || 0), icon: 'star' },
          { label: 'Сила клика', value: formatNumber(clickPower) + ' за клик', icon: 'lightning' },
          { label: 'Пассивный доход', value: formatNumber(passiveRate) + '/сек', icon: 'timelapse' },
          { label: 'Шанс крита', value: Math.round(Math.min(0.3, critLvl * 0.03) * 100) + '% (x10)', icon: 'fire' }
        ];
        const wrap = document.createElement('div');
        wrap.className = 'passport-grid';
        stats.forEach((st) => {
          const card = document.createElement('div');
          card.className = 'passport-card';
          card.innerHTML = `
            <div class="passport-card-icon">${getSvgIcon(st.icon, 22)}</div>
            <div class="passport-card-text">
              <span class="passport-card-label">${st.label}</span>
              <span class="passport-card-value">${st.value}</span>
            </div>
          `;
          wrap.appendChild(card);
        });
        passportModalList.appendChild(wrap);
      }

      btnOpenAchievements.addEventListener('click', () => {
          achTabButtons.forEach((b) => b.classList.remove('active'));
          if (achTabButtons[0]) achTabButtons[0].classList.add('active');
          if (passportModalList) passportModalList.classList.add('hidden');
          if (achievementsModalList) achievementsModalList.classList.remove('hidden');
        renderAchievementsModal();
        achievementsModal.classList.remove('hidden');
      });


      achTabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          achTabButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const tab = btn.dataset.achTab;
          if (tab === 'passport') {
            renderBakerPassport();
            achievementsModalList.classList.add('hidden');
            if (passportModalList) passportModalList.classList.remove('hidden');
          } else {
            renderAchievementsModal();
            if (passportModalList) passportModalList.classList.add('hidden');
            achievementsModalList.classList.remove('hidden');
          }
        });
      });

      btnCloseAchievements.addEventListener('click', () => {
        achievementsModal.classList.add('hidden');
      });

      btnOpenSettings.addEventListener('click', () => {
        resetConfirmActions.style.display = 'none';
        btnPromptReset.style.display = 'block';
        settingsModal.classList.remove('hidden');
      });

      const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
      if (btnToggleFullscreen) {
        btnToggleFullscreen.addEventListener('click', () => {
          const docEl = document.documentElement;
          const isFull = document.fullscreenElement || document.webkitFullscreenElement;
          if (!isFull) {
            if (docEl.requestFullscreen) {
              try { docEl.requestFullscreen(); } catch (e1) {}
            } else if (docEl.webkitRequestFullscreen) {
              try { docEl.webkitRequestFullscreen(); } catch (e2) {}
            } else if (window.ysdk && window.ysdk.screen && window.ysdk.screen.fullscreen && window.ysdk.screen.fullscreen.request) {
              try { window.ysdk.screen.fullscreen.request(); } catch (e3) {}
            }
          } else {
            if (document.exitFullscreen) {
              try { document.exitFullscreen(); } catch (e4) {}
            } else if (document.webkitExitFullscreen) {
              try { document.webkitExitFullscreen(); } catch (e5) {}
            }
          }
          SoundFX.init();
        });
      }

      btnCloseSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
      });

      function updateSoundUI() {
        const isSoundMuted = !!state.settings.soundMuted;
        btnToggleSound.textContent = isSoundMuted ? 'ВЫКЛ' : 'ВКЛ';
        btnToggleSound.classList.toggle('off', isSoundMuted);
        soundIconIndicator.innerHTML = isSoundMuted ? getSvgIcon('sound_off', 18) : getSvgIcon('sound_on', 18);

        const isMusicMuted = !!state.settings.musicMuted;
        if (btnToggleMusic) {
          btnToggleMusic.textContent = isMusicMuted ? 'ВЫКЛ' : 'ВКЛ';
          btnToggleMusic.classList.toggle('off', isMusicMuted);
        }
        if (musicIconIndicator) {
          musicIconIndicator.innerHTML = isMusicMuted ? getSvgIcon('music_off', 18) : getSvgIcon('music_on', 18);
        }
      }

      btnToggleSound.addEventListener('click', () => {
        state.settings.soundMuted = !state.settings.soundMuted;
        updateSoundUI();
        SoundFX.playClick(state.settings.soundMuted);
        saveToLocal(state);
      });

      if (btnToggleMusic) {
        btnToggleMusic.addEventListener('click', () => {
          state.settings.musicMuted = !state.settings.musicMuted;
          updateSoundUI();
          if (state.settings.musicMuted) {
            SoundFX.stopMusic();
          } else {
            SoundFX.startMusic(false);
          }
          SoundFX.playClick(state.settings.soundMuted);
          saveToLocal(state);
        });
      }

      btnPromptReset.addEventListener('click', () => {
        btnPromptReset.style.display = 'none';
        resetConfirmActions.style.display = 'flex';
      });

      btnCancelReset.addEventListener('click', () => {
        resetConfirmActions.style.display = 'none';
        btnPromptReset.style.display = 'block';
      });

      btnExecuteReset.addEventListener('click', () => {
        state = createInitialState();
        subCookieAccumulator = 0;
        saveToLocal(state);
        settingsModal.classList.add('hidden');
        updateCatVisuals(state);

        const curHand = document.getElementById('currency-tutorial-hand');
        if (curHand) {
          curHand.classList.remove('hidden');
          curHand.style.display = 'block';
        }

        renderStaticUI();
      });

      const currenciesGuideModal = document.getElementById('currencies-guide-modal');
      const btnCloseCurrenciesGuide = document.getElementById('btn-close-currencies-guide');
      const topBarCurrencies = document.querySelector('.top-bar-currencies');
      const currencyTutorialHand = document.getElementById('currency-tutorial-hand');

      if (!state.tutorials?.currenciesSeen && currencyTutorialHand) {
        currencyTutorialHand.classList.remove('hidden');
      }

      if (topBarCurrencies && currenciesGuideModal) {
        topBarCurrencies.addEventListener('click', () => {
          if (!state.tutorials?.currenciesSeen) {
            state.tutorials.currenciesSeen = true;
            if (currencyTutorialHand) currencyTutorialHand.classList.add('hidden');
            saveToLocal(state);
          }
          currenciesGuideModal.classList.remove('hidden');
          SoundFX.playClick(state.settings?.soundMuted);
        });
      }

      if (btnCloseCurrenciesGuide && currenciesGuideModal) {
        btnCloseCurrenciesGuide.addEventListener('click', () => {
          currenciesGuideModal.classList.add('hidden');
        });
      }

      function renderStaticUI() {
        starsDisplay.textContent = formatNumber(state.meta?.stars || 0);
        fishDisplay.textContent = formatNumber(state.meta?.fish || 0);
        yarnDisplay.textContent = formatNumber(state.meta?.yarn || 0);

        const clickCost = getClickUpgradeCost(state.run.clickLevel);
        const clickPower = getClickPower(state);
        
        btnUpgradeClick.querySelector('.btn-title').innerHTML = `${getSvgIcon('paw', 15)} Лапка ур. <span id="click-level-val">${state.run.clickLevel}</span> (+${formatNumber(clickPower)})`;
        btnUpgradeClick.querySelector('.btn-cost').innerHTML = `${getSvgIcon('cookie', 14)} <span id="click-cost-display">${formatNumber(clickCost)}</span>`;

        if (state.run.cookies >= clickCost) {
          btnUpgradeClick.classList.add('can-afford');
        } else {
          btnUpgradeClick.classList.remove('can-afford');
        }

        updateSoundUI();
        updateWheelBtnState();

        if (activeTabId === 'generators') {
          renderGeneratorsList();
        } else if (activeTabId === 'prestige') {
          renderPrestigeView();
        } else if (activeTabId === 'shop') {
          renderShopView();
        } else if (activeTabId === 'wardrobe') {
          renderWardrobeView();
        }
      }

      // Запуск фоновой музыки по первому клику/касанию (требование автоплея в браузерах)
      const tryStartMusicOnInteraction = () => {
        if (!state.settings.musicMuted) {
          SoundFX.startMusic(false);
        }
        window.removeEventListener('pointerdown', tryStartMusicOnInteraction);
        window.removeEventListener('keydown', tryStartMusicOnInteraction);
      };
      window.addEventListener('pointerdown', tryStartMusicOnInteraction, { once: true });
      window.addEventListener('keydown', tryStartMusicOnInteraction, { once: true });

      window.addEventListener('beforeunload', () => saveToLocal(state));

      // Пауза звука при потере фокуса окна (требование модерации Яндекс Игр)
      window.addEventListener('blur', () => {
        saveToLocal(state);
        SoundFX.stopMusic();
        SoundFX.suspendAudio();
      });
      window.addEventListener('focus', () => {
        SoundFX.resumeAudio();
        if (!state.settings.musicMuted && !state.settings.soundMuted) {
          SoundFX.startMusic(false);
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          saveToLocal(state);
          SoundFX.stopMusic();
          SoundFX.suspendAudio();
        } else {
          SoundFX.resumeAudio();
          if (!state.settings.musicMuted) {
            SoundFX.startMusic(false);
          }
        }
      });

      updateCatVisuals(state);
      renderStaticUI();
      let lastTimestamp = performance.now();
      let saveAccumulator = 0;

      function tick(currentTimestamp) {
        let dt = (currentTimestamp - lastTimestamp) / 1000;
        lastTimestamp = currentTimestamp;

        if (dt > 1.0) dt = 1.0;
        if (dt < 0 || Number.isNaN(dt)) dt = 0;

        const maxFeverDur = getMaxFeverDuration(state);

        if (state.boosts.feverActive) {
          feverRemainingTimer -= dt;
          if (feverRemainingTimer <= 0) {
            state.boosts.feverActive = false;
            state.boosts.feverProgress = 0;
            state.boosts.feverBonusMultiplier = 0;
            feverRemainingTimer = 0;
            clearAllCroissants();
            const wrapper = document.getElementById('fever-wrapper');
            if (wrapper) wrapper.classList.remove('fever-active');
          } else {
            state.boosts.feverProgress = Math.max(0, (feverRemainingTimer / maxFeverDur) * 100);
            
            if (Math.random() < 0.35) {
              spawnFeverSpark();
            }

            // Спавн 1-2 круассанов каждые 2.5 - 3.5 секунды
            nextCroissantSpawnTimer -= dt;
            if (nextCroissantSpawnTimer <= 0) {
              nextCroissantSpawnTimer = 2.5 + Math.random() * 1.0;
              const spawnCount = Math.random() < 0.4 ? 2 : 1;
              for (let c = 0; c < spawnCount; c++) {
                setTimeout(() => {
                  if (state.boosts.feverActive) spawnFeverCroissant(state);
                }, c * 260);
              }
            }
          }
        } else if (state.boosts.feverProgress > 0) {
          state.boosts.feverProgress = Math.max(0, state.boosts.feverProgress - 2.5 * dt);
        }

        // Мур-комбо: затухание и таймер ультра-выпечки
        if (ultraBakeActive) {
          ultraBakeRemaining -= dt;
          if (ultraBakeRemaining <= 0) endUltraBake();
          else updatePurrComboUI();
        } else if (purrComboValue > 0) {
          purrComboValue = Math.max(0, purrComboValue - dt * 8);
          updatePurrComboUI();
        }

        // Перк «Авто-булочник»: автоматический клик по коту
        const autoClickRate = (typeof getAutoClickRate === 'function') ? getAutoClickRate(state) : 0;
        if (autoClickRate > 0) {
          autoClickAccumulator = (autoClickAccumulator || 0) + autoClickRate * dt;
          const autoClicks = Math.floor(autoClickAccumulator);
          if (autoClicks > 0) {
            autoClickAccumulator -= autoClicks;
            const power = getClickPower(state);
            const gain = power * autoClicks;
            state.run.cookies += gain;
            state.run.lifetimeCookiesRun += gain;
            state.stats.totalCookiesAllTime += gain;
            state.stats.totalClicks += autoClicks;
            state.boosts.feverProgress = Math.min(100, state.boosts.feverProgress + 4.0 * autoClicks);
            if (state.boosts.feverProgress >= 100 && !state.boosts.feverActive) {
              triggerFeverMode(state);
            }
          }
        }

        const orderRushPill = document.getElementById('order-rush-pill');
        const orderRushTimerLabel = document.getElementById('order-rush-timer-label');
        const orderRushMultLabel = document.getElementById('order-rush-mult-label');

        if (state.boosts.orderRushTimer > 0) {
          state.boosts.orderRushTimer = Math.max(0, state.boosts.orderRushTimer - dt);
          if (orderRushPill) {
            orderRushPill.style.display = 'inline-flex';
            if (orderRushTimerLabel) orderRushTimerLabel.textContent = `${Math.ceil(state.boosts.orderRushTimer)}с`;
            if (orderRushMultLabel) orderRushMultLabel.textContent = `x${state.boosts.orderRushMultiplier || 2}`;
          }
        } else {
          if (orderRushPill) orderRushPill.style.display = 'none';
        }

        const sugarRushPill = document.getElementById('sugar-rush-pill');
        const sugarRushTimerLabel = document.getElementById('sugar-rush-timer-label');
        const sugarRushExpiry = state.boosts?.sugarRushExpiresAt || 0;
        const nowCurrentMs = Date.now();

        if (sugarRushExpiry > nowCurrentMs) {
          if (sugarRushPill) {
            sugarRushPill.style.display = 'inline-flex';
            if (sugarRushTimerLabel) {
              sugarRushTimerLabel.textContent = `${Math.ceil((sugarRushExpiry - nowCurrentMs) / 1000)}с`;
            }
          }
        } else {
          if (sugarRushPill) sugarRushPill.style.display = 'none';
        }

        const nowLoopMs = Date.now();
        const tlCooldown = state.boosts.timelapseCooldownUntil || 0;
        const btnTimelapseEl = document.getElementById('btn-timelapse-boost');
        const timelapseLabelEl = document.getElementById('timelapse-btn-label');

        if (btnTimelapseEl && timelapseLabelEl) {
          if (tlCooldown > nowLoopMs) {
            btnTimelapseEl.style.opacity = '0.6';
            btnTimelapseEl.style.pointerEvents = 'none';
            timelapseLabelEl.textContent = formatTime(Math.ceil((tlCooldown - nowLoopMs) / 1000), 'timer');
          } else {
            btnTimelapseEl.style.opacity = '1';
            btnTimelapseEl.style.pointerEvents = 'auto';
            timelapseLabelEl.textContent = '+2ч';
          }
        }

        if (state.boosts?.activeOrder) {
          state.boosts.activeOrder.timeLeft -= dt;
          if (state.boosts.activeOrder.timeLeft <= 0) {
            cancelActiveOrder();
          } else {
            updateOrderUI();
          }
        } else {
          if (state.boosts.nextOrderCooldown > 0) {
            state.boosts.nextOrderCooldown -= dt;
          } else if (!state.boosts.feverActive) {
            triggerRandomOrder();
          }
        }

        const currentRate = calculateTotalRate(state);
        if (currentRate > 0 && dt > 0) {
          subCookieAccumulator += currentRate * dt;
          const intEarned = Math.floor(subCookieAccumulator);
          if (intEarned > 0) {
            state.run.cookies += intEarned;
            state.run.lifetimeCookiesRun += intEarned;
            state.stats.totalCookiesAllTime += intEarned;
            subCookieAccumulator -= intEarned;
          }
        }

        const nowMs = Date.now();
        if (nowMs >= nextFishSpawnTimestamp) {
          spawnFlyingFish();
          nextFishSpawnTimestamp = nowMs + 1000 * getNextFishIntervalSec();
        }

        if (nowMs >= nextBoxSpawnTimestamp) {
          spawnSurpriseBox();
        }

        if (!nextCatMoodTimestamp || isNaN(nextCatMoodTimestamp)) {
          nextCatMoodTimestamp = nowMs + (25 + Math.random() * 20) * 1000;
        }

        if (!activeCatMood && !state.boosts.feverActive && nowMs >= nextCatMoodTimestamp) {
          triggerCatMoodEvent();
          nextCatMoodTimestamp = nowMs + (40 + Math.random() * 30) * 1000;
        }

        if (activeCatMood) {
          if (nowMs >= moodTimerEnd) {
            clearCatMoodVisuals();
            nextCatMoodTimestamp = nowMs + (40 + Math.random() * 30) * 1000;
          } else {
            if (typeof updateMoodStatusPill === 'function') updateMoodStatusPill();
          }
        }

        saveAccumulator += dt;
        if (saveAccumulator >= 3.0) {
          saveAccumulator = 0;
          saveToLocal(state);
        }

        cookiesDisplay.textContent = formatNumber(state.run.cookies);
        rateDisplay.textContent = formatNumber(calculateTotalRate(state));
        const sleepTag = document.getElementById('sleep-rate-tag');
        if (sleepTag) {
          const isSleeping = activeCatMood === 'sleep' && nowMs < moodTimerEnd;
          sleepTag.style.display = isSleeping ? 'inline-flex' : 'none';
          if (isSleeping && !sleepTag.dataset.svgApplied) {
            sleepTag.innerHTML = ` ${getSvgIcon('cat_sleep', 13)} (Выпечка x2.5)`;
            sleepTag.dataset.svgApplied = 'true';
          }
        }

        const progress = Math.max(0, Math.min(100, state.boosts.feverProgress || 0));
        const offset = FEVER_CIRCUMFERENCE - (progress / 100) * FEVER_CIRCUMFERENCE;
        feverRingProgress.style.strokeDashoffset = String(offset);

        if (state.boosts.feverActive) {
          feverWrapper.classList.add('fever-active');
        } else {
          feverWrapper.classList.remove('fever-active');
        }

        const expiry = state.boosts.adMultiplierExpiresAt || 0;
        if (expiry > nowMs) {
          btnAdBoost.classList.remove('inactive');
          adBoostTimer.textContent = formatTime(Math.floor((expiry - nowMs) / 1000), 'timer');
        } else {
          btnAdBoost.classList.add('inactive');
          adBoostTimer.textContent = 'Активировать';
        }

        if (activeTabId === 'prestige') {
          const runBaked = Math.max(state.run?.cookies || 0, state.run?.lifetimeCookiesRun || 0);
          const currentPrestige = state.meta?.prestigeCount || 0;
          const nextLocIdx = Math.min(currentPrestige + 1, LOCATIONS_CONFIG.length - 1);
          const nextLoc = LOCATIONS_CONFIG[nextLocIdx] || LOCATIONS_CONFIG[0];
          const isMaxBranch = currentPrestige >= LOCATIONS_CONFIG.length - 1;

          const inspectorLvl = state?.meta?.perks?.generous_inspector || 0;
          const discountMult = 1 - Math.min(0.25, inspectorLvl * 0.05);
          const targetReq = isMaxBranch ? 1 : Math.floor(nextLoc.reqCookies * discountMult);

          const progressPct = isMaxBranch ? 100 : Math.min(100, Math.max(0, Math.floor((runBaked / targetReq) * 100)));
          const neededToNext = Math.max(0, targetReq - runBaked);
          const rewardStars = calculatePrestigeReward(state);
          const canPrestige = !isMaxBranch && runBaked >= targetReq;

          const barFill = document.getElementById('prestige-bar-fill');
          const progText = document.getElementById('prestige-progress-text');
          const progPct = document.getElementById('prestige-progress-pct');
          const doPrestigeBtn = document.getElementById('btn-do-prestige');
          const doPrestigeText = document.getElementById('btn-do-prestige-text');

          if (barFill) barFill.style.width = `${progressPct}%`;
          if (progText) progText.textContent = isMaxBranch ? 'Максимальный филиал' : `До переезда: ${formatNumber(runBaked)} / ${formatNumber(targetReq)} (${progressPct}%)`;
          if (progPct) progPct.textContent = `${progressPct}%`;

          if (doPrestigeBtn) doPrestigeBtn.disabled = !canPrestige;
          if (doPrestigeText) {
            doPrestigeText.innerHTML = isMaxBranch 
              ? `Все филиалы открыты!` 
              : (canPrestige
                  ? `${getSvgIcon('crown', 15)} Открыть «${nextLoc.name}» (+${rewardStars} Звёзд)`
                  : `До переезда: ${formatNumber(neededToNext)} ${getSvgIcon('cookie', 14)}`);
          }
        }

        if (activeTabId === 'generators') {
          const cards = tabPanes.generators.querySelectorAll('.generator-card');
          cards.forEach((card) => {
            const btn = card.querySelector('.gen-buy-btn');
            if (!btn) return;
            const genId = btn.dataset.genId;
            if (!genId) return;

            let count = 1;
            let cost = 0;
            let canAfford = false;

            if (currentBatchMode === '10') {
              count = 10;
              cost = getBatchCost(genId, 10, state);
              canAfford = state.run.cookies >= cost && cost > 0;
            } else if (currentBatchMode === 'max') {
              const maxInfo = getMaxAffordable(genId, state);
              if (maxInfo.count > 0) {
                count = maxInfo.count;
                cost = maxInfo.cost;
                canAfford = state.run.cookies >= cost;
              } else {
                count = 1;
                cost = maxInfo.cost;
                canAfford = false;
              }
            } else {
              cost = getSingleGeneratorCost(genId, state);
              count = 1;
              canAfford = state.run.cookies >= cost && cost > 0;
            }

            btn.disabled = !canAfford;

            const countSpan = btn.querySelector('.btn-buy-count');
            const costSpan = btn.querySelector('.btn-buy-cost');

            if (countSpan) countSpan.textContent = `+${count}`;
            if (costSpan) costSpan.innerHTML = `${getSvgIcon('cookie', 14)} ${formatNumber(cost)}`;

            if (canAfford) {
              card.classList.add('can-afford');
            } else {
              card.classList.remove('can-afford');
            }
          });
        }

        const clickCost = getClickUpgradeCost(state.run.clickLevel);
        if (state.run.cookies >= clickCost) {
          btnUpgradeClick.classList.add('can-afford');
        } else {
          btnUpgradeClick.classList.remove('can-afford');
        }

        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    window.ysdk = null;

    function initYandexSDK() {
      if (typeof YaGames !== 'undefined') {
        YaGames.init().then(ysdkInstance => {
          window.ysdk = ysdkInstance;
          // Пауза звука по событиям платформы (требование модерации Яндекс Игр)
          try {
            ysdkInstance.on('game_api_pause', () => {
              if (SoundFX) { SoundFX.stopMusic(); SoundFX.suspendAudio(); }
              if (typeof state !== 'undefined' && state) saveToLocal(state);
            });
            ysdkInstance.on('game_api_resume', () => {
              if (SoundFX) {
                SoundFX.resumeAudio();
                if (typeof state !== 'undefined' && state && !state.settings.musicMuted) SoundFX.startMusic(false);
              }
            });
          } catch (e) { console.warn('Yandex events init failed:', e); }
          // Сообщаем платформе, что игра готова (для метрик каталога)
          try { ysdkInstance.features?.LoadingAPI?.ready?.(); } catch (e) {}
        }).catch(err => {
          console.warn('Ошибка инициализации SDK:', err);
        });
      }
    }

    // Универсальный вызов Rewarded Video (Яндекс SDK + тестовый мок)
    function showRewardedAd(onSuccess, onError) {
      if (window.ysdk && window.ysdk.adv && typeof window.ysdk.adv.showRewardedVideo === 'function') {
        let isMutedBefore = false;
        window.ysdk.adv.showRewardedVideo({
          callbacks: {
            onOpen: () => {
              if (SoundFX && SoundFX.isMusicPlaying) {
                isMutedBefore = true;
                SoundFX.stopMusic();
              }
              if (SoundFX) SoundFX.suspendAudio();
            },
            onRewarded: () => {
              if (onSuccess) onSuccess();
            },
            onClose: () => {
              if (SoundFX) SoundFX.resumeAudio();
              if (isMutedBefore && window.state && !window.state.settings?.musicMuted) {
                SoundFX.startMusic(false);
              }
            },
            onError: (err) => {
              console.warn('Rewarded ad error:', err);
              if (SoundFX) SoundFX.resumeAudio();
              if (isMutedBefore && window.state && !window.state.settings?.musicMuted) {
                SoundFX.startMusic(false);
              }
              if (onError) onError(err);
            }
          }
        });
      } else {
        // Локальный мок для тестирования без SDK (задержка 1с)
        const toast = document.createElement('div');
        toast.className = 'cat-mood-bubble';
        toast.style.position = 'fixed';
        toast.style.top = '18px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.zIndex = '9999';
        toast.innerHTML = `${getSvgIcon('video_cam', 16)} Просмотр рекламы (Тестовый мок 1с)...`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.remove();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    }

  // Универсальный вызов Interstitial (Яндекс SDK + локальный мок).
  // Пауза звука — требование модерации Яндекс Игр.
  function showFullscreenAdv(onClose, onError) {
    if (window.ysdk && window.ysdk.adv && typeof window.ysdk.adv.showFullscreenAdv === 'function') {
      let isMutedBefore = false;
      window.ysdk.adv.showFullscreenAdv({
        callbacks: {
          onOpen: () => {
            if (SoundFX && SoundFX.isMusicPlaying) {
              isMutedBefore = true;
              SoundFX.stopMusic();
            }
            if (SoundFX) SoundFX.suspendAudio();
          },
          onClose: (wasShown) => {
            if (SoundFX) SoundFX.resumeAudio();
            if (isMutedBefore && window.state && !window.state.settings?.musicMuted) {
              SoundFX.startMusic(false);
            }
            if (onClose) onClose(wasShown);
          },
          onError: (err) => {
            console.warn('Fullscreen ad error:', err);
            if (SoundFX) SoundFX.resumeAudio();
            if (isMutedBefore && window.state && !window.state.settings?.musicMuted) {
              SoundFX.startMusic(false);
            }
            if (onError) onError(err);
          }
        }
      });
    } else {
      // Локальный мок для тестирования без SDK
      if (onClose) onClose(false);
    }
  }

  // Экспорт рекламных функций для других модулей (Фаза 5)
  window.showRewardedAd = showRewardedAd;
  window.showFullscreenAdv = showFullscreenAdv;
  function bootstrap() {
    if (typeof YaGames !== 'undefined') {
      initYandexSDK();
    }
    initGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();