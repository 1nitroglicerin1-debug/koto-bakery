/* ===========================================================================
   state.js — создание, валидация/миграция состояния, сохранение в localStorage
   (ключ koto_bakery_standalone_v52) и утилиты форматирования.
   Извлечено 1-в-1 из index.html (Фаза 1 рефакторинга).
   Зависит от: js/config.js
   =========================================================================== */

    function createInitialState() {
      const now = Date.now();
      return {
        version: 52,
        run: {
          cookies: 0,
          lifetimeCookiesRun: 0,
          clickLevel: 1,
          generators: GENERATOR_IDS.reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
        },
        meta: {
          stars: 0,
          lifetimeStars: 0,
          fish: 0,
          yarn: 0,
          prestigeCount: 0,
          perks: PERK_IDS.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
          shop: {
            catnip: 0,
            goldenRollingPin: 0,
            creamSauce: 0,
            catBell: 0,
            fishJar: 0,
            meteorFlour: 0
          },
          wardrobe: {
            unlocked: ['chef_hat_1', 'neck_none'],
            equippedHead: 'chef_hat_1',
            equippedNeck: 'neck_none',
            selectedSkin: 'default'
          },
          achievements: []
        },
        tutorials: {
          prestigeSeen: false,
          shopSeen: false,
          wardrobeSeen: false,
          currenciesSeen: false
        },
        boosts: {
          adMultiplierExpiresAt: 0,
          sugarRushExpiresAt: 0,
          feverActive: false,
          feverProgress: 0,
          orderRushTimer: 0,
          activeOrder: null,
          nextOrderCooldown: 120,
          lastFreeWheelSpinTime: 0,
          timelapseCooldownUntil: 0
        },
        timestamps: {
          lastSaveTime: now,
          firstStartTime: now
        },
        settings: {
          soundMuted: false,
          musicMuted: false
        },
        stats: {
          totalClicks: 0,
          totalCookiesAllTime: 0,
          fishCaught: 0,
          boxesCaught: 0,
          playTimeSeconds: 0
        }
      };
    }

    function sanitizeNumber(val, fallback = 0) {
      if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val) || val < 0) {
        return fallback;
      }
      return val;
    }

    function validateAndMigrateState(raw) {
      const defaults = createInitialState();
      if (!raw || typeof raw !== 'object') return defaults;

      const data = raw;
      const mergedGenerators = { ...defaults.run.generators };
      if (data.run?.generators) {
        for (const id of GENERATOR_IDS) {
          mergedGenerators[id] = Math.floor(sanitizeNumber(data.run.generators[id], 0));
        }
      }

      const mergedPerks = { ...defaults.meta.perks };
      if (data.meta?.perks) {
        for (const id of PERK_IDS) {
          mergedPerks[id] = Math.floor(sanitizeNumber(data.meta.perks[id], 0));
        }
      }

      const parsedStars = Math.floor(sanitizeNumber(data.meta?.stars, 0));
      const parsedLifetimeStars = Math.max(parsedStars, Math.floor(sanitizeNumber(data.meta?.lifetimeStars, 0)));
      const parsedPrestigeCount = Math.floor(sanitizeNumber(data.meta?.prestigeCount, 0));

      let wardrobeUnlocked = ['chef_hat_1', 'neck_none'];
      let equippedHead = 'chef_hat_1';
      let equippedNeck = 'neck_none';

      if (parsedPrestigeCount >= 1) {
        wardrobeUnlocked.push('chef_hat_2', 'red_bowtie');
      }
      if (parsedPrestigeCount >= 2) {
        wardrobeUnlocked.push('beret_royal', 'gold_medal');
      }

      if (data.meta?.wardrobe) {
        const oldUnlocked = Array.isArray(data.meta.wardrobe.unlocked) ? data.meta.wardrobe.unlocked : [];
        oldUnlocked.forEach((id) => {
          if (id === 'none') return;
          // Предотвращаем разблокировку престижных шапок раньше времени при миграции
          if ((id === 'chef_hat_2' || id === 'red_bowtie') && parsedPrestigeCount < 1) return;
          if ((id === 'beret_royal' || id === 'gold_medal') && parsedPrestigeCount < 2) return;

          if (id === 'golden_monocle' && !wardrobeUnlocked.includes('devil_horns')) {
            wardrobeUnlocked.push('devil_horns');
          } else if (id === 'cherry_flower' && !wardrobeUnlocked.includes('flower_wreath')) {
            wardrobeUnlocked.push('flower_wreath');
          } else if (id === 'angel_halo' && !wardrobeUnlocked.includes('love_hearts')) {
            wardrobeUnlocked.push('love_hearts');
          } else if (!wardrobeUnlocked.includes(id)) {
            wardrobeUnlocked.push(id);
          }
        });

        if (typeof data.meta.wardrobe.equippedHead === 'string') {
          equippedHead = data.meta.wardrobe.equippedHead;
        } else if (typeof data.meta.wardrobe.equipped === 'string') {
          const oldEq = data.meta.wardrobe.equipped;
          if (oldEq === 'golden_monocle') equippedHead = 'devil_horns';
          else if (oldEq === 'cherry_flower') equippedHead = 'flower_wreath';
          else if (oldEq === 'angel_halo') equippedHead = 'love_hearts';
          else if (oldEq === 'royal_crown') equippedHead = 'magic_tophat';
          else if (oldEq !== 'none') equippedHead = oldEq;
        }

        if (typeof data.meta.wardrobe.equippedNeck === 'string') {
          equippedNeck = data.meta.wardrobe.equippedNeck;
        } else {
          if (parsedPrestigeCount === 1) equippedNeck = 'red_bowtie';
          else if (parsedPrestigeCount >= 2) equippedNeck = 'gold_medal';
        }
      }

      // Проверка валидности надетого головного убора
      if (equippedHead === 'chef_hat_2' && parsedPrestigeCount < 1) equippedHead = 'chef_hat_1';
      if (equippedHead === 'beret_royal' && parsedPrestigeCount < 2) equippedHead = 'chef_hat_1';
      if (equippedNeck === 'red_bowtie' && parsedPrestigeCount < 1) equippedNeck = 'neck_none';
      if (equippedNeck === 'gold_medal' && parsedPrestigeCount < 2) equippedNeck = 'neck_none';

      return {
        version: 52,
        run: {
          cookies: Math.floor(sanitizeNumber(data.run?.cookies, defaults.run.cookies)),
          lifetimeCookiesRun: Math.floor(sanitizeNumber(data.run?.lifetimeCookiesRun, 0)),
          clickLevel: Math.max(1, Math.floor(sanitizeNumber(data.run?.clickLevel, 1))),
          generators: mergedGenerators
        },
        meta: {
          stars: parsedStars,
          lifetimeStars: parsedLifetimeStars,
          fish: Math.floor(sanitizeNumber(data.meta?.fish, 0)),
          yarn: Math.floor(sanitizeNumber(data.meta?.yarn, 0)),
          prestigeCount: parsedPrestigeCount,
          perks: mergedPerks,
          shop: {
            catnip: Math.floor(sanitizeNumber(data.meta?.shop?.catnip, 0)),
            goldenRollingPin: Math.floor(sanitizeNumber(data.meta?.shop?.goldenRollingPin, 0)),
            creamSauce: Math.floor(sanitizeNumber(data.meta?.shop?.creamSauce || data.meta?.shop?.eternalEnergy, 0)),
            catBell: Math.min(8, Math.floor(sanitizeNumber(data.meta?.shop?.catBell, 0))),
            fishJar: Math.floor(sanitizeNumber(data.meta?.shop?.fishJar, 0)),
            meteorFlour: Math.floor(sanitizeNumber(data.meta?.shop?.meteorFlour, 0))
          },
          wardrobe: {
            unlocked: Array.from(new Set(wardrobeUnlocked)),
            equippedHead: equippedHead,
            equippedNeck: equippedNeck,
            selectedSkin: (typeof data.meta?.wardrobe?.selectedSkin === 'string') ? data.meta.wardrobe.selectedSkin : 'default'
          },
          achievements: Array.isArray(data.meta?.achievements) ? data.meta.achievements : []
        },
        tutorials: {
          prestigeSeen: !!data.tutorials?.prestigeSeen,
          shopSeen: !!data.tutorials?.shopSeen,
          wardrobeSeen: !!data.tutorials?.wardrobeSeen,
          currenciesSeen: !!data.tutorials?.currenciesSeen
        },
        boosts: {
          adMultiplierExpiresAt: sanitizeNumber(data.boosts?.adMultiplierExpiresAt, 0),
          sugarRushExpiresAt: sanitizeNumber(data.boosts?.sugarRushExpiresAt, 0),
          feverActive: !!data.boosts?.feverActive,
          feverProgress: Math.min(100, sanitizeNumber(data.boosts?.feverProgress, 0)),
          orderRushTimer: sanitizeNumber(data.boosts?.orderRushTimer, 0),
          activeOrder: data.boosts?.activeOrder || null,
          nextOrderCooldown: sanitizeNumber(data.boosts?.nextOrderCooldown, 120),
          lastFreeWheelSpinTime: sanitizeNumber(data.boosts?.lastFreeWheelSpinTime, 0),
          timelapseCooldownUntil: sanitizeNumber(data.boosts?.timelapseCooldownUntil, 0)
        },
        timestamps: {
          lastSaveTime: sanitizeNumber(data.timestamps?.lastSaveTime, Date.now()),
          firstStartTime: sanitizeNumber(data.timestamps?.firstStartTime, Date.now())
        },
        settings: {
          soundMuted: !!data.settings?.soundMuted,
          musicMuted: !!data.settings?.musicMuted
        },
        stats: {
          totalClicks: Math.floor(sanitizeNumber(data.stats?.totalClicks, 0)),
          totalCookiesAllTime: Math.floor(sanitizeNumber(data.stats?.totalCookiesAllTime, 0)),
          fishCaught: Math.floor(sanitizeNumber(data.stats?.fishCaught, 0)),
          boxesCaught: Math.floor(sanitizeNumber(data.stats?.boxesCaught, 0)),
          playTimeSeconds: Math.floor(sanitizeNumber(data.stats?.playTimeSeconds, 0))
        }
      };
    }

    function saveToLocal(state) {
      try {
        state.timestamps.lastSaveTime = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {}
    }

    function loadFromLocal() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return createInitialState();
        return validateAndMigrateState(JSON.parse(raw));
      } catch (e) {
        return createInitialState();
      }
    }
    /* Форматирование чисел и таймеров */
    const NUMBER_SUFFIXES = ['', ' тыс.', ' млн.', ' млрд.', ' трлн.', ' квдр.', ' квнт.'];

    function formatNumber(num) {
      if (typeof num !== 'number' || !Number.isFinite(num) || Number.isNaN(num) || num <= 0) {
        return '0';
      }
      if (num < 1000) {
        return Math.floor(num).toLocaleString('ru-RU');
      }
      const tier = Math.floor(Math.log10(num) / 3);
      if (tier < NUMBER_SUFFIXES.length) {
        const suffix = NUMBER_SUFFIXES[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        let decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
        return `${scaled.toFixed(decimals)}${suffix}`;
      }
      return num.toExponential(2).replace('e+', 'e');
    }

    function formatTime(totalSeconds, mode = 'timer') {
      const safeSeconds = Math.max(0, Math.floor(totalSeconds));
      const hours = Math.floor(safeSeconds / 3600);
      const minutes = Math.floor((safeSeconds % 3600) / 60);
      const seconds = safeSeconds % 60;

      if (mode === 'duration') {
        const parts = [];
        if (hours > 0) parts.push(`${hours} ч`);
        if (minutes > 0 || hours > 0) parts.push(`${minutes} мин`);
        if (parts.length === 0) parts.push(`${seconds} сек`);
        return parts.join(' ');
      }

      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');
      return hours > 0 ? `${String(hours).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
    }



/* === Экспорт === */
window.KotoApp = window.KotoApp || {};
window.createInitialState = createInitialState;
window.sanitizeNumber = sanitizeNumber;
window.validateAndMigrateState = validateAndMigrateState;
window.saveToLocal = saveToLocal;
window.loadFromLocal = loadFromLocal;
window.formatNumber = formatNumber;
window.formatTime = formatTime;
window.NUMBER_SUFFIXES = NUMBER_SUFFIXES;
Object.assign(window.KotoApp, {
  createInitialState, sanitizeNumber, validateAndMigrateState,
  saveToLocal, loadFromLocal, formatNumber, formatTime, NUMBER_SUFFIXES
});