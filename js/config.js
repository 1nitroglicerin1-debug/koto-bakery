/* ===========================================================================
   config.js — статические конфиги и константы игры «Кото-Пекарня»
   Извлечено 1-в-1 из исходного index.html (Фаза 1 рефакторинга).
   Зависит от: js/icons.js (getSvgIcon)
   =========================================================================== */

    const STORAGE_KEY = 'koto_bakery_standalone_v52';
    const FEVER_CIRCUMFERENCE = 678.58;

    const GENERATOR_IDS = [
      'lapkolap', 
      'mur_pech', 
  'ponchik_master',
      'kot_barista', 
      'courier', 
      'chef_murych',
  'brioche_lord',
      'croissant_factory',
      'molecular_chef',
      'cyber_autoclave',
  'nebular_baker',
      'astral_portal'
    ];

    const PERK_IDS = ['start_van', 'strong_paws', 'cat_sleep', 'bulk_buy', 'generous_inspector', 'auto_baker', 'crit_crust', 'fish_magnet', 'paw_memory'];

    const GENERATORS_CONFIG = {
      lapkolap: { name: 'Лапколап', baseCost: 50, baseRate: 1, costGrowthRate: 1.12 },
      mur_pech: { name: 'Мур-Печь', baseCost: 500, baseRate: 7, costGrowthRate: 1.12 },
    ponchik_master: { name: 'Пончик-Мастер', baseCost: 1200, baseRate: 12, costGrowthRate: 1.12 },
      kot_barista: { name: 'Кот-Бариста', baseCost: 5000, baseRate: 40, costGrowthRate: 1.13 },
      courier: { name: 'Курьер', baseCost: 50000, baseRate: 220, costGrowthRate: 1.14 },
      chef_murych: { name: 'Шеф Мурыч', baseCost: 500000, baseRate: 1400, costGrowthRate: 1.14 },
    brioche_lord: { name: 'Бриошь-Лорд', baseCost: 20000000, baseRate: 4500, costGrowthRate: 1.14 },
      croissant_factory: { name: 'Круассан-фабрика', baseCost: 5000000, baseRate: 12000, costGrowthRate: 1.14 },
      molecular_chef: { name: 'Молекулярный шеф', baseCost: 80000000, baseRate: 210000, costGrowthRate: 1.15 },
      cyber_autoclave: { name: 'Кибер-Пекарь 3000', baseCost: 2000000000, baseRate: 6500000, costGrowthRate: 1.15 },
    nebular_baker: { name: 'Небулярный пекарь', baseCost: 28000000000, baseRate: 58000000, costGrowthRate: 1.16 },
      astral_portal: { name: 'Портал пряностей', baseCost: 75000000000, baseRate: 320000000, costGrowthRate: 1.16 }
    };

    const GENERATOR_ICONS = {
      lapkolap: getSvgIcon('paw', 24),
      mur_pech: getSvgIcon('fire', 24),
      ponchik_master: getSvgIcon('croissant', 24),
      kot_barista: getSvgIcon('coffee', 24),
      courier: getSvgIcon('scooter', 24),
      chef_murych: getSvgIcon('baker', 24),
      brioche_lord: getSvgIcon('crown', 24),
      croissant_factory: getSvgIcon('croissant', 24),
      molecular_chef: getSvgIcon('flask', 24),
      cyber_autoclave: getSvgIcon('robot', 24),
      nebular_baker: getSvgIcon('flask', 24),
      astral_portal: getSvgIcon('portal', 24)
    };

    const MILESTONES = [25, 50, 75, 100, 150, 200];

    const LOCATIONS_CONFIG = [
    {
      id: 'loc_0',
      name: 'Уютная кухня',
      icon: getSvgIcon('home', 14),
      reqCookies: 0,
      bonusText: 'Базовая выпечка',
      cpsMultiplier: 1.0,
      clickBonus: 0,
      bgClass: 'bg-loc-kitchen',
      ringColor: '#e07a38',
      ringFilter: 'drop-shadow(0 2px 10px rgba(224, 122, 56, 0.45))',
      rewardItem: null
    },
    {
      id: 'loc_1',
      name: 'Городское кафе',
      icon: getSvgIcon('coffee', 14),
      reqCookies: 200000,
      bonusText: '+100% выпечка / +5 к клику',
      cpsMultiplier: 2.0,
      clickBonus: 5,
      bgClass: 'bg-loc-cafe',
      ringColor: '#d97706',
      ringFilter: 'drop-shadow(0 2px 14px rgba(217, 119, 6, 0.45))',
      rewardItem: { head: 'chef_hat_2', neck: 'red_bowtie' }
    },
    {
      id: 'loc_2',
      name: 'Королевский дворец',
      icon: getSvgIcon('crown', 14),
      reqCookies: 25000000,
      bonusText: '+350% выпечка / +25 к клику',
      cpsMultiplier: 4.5,
      clickBonus: 25,
      bgClass: 'bg-loc-palace',
      ringColor: '#d49410',
      ringFilter: 'drop-shadow(0 2px 14px rgba(212, 148, 16, 0.5))',
      rewardItem: { head: 'beret_royal', neck: 'gold_medal' }
    },
    {
      id: 'loc_3',
      name: 'Кондитерская Мишлен',
      icon: getSvgIcon('star', 14),
      reqCookies: 5000000000,
      bonusText: '+1000% выпечка / +100 к клику',
      cpsMultiplier: 11.0,
      clickBonus: 100,
      bgClass: 'bg-loc-michelin',
      ringColor: '#10b981',
      ringFilter: 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.7))',
      rewardItem: { head: 'gold_crown', neck: 'ruby_collar' }
    },
    {
      id: 'loc_4',
      name: 'Кибер-Пекарня 2077',
      icon: getSvgIcon('lightning', 14),
      reqCookies: 100000000000,
      bonusText: '+2500% выпечка / +500 к клику',
      cpsMultiplier: 26.0,
      clickBonus: 500,
      bgClass: 'bg-loc-cyber',
      ringColor: '#00f0ff',
      ringFilter: 'drop-shadow(0 0 16px rgba(0, 240, 255, 0.75))',
      rewardItem: { head: 'cyber_visor', neck: 'neon_choker' }
    },
    {
      id: 'loc_5',
      name: 'Астральная Обсерватория',
      icon: getSvgIcon('star', 14),
      reqCookies: 2500000000000,
      bonusText: '+7500% выпечка / +2000 к клику',
      cpsMultiplier: 76.0,
      clickBonus: 2000,
      bgClass: 'bg-loc-astral',
      ringColor: '#c084fc',
      ringFilter: 'drop-shadow(0 0 18px rgba(192, 132, 252, 0.8))',
      rewardItem: { head: 'astral_halo', neck: 'star_pendant' }
    }
  ];
    const LOCATION_THEMES = LOCATIONS_CONFIG;

    function getPrestigeThresholdByIndex(n) {
      if (n <= 0) return 0;
      const staticTiers = [0, 5000000, 10000000, 25000000, 50000000, 100000000];
      if (n < staticTiers.length) return staticTiers[n];

      const after100m = n - 5;
      if (after100m <= 9) {
        return 100000000 + after100m * 100000000; // До 1 млрд (шаг 100 млн)
      }

      const after1b = after100m - 9;
      if (after1b <= 9) {
        return 1000000000 + after1b * 1000000000; // От 1 млрд до 10 млрд (шаг 1 млрд)
      }

      const after10b = after1b - 9;
      if (after10b <= 9) {
        return 10000000000 + after10b * 10000000000; // От 10 млрд до 100 млрд (шаг 10 млрд)
      }

      const after100b = after10b - 9;
      return 100000000000 + after100b * 100000000000; // Выше 100 млрд (шаг 100 млрд)
    }

    function getTotalPurchasedPerks(state) {
      if (!state.meta?.perks) return 0;
      return Object.values(state.meta.perks).reduce((sum, lvl) => sum + (Number(lvl) || 0), 0);
    }

    function getFishIconSvg(size = 16, extraClass = '') {
      return `<svg class="icon-svg-badge ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24"><use href="#universal-gold-fish" /></svg>`;
    }

    function getYarnIconSvg(size = 16, extraClass = '') {
      return `<svg class="icon-svg-badge ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24"><use href="#universal-yarn-ball" /></svg>`;
    }

    /* 6 скинов котика */
    const CAT_SKINS_CATALOG = [
      { id: 'default', name: 'Стандартный', color: 'linear-gradient(135deg, #FFFDF9 0%, #FEDAC2 50%, #DE9168 100%)' },
      { id: 'pink', name: 'Розовый зефир', color: 'linear-gradient(135deg, #FFF1F2 0%, #FBCFE8 50%, #F472B6 100%)' },
      { id: 'black', name: 'Дымчатый британец', color: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #94A3B8 100%)' },
      { id: 'ginger', name: 'Рыжий имбирь', color: 'linear-gradient(135deg, #FFFBEB 0%, #FED7AA 50%, #FB923C 100%)' },
      { id: 'blue', name: 'Мятно-голубой', color: 'linear-gradient(135deg, #F0F9FF 0%, #BAE6FD 50%, #7DD3FC 100%)' },
      { id: 'green', name: 'Фисташковый чай', color: 'linear-gradient(135deg, #F7FEE7 0%, #BBF7D0 50%, #86EFAC 100%)' }
    ];

    /* Полный каталог гардероба с пассивными бонусами */
    const WARDROBE_CATALOG = {
      head: [
        /* 1-й блок: Базовые вещи (Локация 1: Уютная кухня) */
        {
          id: 'chef_hat_1',
          name: 'Поварской колпачок',
          iconSvg: 'wardrobe-icon-chef-hat',
          cost: 0,
          currency: 'yarn',
          isBase: true,
          bonusDesc: 'Базовый',
          desc: 'Уютная шапочка из плотной ткани для выпечки булочек',
          svg: `
            <g id="acc-chef_hat_1">
              <path d="M 76 62 C 66 48, 70 34, 86 34 C 92 24, 108 24, 114 34 C 130 34, 134 48, 124 62 Z" 
                    fill="url(#bakerHatGrad)" stroke="#3D2314" stroke-width="3.5" stroke-linejoin="round" />
              <path d="M 88 38 C 91 46, 90 53, 88 58" stroke="#DEC8B2" stroke-width="2.2" stroke-linecap="round" fill="none" />
              <path d="M 112 38 C 109 46, 110 53, 112 58" stroke="#DEC8B2" stroke-width="2.2" stroke-linecap="round" fill="none" />
              <rect x="74" y="58" width="52" height="10" rx="3.5" fill="#FFFDF5" stroke="#3D2314" stroke-width="3.5" />
              <line x1="80" y1="63" x2="120" y2="63" stroke="#FF8A80" stroke-width="1.8" stroke-linecap="round" />
            </g>
          `
        },

        /* 2-й блок: Награды за филиалы/престиж (Локации 2 -> 6) */
        {
          id: 'chef_hat_2',
          name: 'Высокий колпак шефа',
          icon: getSvgIcon('baker', 28),
          cost: 0,
          currency: 'yarn',
          unlockStage: 1,
          bonusDesc: '+3% к доходу',
          desc: 'Классический высокий шефский колпак со строгими складками',
          svg: `
            <g id="acc-chef_hat_2">
              <path d="M 82 58 C 76 38, 80 14, 94 14 C 98 6, 106 6, 110 14 C 124 14, 128 38, 122 58 Z" 
                    fill="#FFFFFF" stroke="#3D2314" stroke-width="3.5" stroke-linejoin="round" />
              <path d="M 94 20 L 93 54" stroke="#CBD5E1" stroke-width="2.2" stroke-linecap="round" />
              <path d="M 102 14 L 102 54" stroke="#CBD5E1" stroke-width="2.2" stroke-linecap="round" />
              <path d="M 110 20 L 111 54" stroke="#CBD5E1" stroke-width="2.2" stroke-linecap="round" />
              <rect x="80" y="54" width="44" height="11" rx="3" fill="#F8FAFC" stroke="#3D2314" stroke-width="3.5" />
            </g>
          `
        },
        {
          id: 'beret_royal',
          name: 'Бордовый берет с пером',
          iconSvg: 'wardrobe-icon-beret',
          cost: 0,
          currency: 'yarn',
          unlockStage: 2,
          bonusDesc: '+4% ко всем доходам',
          desc: 'Церемониальный берет шеф-мастера с золотой брошью и пушистым пером',
          svg: `
            <g id="acc-beret_royal">
              <path d="M 78 48 C 72 34, 86 22, 108 24 C 130 20, 144 30, 140 44 C 136 50, 126 52, 118 51 C 104 48, 88 50, 78 48 Z" 
                    fill="#881337" stroke="#38040E" stroke-width="3.4" stroke-linejoin="round" />
              <path d="M 82 47 C 96 45, 116 46, 128 49" fill="none" stroke="url(#goldAccMedalGrad)" stroke-width="2.4" stroke-linecap="round" />
              <path d="M 122 45 Q 140 24 154 18 Q 146 32 126 46 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.4" />
              <circle cx="124" cy="45" r="3" fill="#FACC15" stroke="#713F12" stroke-width="1.2" />
            </g>
          `
        },
        {
          id: 'gold_crown',
          name: 'Корона Мишлен',
          icon: getSvgIcon('crown', 28),
          cost: 0,
          currency: 'yarn',
          unlockStage: 3,
          bonusDesc: '+6% ко всем доходам',
          desc: 'Сверкающая золотая тиара с тремя рубинами высшей кондитерской пробы',
          svg: `
            <g id="acc-gold_crown">
              <path d="M 72 50 L 68 28 L 84 37 L 100 18 L 116 37 L 132 28 L 128 50 Z" 
                    fill="url(#goldAccMedalGrad)" stroke="#713F12" stroke-width="3" stroke-linejoin="round" />
              <rect x="70" y="46" width="60" height="9" rx="2.5" fill="url(#goldFishBodyGrad)" stroke="#713F12" stroke-width="2.5" />
              <circle cx="68" cy="26" r="3.2" fill="#EF4444" stroke="#713F12" stroke-width="1.2" />
              <circle cx="100" cy="16" r="4" fill="#EF4444" stroke="#713F12" stroke-width="1.4" />
              <circle cx="132" cy="26" r="3.2" fill="#EF4444" stroke="#713F12" stroke-width="1.2" />
            </g>
          `
        },
        {
          id: 'cyber_visor',
          name: 'Кибер-визор 2077',
          iconSvg: 'wardrobe-icon-visor',
          cost: 0,
          currency: 'yarn',
          unlockStage: 4,
          bonusDesc: '+8% к силе клика',
          desc: 'Неоновый голографический дисплей с проекцией прицела и данных выпечки',
          svg: `
            <g id="acc-cyber_visor">
              <!-- Опущен на 3px вниз (y: 94..110) ровно по линии прищуренных глаз -->
              <polygon points="48,94 152,94 145,110 55,110" 
                       fill="rgba(6, 182, 212, 0.68)" stroke="#0891b2" stroke-width="2.2" filter="drop-shadow(0 0 8px rgba(6,182,212,0.9))" />
              <!-- Глянцевый световой блик -->
              <polygon points="56,96 82,96 70,108 52,108" fill="#ffffff" opacity="0.35" />
              <polygon points="86,96 94,96 84,108 76,108" fill="#ffffff" opacity="0.2" />
              <!-- Центральный видоискатель -->
              <path d="M 94 99 L 92 99 L 92 105 L 94 105" fill="none" stroke="#ecfeff" stroke-width="1.2" opacity="0.85" />
              <path d="M 106 99 L 108 99 L 108 105 L 106 105" fill="none" stroke="#ecfeff" stroke-width="1.2" opacity="0.85" />
              <circle cx="100" cy="102" r="1.6" fill="#ecfeff" />
              <!-- Диоды -->
              <circle cx="136" cy="102" r="1.4" fill="#a5f3fc" />
              <circle cx="140" cy="102" r="1.4" fill="#a5f3fc" />
            </g>
          `
        },
        {
          id: 'astral_halo',
          name: 'Астральный нимб',
          iconSvg: 'wardrobe-icon-halo',
          cost: 0,
          currency: 'yarn',
          unlockStage: 5,
          bonusDesc: '+10% ко всем доходам',
          desc: 'Пульсирующее кольцо космической энергии с парящими вокруг звездами',
          svg: `
            <g id="acc-astral_halo">
              <!-- Опущен ближе к макушке котика (y: 25) -->
              <ellipse cx="100" cy="25" rx="44" ry="12" fill="none" stroke="#c084fc" stroke-width="3" 
                       stroke-dasharray="12,6" filter="drop-shadow(0 0 10px rgba(192,132,252,0.95))" />
              
              <g transform="translate(100, 25)">
                <g class="astral-star-node">
                  <circle cx="0" cy="0" r="3.6" fill="#ffffff" filter="drop-shadow(0 0 6px #fff)" />
                </g>
                <g class="astral-star-node node-2">
                  <circle cx="0" cy="0" r="3.2" fill="#fdf4ff" filter="drop-shadow(0 0 6px #e879f9)" />
                </g>
                <g class="astral-star-node node-3">
                  <circle cx="0" cy="0" r="3.2" fill="#fdf4ff" filter="drop-shadow(0 0 6px #c084fc)" />
                </g>
              </g>
            </g>
          `
        },

        /* 3-й блок: Покупные аксессуары за клубки пряжи (по возрастанию цены: 3 -> 5 -> 8 -> 12 -> 16 -> 25) */
        {
          id: 'glasses_cool',
          name: 'Крутые очки',
          iconSvg: 'wardrobe-icon-glasses',
          cost: 3,
          currency: 'yarn',
          bonusDesc: '+5% к клику',
          desc: 'Глянцевые черные очки с красивыми белыми бликами',
          svg: `
            <g id="acc-glasses_cool">
              <rect x="46" y="94" width="46" height="22" rx="5" fill="#111827" stroke="#000000" stroke-width="2.5" />
              <rect x="108" y="94" width="46" height="22" rx="5" fill="#111827" stroke="#000000" stroke-width="2.5" />
              <rect x="88" y="98" width="24" height="6" rx="2" fill="#111827" />
              <polygon points="54,97 62,97 50,112 48,112" fill="#FFFFFF" opacity="0.85" />
              <polygon points="66,97 71,97 58,112 54,112" fill="#FFFFFF" opacity="0.6" />
              <polygon points="116,97 124,97 112,112 110,112" fill="#FFFFFF" opacity="0.85" />
              <polygon points="128,97 133,97 120,112 116,112" fill="#FFFFFF" opacity="0.6" />
              <path d="M 46 101 L 34 100" stroke="#111827" stroke-width="4" stroke-linecap="round" />
              <path d="M 154 101 L 166 100" stroke="#111827" stroke-width="4" stroke-linecap="round" />
            </g>
          `
        },
        {
          id: 'red_bow',
          name: 'Красный бантик',
          icon: getSvgIcon('bow', 28),
          cost: 5,
          currency: 'yarn',
          bonusDesc: '+2 сек Лихорадки',
          desc: 'Яркий и объёмный красный бант у левого ушка котика',
          svg: `
            <g id="acc-red_bow">
              <ellipse cx="44" cy="58" rx="12" ry="8" fill="#E11D48" stroke="#881337" stroke-width="2.4" transform="rotate(-15 44 58)" />
              <ellipse cx="45" cy="58" rx="5" ry="3" fill="#FB7185" transform="rotate(-15 45 58)" />
              <ellipse cx="68" cy="55" rx="12" ry="8" fill="#E11D48" stroke="#881337" stroke-width="2.4" transform="rotate(15 68 55)" />
              <ellipse cx="67" cy="55" rx="5" ry="3" fill="#FB7185" transform="rotate(15 67 55)" />
              <path d="M 52 64 Q 45 74 41 80" stroke="#881337" stroke-width="3" stroke-linecap="round" fill="none" />
              <path d="M 58 64 Q 65 74 69 79" stroke="#881337" stroke-width="3" stroke-linecap="round" fill="none" />
              <circle cx="56" cy="57" r="5.2" fill="#E11D48" stroke="#881337" stroke-width="2.2" />
              <circle cx="55" cy="55.5" r="1.8" fill="#FDA4AF" />
            </g>
          `
        },
        {
          id: 'flower_wreath',
          name: 'Венок из сакуры',
          icon: getSvgIcon('flower', 28),
          cost: 8,
          currency: 'yarn',
          bonusDesc: '+3% к доходу',
          desc: 'Пышный веночек из нежных розовых цветков с листочками',
          svg: `
            <g id="acc-flower_wreath">
              <path d="M 75 58 Q 100 48 125 58" fill="none" stroke="#65A30D" stroke-width="2.8" stroke-linecap="round" />
              <ellipse cx="85" cy="51" rx="4.5" ry="2.2" fill="#84CC16" transform="rotate(-20 85 51)" />
              <ellipse cx="115" cy="51" rx="4.5" ry="2.2" fill="#84CC16" transform="rotate(20 115 51)" />
              <ellipse cx="100" cy="46" rx="4.2" ry="2.2" fill="#84CC16" />
              <g transform="translate(80, 54)">
                <circle cx="0" cy="-4" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="4" cy="-1" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="2" cy="4" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="-3" cy="3" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="-4" cy="-2" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="0" cy="0" r="2.2" fill="#FDE047" stroke="#CA8A04" stroke-width="0.8" />
              </g>
              <g transform="translate(100, 48)">
                <circle cx="0" cy="-4.5" r="4.2" fill="#FCE7F3" stroke="#DB2777" stroke-width="1" />
                <circle cx="4.5" cy="-1" r="4.2" fill="#FCE7F3" stroke="#DB2777" stroke-width="1" />
                <circle cx="2.5" cy="4.5" r="4.2" fill="#FCE7F3" stroke="#DB2777" stroke-width="1" />
                <circle cx="-3.5" cy="3.5" r="4.2" fill="#FCE7F3" stroke="#DB2777" stroke-width="1" />
                <circle cx="-4.5" cy="-2" r="4.2" fill="#FCE7F3" stroke="#DB2777" stroke-width="1" />
                <circle cx="0" cy="0" r="2.6" fill="#FDE047" stroke="#CA8A04" stroke-width="0.9" />
              </g>
              <g transform="translate(120, 54)">
                <circle cx="0" cy="-4" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="4" cy="-1" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="2" cy="4" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="-3" cy="3" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="-4" cy="-2" r="3.6" fill="#FBCFE8" stroke="#DB2777" stroke-width="0.9" />
                <circle cx="0" cy="0" r="2.2" fill="#FDE047" stroke="#CA8A04" stroke-width="0.8" />
              </g>
            </g>
          `
        },
        {
          id: 'devil_horns',
          name: 'Озорной чертёнок',
          icon: getSvgIcon('devil', 28),
          cost: 12,
          currency: 'yarn',
          bonusDesc: '+10% к улову рыбки',
          desc: 'Симпатичные рубиновые рожки на лобике и хвостик со стрелочкой',
          svg: `
            <g id="acc-devil_horns">
              <path d="M 148 165 C 168 162, 182 148, 178 132 C 175 124, 166 122, 169 114 C 172 107, 182 106, 186 111" 
                    fill="none" stroke="#3D2314" stroke-width="4.5" stroke-linecap="round" />
              <path d="M 148 165 C 168 162, 182 148, 178 132 C 175 124, 166 122, 169 114 C 172 107, 182 106, 186 111" 
                    fill="none" stroke="#DC2626" stroke-width="2.6" stroke-linecap="round" />
              <polygon points="186,102 195,113 181,116" fill="#EF4444" stroke="#3D2314" stroke-width="2.5" stroke-linejoin="round" />

              <path d="M 76 55 C 73 47, 69 41, 75 39 C 80 43, 84 48, 83 55 Z" 
                    fill="url(#devilHornGrad)" stroke="#3D2314" stroke-width="2.6" stroke-linejoin="round" />
              <path d="M 75 48 Q 77 43 76 41" fill="none" stroke="#FECACA" stroke-width="1.2" stroke-linecap="round" />

              <path d="M 117 55 C 117 47, 121 41, 125 39 C 131 43, 127 48, 124 55 Z" 
                    fill="url(#devilHornGrad)" stroke="#3D2314" stroke-width="2.6" stroke-linejoin="round" />
              <path d="M 124 48 Q 122 43 123 41" fill="none" stroke="#FECACA" stroke-width="1.2" stroke-linecap="round" />
            </g>
          `
        },
        {
          id: 'love_hearts',
          name: 'Парящие сердечки',
          icon: getSvgIcon('heart', 28),
          cost: 16,
          currency: 'yarn',
          bonusDesc: '+5% к Лихорадке',
          desc: 'Три нежных парящих сердечка вокруг довольного котика',
          svg: `
            <g id="acc-love_hearts">
              <g transform="translate(38, 38)">
                <g class="floating-heart" transform="rotate(-8)">
                  <path d="M 10 17 C 10 17 2 12 2 7 C 2 4 4.2 2 7 2 C 8.8 2 10 3 10 4.5 C 10 3 11.2 2 13 2 C 15.8 2 18 4 18 7 C 18 12 10 17 10 17 Z" 
                        fill="url(#heartGrad)" stroke="#3D2314" stroke-width="1.8" stroke-linejoin="round" />
                  <ellipse cx="5.5" cy="5" rx="1.6" ry="1" fill="#FFE4E6" transform="rotate(-30 5.5 5)" />
                </g>
              </g>

              <g transform="translate(158, 32)">
                <g class="floating-heart" transform="rotate(14)">
                  <path d="M 11 19 C 11 19 2 13 2 7.5 C 2 4.2 4.6 2 7.8 2 C 9.8 2 11 3.2 11 5 C 11 3.2 12.2 2 14.2 2 C 17.4 2 20 4.2 20 7.5 C 20 13 11 19 11 19 Z" 
                        fill="url(#heartGrad)" stroke="#3D2314" stroke-width="2" stroke-linejoin="round" />
                  <ellipse cx="6" cy="5.5" rx="1.8" ry="1" fill="#FFE4E6" transform="rotate(-30 6 5.5)" />
                </g>
              </g>

              <g transform="translate(168, 94)">
                <g class="floating-heart" transform="rotate(-10)">
                  <path d="M 8 14 C 8 14 1.5 10 1.5 5.5 C 1.5 3 3.5 1.5 5.5 1.5 C 7 1.5 8 2.2 8 3.5 C 8 2.2 9 1.5 10.5 1.5 C 12.5 1.5 14.5 3 14.5 5.5 C 14.5 10 8 14 8 14 Z" 
                        fill="url(#heartGrad)" stroke="#3D2314" stroke-width="1.6" stroke-linejoin="round" />
                  <ellipse cx="4.5" cy="4" rx="1.3" ry="0.8" fill="#FFE4E6" transform="rotate(-30 4.5 4)" />
                </g>
              </g>
            </g>
          `
        },
        {
          id: 'magic_tophat',
          name: 'Цилиндр фокусника',
          iconSvg: 'wardrobe-icon-tophat',
          cost: 25,
          currency: 'yarn',
          bonusDesc: '+5% ко всем доходам',
          desc: 'Шелковый вечерний цилиндр с фиолетовой лентой и золотой пряжкой',
          svg: `
            <g id="acc-magic_tophat">
              <!-- Поля цилиндра -->
              <ellipse cx="100" cy="54" rx="36" ry="7" fill="#1e1b4b" stroke="#0f172a" stroke-width="2.5" />
              <!-- Тулья цилиндра -->
              <path d="M 74 52 L 77 18 C 77 16, 85 14, 100 14 C 115 14, 123 16, 123 18 L 126 52 Z" 
                    fill="#1e1b4b" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round" />
              <ellipse cx="100" cy="18" rx="23" ry="5.5" fill="#312e81" stroke="#0f172a" stroke-width="1.8" />
              <!-- Шёлковая фиолетовая лента -->
              <path d="M 74.5 44 C 84 46, 116 46, 125.5 44 L 126 51 C 116 53, 84 53, 74 51 Z" fill="#9333ea" />
              <!-- Золотая пряжка -->
              <rect x="94" y="43" width="12" height="9" rx="2" fill="#fbbf24" stroke="#b45309" stroke-width="1.2" />
              <rect x="97" y="45.5" width="6" height="4" rx="1" fill="#1e1b4b" />
              <!-- Магические искры над шляпой -->
              <circle cx="68" cy="22" r="1.8" fill="#fde047" opacity="0.85" />
              <circle cx="132" cy="28" r="1.5" fill="#fde047" opacity="0.85" />
            </g>
          `
        }
      ],
      neck: [
        /* 1-й блок: Базовые вещи (Локация 1: Уютная кухня) */
        {
          id: 'neck_none',
          name: 'Без украшений',
          icon: getSvgIcon('cancel', 26),
          cost: 0,
          currency: 'yarn',
          isBase: true,
          bonusDesc: 'По умолчанию',
          desc: 'Оставить животик и подбородок котика свободными',
          svg: ''
        },

        /* 2-й блок: Награды за филиалы/престиж (Локации 2 -> 6) */
        {
          id: 'red_bowtie',
          name: 'Шейная бабочка',
          icon: getSvgIcon('bow', 28),
          cost: 0,
          currency: 'yarn',
          unlockStage: 1,
          bonusDesc: '+3% к клику',
          desc: 'Элегантная красная бабочка с золотым зажимом на пузике',
          svg: `
            <g id="acc-red_bowtie">
              <polygon points="90,138 100,141 90,145" fill="#E11D48" stroke="#881337" stroke-width="1.8" />
              <polygon points="110,138 100,141 110,145" fill="#E11D48" stroke="#881337" stroke-width="1.8" />
              <circle cx="100" cy="141" r="3.4" fill="url(#goldAccMedalGrad)" stroke="#713F12" stroke-width="1.2" />
            </g>
          `
        },
        {
          id: 'gold_medal',
          name: 'Золотой орден шефа',
          iconSvg: 'wardrobe-icon-order',
          cost: 0,
          currency: 'yarn',
          unlockStage: 2,
          bonusDesc: '+15% к улову рыбки',
          desc: 'Приколотый золотой орден с кошачьей лапкой прямо на манишке',
          svg: `
            <g id="acc-gold_medal" pointer-events="none">
              <!-- Смещено левее на x: 72 (было 82), лежит строго по левой стороне манишки -->
              <circle cx="72" cy="136" r="9.5" fill="url(#goldMedalBroochGrad)" stroke="#3D2314" stroke-width="1.6" />
              <circle cx="72" cy="136" r="7.4" fill="none" stroke="#B45309" stroke-width="0.75" stroke-dasharray="1.5,1.2" />
              <ellipse cx="72" cy="137.3" rx="3.0" ry="2.2" fill="#B45309" />
              <circle cx="69" cy="134" r="1.0" fill="#B45309" />
              <circle cx="72" cy="132.8" r="1.0" fill="#B45309" />
              <circle cx="75" cy="134" r="1.0" fill="#B45309" />
              <path d="M 66.5 132.5 A 7 7 0 0 1 74.8 128.5" stroke="#FFFFFF" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.85" />
            </g>
          `
        },
        {
          id: 'ruby_collar',
          name: 'Рубиновое колье',
          icon: getSvgIcon('heart', 28),
          cost: 0,
          currency: 'yarn',
          unlockStage: 3,
          bonusDesc: '+5% к клику',
          desc: 'Тёмно-изумрудный бархатный ошейник с сияющим огранённым рубином',
          svg: `
            <g id="acc-ruby_collar" pointer-events="none">
              <path d="M 30 126 Q 100 156 170 126" fill="none" stroke="#064e3b" stroke-width="4.5" stroke-linecap="round" />
              <polygon points="100,140 107,147 100,154 93,147" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.2" />
              <circle cx="98.5" cy="145" r="1.2" fill="#fca5a5" />
            </g>
          `
        },
        {
          id: 'neon_choker',
          name: 'Кибер-ошейник',
          icon: getSvgIcon('lightning', 28),
          cost: 0,
          currency: 'yarn',
          unlockStage: 4,
          bonusDesc: '+5% к выпечке пекарей',
          desc: 'Матовый неоновый чокер с микрочипом и светодиодным питанием',
          svg: `
            <g id="acc-neon_choker" pointer-events="none">
              <path d="M 30 126 Q 100 156 170 126" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" />
              <path d="M 32 126 Q 100 156 168 126" fill="none" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" filter="drop-shadow(0 0 6px #06b6d4)" />
              <rect x="92" y="141" width="16" height="8" rx="2.5" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
              <circle cx="100" cy="145" r="1.8" fill="#ffffff" />
            </g>
          `
        },
        {
          id: 'star_pendant',
          name: 'Кулон «Сверхновая»',
          icon: getSvgIcon('star', 28),
          cost: 0,
          currency: 'yarn',
          unlockStage: 5,
          bonusDesc: '+20% к улову рыбки',
          desc: 'Фрагмент настоящей метеоритной пыли в филигранной платиновой оправе',
          svg: `
            <g id="acc-star_pendant" pointer-events="none">
              <path d="M 32 124 Q 100 158 168 124" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
              <polygon points="100,142 103,149 110,152 103,155 100,162 97,155 90,152 97,149" 
                       fill="#f3e8ff" stroke="#9333ea" stroke-width="1.5" filter="drop-shadow(0 0 8px #c084fc)" />
              <circle cx="100" cy="152" r="2" fill="#ffffff" />
            </g>
          `
        },
        /* Покупные аксессуары для шеи за клубки пряжи */
        { id: 'bell_collar', name: 'Бубенчик на ленточке', icon: getSvgIcon('bell', 28), cost: 15, currency: 'yarn', bonusDesc: '+20% к частоте посылок-сюрпризов', desc: 'Маленький звенящий бубенчик на нежной ленточке', effect: { boxSpawnRateBonus: 0.2 } },
        { id: 'knit_scarf', name: 'Вязаный шарф', icon: getSvgIcon('herb', 28), cost: 40, currency: 'yarn', bonusDesc: '+5 сек к длительности Сна и Мурчания', desc: 'Тёплый вязаный шарф из муршерстяных ниток', effect: { sleepAndPurrDurationBonus: 5 } },
        { id: 'barista_bowtie', name: 'Бабочка бариста', icon: getSvgIcon('bow', 28), cost: 80, currency: 'yarn', bonusDesc: '+15% времени на Срочные контракты', desc: 'Стильная бабочка настоящего кофейного мастера', effect: { contractTimeBonus: 0.15 } },
        { id: 'neon_collar', name: 'Неоновый ошейник', icon: getSvgIcon('lightning', 28), cost: 150, currency: 'yarn', bonusDesc: 'x2 награда за радужные пузыри', desc: 'Светящийся ошейник цвета радужной глазури', effect: { bubbleRewardMult: 2 } },
      ]
    };
    function hasWardrobeUnlocked(state, id) {
      return Array.isArray(state?.meta?.wardrobe?.unlocked) && state.meta.wardrobe.unlocked.includes(id);
    }

    function getMaxFeverDuration(state) {
      const jarLvl = state.meta?.shop?.fishJar || 0;
      let duration = 15.0 + jarLvl * 2.0;
      if (hasWardrobeUnlocked(state, 'red_bow')) {
        duration += 2.0;
      }
      return duration;
    }

    function getPrestigeThresholds(allTime, state) {
      const inspectorLvl = state?.meta?.perks?.generous_inspector || 0;
      const discountMult = 1 - Math.min(0.25, inspectorLvl * 0.05);

      let starIndex = 0;
      while (allTime >= Math.floor(getPrestigeThresholdByIndex(starIndex + 1) * discountMult)) {
        starIndex++;
      }

      const prev = Math.floor(getPrestigeThresholdByIndex(starIndex) * discountMult);
      const next = Math.floor(getPrestigeThresholdByIndex(starIndex + 1) * discountMult);
      return { prev, next };
    }

    function calculatePrestigeReward(state) {
      const currentPrestige = state.meta?.prestigeCount || 0;
      if (currentPrestige >= LOCATIONS_CONFIG.length - 1) return 0;

      const nextLoc = LOCATIONS_CONFIG[currentPrestige + 1];
      // Учитываем выпечку строго внутри текущего филиала
      const runBaked = Math.max(state.run?.cookies || 0, state.run?.lifetimeCookiesRun || 0);
      const inspectorLvl = state?.meta?.perks?.generous_inspector || 0;
      const discountMult = 1 - Math.min(0.25, inspectorLvl * 0.05);
      const targetReq = Math.floor(nextLoc.reqCookies * discountMult);

      const starsByBranch = [0, 5, 15, 35, 75, 150];
      const reward = starsByBranch[currentPrestige + 1] || 10;

      return runBaked >= targetReq ? reward : 0;
    }

    const PRESTIGE_PERKS_CONFIG = {
      start_van: {
        id: 'start_van',
        name: 'Стартовый фургон',
        desc: 'Дает +2 Лапколапа сразу после переезда за каждый уровень',
        icon: getSvgIcon('van', 22),
        maxLevel: 10,
        getCost: (l) => (l === 0 ? 1 : (l + 1) * 2)
      },
      strong_paws: {
        id: 'strong_paws',
        name: 'Крепкие лапки',
        desc: '+100% к силе клика и синергии за каждый уровень',
        icon: getSvgIcon('paw', 22),
        maxLevel: 20,
        getCost: (l) => (l === 0 ? 1 : Math.floor(1 * Math.pow(1.35, l)))
      },
      cat_sleep: {
        id: 'cat_sleep',
        name: 'Кошачий сон',
        desc: 'Увеличивает максимальный сон без вас: 4ч → 6ч → 8ч → 12ч → 16ч',
        icon: getSvgIcon('cat_sleep', 22),
        maxLevel: 4,
        getCost: (l) => (l === 0 ? 1 : (l + 1) * 5)
      },
      bulk_buy: {
        id: 'bulk_buy',
        name: 'Оптовая закупка',
        desc: 'Постоянная скидка -1% на всех пекарей (до -10%)',
        icon: getSvgIcon('tag', 22),
        maxLevel: 10,
        getCost: (l) => (l === 0 ? 1 : (l + 1) * 3)
      },
      generous_inspector: {
        id: 'generous_inspector',
        name: 'Щедрый инспектор',
        desc: 'Снижает порог выпечки для филиалов на 4% за уровень (до -40%)',
        icon: getSvgIcon('inspector', 22),
        maxLevel: 10,
        getCost: (l) => (l === 0 ? 1 : (l + 1) * 4)
      },
    auto_baker: { id: 'auto_baker', name: 'Авто-булочник', desc: 'Автоклик по коту 2 раза/сек за уровень (до 10/сек)', icon: getSvgIcon('cookie', 22), maxLevel: 5, getCost: (l) => (l === 0 ? 6 : (l + 1) * 5) },
    crit_crust: { id: 'crit_crust', name: 'Хрустящий крит', desc: '+3% за уровень шанс критического клика x10', icon: getSvgIcon('lightning', 22), maxLevel: 10, getCost: (l) => (l === 0 ? 4 : (l + 1) * 3) },
    fish_magnet: { id: 'fish_magnet', name: 'Рыбный магнит', desc: 'Рыбки летят на 25% медленнее и появляются чаще', icon: getSvgIcon('fish', 22), maxLevel: 4, getCost: (l) => (l === 0 ? 5 : (l + 1) * 4) },
    paw_memory: { id: 'paw_memory', name: 'Память лапок', desc: 'Сохраняет 5% за уровень от прокачки клика после переезда', icon: getSvgIcon('paw', 22), maxLevel: 5, getCost: (l) => (l === 0 ? 7 : (l + 1) * 5) },
    };

    const ACHIEVEMENTS_CONFIG = [
      { id: 'click_warmup', icon: getSvgIcon('paw', 24), title: 'Разминка лапок', desc: 'Сделайте первые 100 нажатий по тесту', rewardFish: 1, goal: 100, getProgress: (s) => Math.min(s.stats?.totalClicks || 0, 100), isUnlocked: (s) => (s.stats?.totalClicks || 0) >= 100 },
      { id: 'click_master', icon: getSvgIcon('lightning', 24), title: 'Мастер-разминатель', desc: 'Сделайте 1 000 нажатий по тесту', rewardFish: 3, goal: 1000, getProgress: (s) => Math.min(s.stats?.totalClicks || 0, 1000), isUnlocked: (s) => (s.stats?.totalClicks || 0) >= 1000 },
      { id: 'first_batch', icon: getSvgIcon('cookie', 24), title: 'Первая свежая выпечка', desc: 'Заработайте суммарно 10 000 печенек', rewardFish: 1, goal: 10000, getProgress: (s) => Math.min(s.stats?.totalCookiesAllTime || 0, 10000), isUnlocked: (s) => (s.stats?.totalCookiesAllTime || 0) >= 10000 },
      { id: 'cookie_millionaire', icon: getSvgIcon('money_bag', 24), title: 'Печеньковый миллионер', desc: 'Напеките 1 000 000 печенек за всё время', rewardFish: 3, goal: 1000000, getProgress: (s) => Math.min(s.stats?.totalCookiesAllTime || 0, 1000000), isUnlocked: (s) => (s.stats?.totalCookiesAllTime || 0) >= 1000000 },
      { id: 'bakery_empire', icon: getSvgIcon('crown', 24), title: 'Сдобная империя', desc: 'Преодолейте планку в 100 000 000 выпечки', rewardFish: 5, goal: 100000000, getProgress: (s) => Math.min(s.stats?.totalCookiesAllTime || 0, 100000000), isUnlocked: (s) => (s.stats?.totalCookiesAllTime || 0) >= 100000000 },
      { id: 'lapkolap_brigade', icon: getSvgIcon('cat_sleep', 24), title: 'Кошачья бригада', desc: 'Наймите 25 поварят Лапколапов', rewardFish: 2, goal: 25, getProgress: (s) => Math.min(s.run?.generators?.lapkolap || 0, 25), isUnlocked: (s) => (s.run?.generators?.lapkolap || 0) >= 25 },
      { id: 'hire_chef_murych', icon: getSvgIcon('baker', 24), title: 'Звездный шеф на кухне', desc: 'Наймите легендарного Шефа Мурыча', rewardFish: 5, goal: 1, getProgress: (s) => Math.min(s.run?.generators?.chef_murych || 0, 1), isUnlocked: (s) => (s.run?.generators?.chef_murych || 0) >= 1 },
      { id: 'automated_bakery', icon: getSvgIcon('star', 24), title: 'Полный штат', desc: 'Наймите хотя бы по 1 пекарю каждого типа', rewardFish: 3, goal: 1, getProgress: (s) => { const g = s.run?.generators; return (g && g.lapkolap >= 1 && g.mur_pech >= 1 && g.kot_barista >= 1 && g.courier >= 1 && g.chef_murych >= 1) ? 1 : 0; }, isUnlocked: (s) => { const g = s.run?.generators; return g && g.lapkolap >= 1 && g.mur_pech >= 1 && g.kot_barista >= 1 && g.courier >= 1 && g.chef_murych >= 1; } },
      { id: 'first_relocation', icon: getSvgIcon('star', 24), title: 'Новый филиал', desc: 'Совершите свой первый переезд в новый филиал', rewardFish: 10, goal: 1, getProgress: (s) => Math.min(s.meta?.prestigeCount || 0, 1), isUnlocked: (s) => (s.meta?.prestigeCount || 0) >= 1 },
      { id: 'fish_collector', icon: getSvgIcon('fish', 24), title: 'Рыбный коллекционер', desc: 'Поймайте 20 золотых рыбок', rewardFish: 5, goal: 20, getProgress: (s) => Math.min(s.stats?.fishCaught || 0, 20), isUnlocked: (s) => (s.stats?.fishCaught || 0) >= 20 },
      { id: 'wardrobe_fan', icon: getSvgIcon('wardrobe', 24), title: 'Модник пекарни', desc: 'Купите 5 любых предметов в Гардеробе', rewardFish: 4, goal: 5, getProgress: (s) => (function(){ var w=s.meta&&s.meta.wardrobe?Object.keys(s.meta.wardrobe).filter(function(k){return ['selectedSkin','selectedHead','selectedNeck'].indexOf(k)<0;}).length:0; return Math.min(w,5); })(), isUnlocked: (s) => (function(){ var w=s.meta&&s.meta.wardrobe?Object.keys(s.meta.wardrobe).filter(function(k){return ['selectedSkin','selectedHead','selectedNeck'].indexOf(k)<0;}).length:0; return w>=5; })() },
      { id: 'fever_veteran', icon: getSvgIcon('fire', 24), title: 'Лихорадочный пекарь', desc: 'Активируйте Лихорадку выпечки 10 раз', rewardFish: 8, goal: 10, getProgress: (s) => Math.min(s.stats?.feverActivations || 0, 10), isUnlocked: (s) => (s.stats?.feverActivations || 0) >= 10 },
      { id: 'box_opener', icon: getSvgIcon('box', 24), title: 'Открыватель сюрпризов', desc: 'Откройте 30 посылок-сюрпризов', rewardFish: 3, goal: 30, getProgress: (s) => Math.min(s.stats?.boxesCaught || 0, 30), isUnlocked: (s) => (s.stats?.boxesCaught || 0) >= 30 },
      { id: 'cookie_billionaire', icon: getSvgIcon('star', 24), title: 'Печеньковый миллиардер', desc: 'Напеките 1 000 000 000 печенек за всё время', rewardFish: 10, goal: 1000000000, getProgress: (s) => Math.min(s.stats?.totalCookiesAllTime || 0, 1000000000), isUnlocked: (s) => (s.stats?.totalCookiesAllTime || 0) >= 1000000000 },
      { id: 'speed_demon', icon: getSvgIcon('timelapse', 24), title: 'Скоростной заквас', desc: 'Наберите пассивный доход свыше 50 000 в секунду', rewardFish: 6, goal: 50000, getProgress: (s) => Math.min(s.run?.totalRate || 0, 50000), isUnlocked: (s) => (s.run?.totalRate || 0) >= 50000 },
    ];

/* === Экспорт в глобальную область (window) ===
   const на верхнем уровне скрипта не попадает в window автоматически,
   поэтому явно пробрасываем каждое имя, чтобы им пользовались другие модули. */
window.KotoApp = window.KotoApp || {};
window.STORAGE_KEY = STORAGE_KEY;
window.FEVER_CIRCUMFERENCE = FEVER_CIRCUMFERENCE;
window.GENERATOR_IDS = GENERATOR_IDS;
window.PERK_IDS = PERK_IDS;
window.GENERATORS_CONFIG = GENERATORS_CONFIG;
window.GENERATOR_ICONS = GENERATOR_ICONS;
window.MILESTONES = MILESTONES;
window.LOCATIONS_CONFIG = LOCATIONS_CONFIG;
window.LOCATION_THEMES = LOCATION_THEMES;
window.CAT_SKINS_CATALOG = CAT_SKINS_CATALOG;
window.WARDROBE_CATALOG = WARDROBE_CATALOG;
window.PRESTIGE_PERKS_CONFIG = PRESTIGE_PERKS_CONFIG;
window.ACHIEVEMENTS_CONFIG = ACHIEVEMENTS_CONFIG;
window.hasWardrobeUnlocked = hasWardrobeUnlocked;
window.getMaxFeverDuration = getMaxFeverDuration;
window.getPrestigeThresholdByIndex = getPrestigeThresholdByIndex;
window.getPrestigeThresholds = getPrestigeThresholds;
window.getTotalPurchasedPerks = getTotalPurchasedPerks;
window.calculatePrestigeReward = calculatePrestigeReward;
window.getFishIconSvg = getFishIconSvg;
window.getYarnIconSvg = getYarnIconSvg;
Object.assign(window.KotoApp, {
  STORAGE_KEY, FEVER_CIRCUMFERENCE, GENERATOR_IDS, PERK_IDS,
  GENERATORS_CONFIG, GENERATOR_ICONS, MILESTONES, LOCATIONS_CONFIG, LOCATION_THEMES,
  CAT_SKINS_CATALOG, WARDROBE_CATALOG, PRESTIGE_PERKS_CONFIG, ACHIEVEMENTS_CONFIG,
  hasWardrobeUnlocked, getMaxFeverDuration,
  getPrestigeThresholdByIndex, getPrestigeThresholds, getTotalPurchasedPerks,
  calculatePrestigeReward, getFishIconSvg, getYarnIconSvg
});