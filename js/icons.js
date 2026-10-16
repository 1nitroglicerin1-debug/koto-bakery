/* ===========================================================================
   icons.js — каталог SVG-иконок (getSvgIcon) + автоинициализация data-icon
   Извлечено 1-в-1 из исходного index.html (Фаза 1 рефакторинга).
   Автоинициализация: элементы с [data-icon] получают иконку из getSvgIcon,
   сохраняя исходные классы/инлайн-стили (иконка вставляется внутрь контейнера).
   =========================================================================== */
function getSvgIcon(name, size = 16) {
  const s = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"`;
  switch (name) {
    case 'paw':
      return `<svg ${s}><ellipse cx="12" cy="15.5" rx="4.8" ry="3.8" fill="#ff6d00"/><circle cx="6.5" cy="10" r="2.2" fill="#ff6d00"/><circle cx="10" cy="6.8" r="2.2" fill="#ff6d00"/><circle cx="14" cy="6.8" r="2.2" fill="#ff6d00"/><circle cx="17.5" cy="10" r="2.2" fill="#ff6d00"/></svg>`;
    case 'cookie':
      return `<svg ${s}><circle cx="12" cy="12" r="9.5" fill="#e09e53" stroke="#a06023" stroke-width="1.2"/><circle cx="8" cy="9" r="1.5" fill="#5c2e0b"/><circle cx="15.5" cy="8.5" r="1.4" fill="#5c2e0b"/><circle cx="11.5" cy="14" r="1.6" fill="#5c2e0b"/><circle cx="16" cy="15.5" r="1.3" fill="#5c2e0b"/><circle cx="7.5" cy="14.5" r="1.2" fill="#5c2e0b"/></svg>`;
    case 'star':
      return `<svg ${s}><path d="M12 2L14.9 8.5L22 9.2L16.7 14L18.2 21L12 17.3L5.8 21L7.3 14L2 9.2L9.1 8.5L12 2Z" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
    case 'trophy':
      return `<svg ${s}><path d="M7 4H17V9C17 11.8 14.8 14 12 14C9.2 14 7 11.8 7 9V4Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/><path d="M7 6H4C3.4 6 3 6.4 3 7C3 9 4.5 10.6 6.5 10.9M17 6H20C20.6 6 21 6.4 21 7C21 9 19.5 10.6 17.5 10.9" stroke="#b45309" stroke-width="1.2" stroke-linecap="round"/><path d="M10 14V17H14V14M8 20H16V17H8V20Z" fill="#d97706" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
    case 'gear':
      return `<svg ${s}><circle cx="12" cy="12" r="3" fill="#94a3b8" stroke="#475569" stroke-width="1.2"/><path d="M12 2V4M12 20V22M4 12H2M22 12H20M5 5L6.5 6.5M17.5 17.5L19 19M5 19L6.5 17.5M17.5 6.5L19 5" stroke="#64748b" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="6" stroke="#64748b" stroke-width="1.5"/></svg>`;
    case 'lightning':
      return `<svg ${s}><polygon points="13,2 4,13 11,13 10,22 20,10 13,10" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
    case 'crown':
      return `<svg ${s}><path d="M4 18L2 7L7.5 12L12 5L16.5 12L22 7L20 18H4Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/><circle cx="2" cy="7" r="1.2" fill="#ef4444"/><circle cx="12" cy="5" r="1.2" fill="#ef4444"/><circle cx="22" cy="7" r="1.2" fill="#ef4444"/></svg>`;
    case 'baker':
      return `<svg ${s}><path d="M6 14C3.5 14 2 11.5 3 9C2.5 6 6 4 8.5 5.5C10 3 14 3 15.5 5.5C18 4 21.5 6 21 9C22 11.5 20.5 14 18 14Z" fill="#ffffff" stroke="#78350f" stroke-width="1.2"/><rect x="6" y="14" width="12" height="5" rx="1.5" fill="#fef3c7" stroke="#78350f" stroke-width="1.2"/></svg>`;
    case 'croissant':
      return `<svg ${s}><path d="M4 14C3 11 5 7 9 5C13 3 17 5 19 8C21 11 21 14 19 16C17 18 13 19 9 17C6 16 4 14 4 14Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/><path d="M8 7C10 6 14 7 16 9M7 11C9 10 13 11 15 13" stroke="#fef3c7" stroke-width="1.2" stroke-linecap="round"/></svg>`;
    case 'flask':
      return `<svg ${s}><path d="M9 3H15M10 3V8L5 18C4 20 5.5 21 7 21H17C18.5 21 20 20 19 18L14 8V3" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16H17L15 12H9L7 16Z" fill="#a7f3d0"/></svg>`;
    case 'robot':
      return `<svg ${s}><rect x="5" y="7" width="14" height="12" rx="3" fill="#06b6d4" stroke="#0891b2" stroke-width="1.2"/><circle cx="9" cy="12" r="1.5" fill="#fff"/><circle cx="15" cy="12" r="1.5" fill="#fff"/><line x1="12" y1="3" x2="12" y2="7" stroke="#0891b2" stroke-width="1.5"/><circle cx="12" cy="3" r="1.5" fill="#ec4899"/><line x1="8" y1="16" x2="16" y2="16" stroke="#164e63" stroke-width="1.2" stroke-linecap="round"/></svg>`;
    case 'portal':
      return `<svg ${s}><ellipse cx="12" cy="12" rx="8" ry="9.5" fill="#3b0764" stroke="#a855f7" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4.5" ry="6" fill="#c084fc"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>`;
    case 'fire':
      return `<svg ${s}><path d="M12 2C10 6 7 9 7 13C7 16.5 9.5 19 12 19C14.5 19 17 16.5 17 13C17 9 14 6 12 2Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1.2"/><path d="M12 8C11 10.5 9.5 12 9.5 14C9.5 15.5 10.5 17 12 17C13.5 17 14.5 15.5 14.5 14C14.5 12 13 10.5 12 8Z" fill="#fbbf24"/></svg>`;
    case 'coffee':
      return `<svg ${s}><rect x="4" y="8" width="12" height="11" rx="3" fill="#854d0e" stroke="#582f0e" stroke-width="1.2"/><path d="M16 10H18C19.5 10 20.5 11 20.5 12.5C20.5 14 19.5 15 18 15H16" stroke="#582f0e" stroke-width="1.2" stroke-linecap="round"/><path d="M7 5C7 5 7.5 3 9 3M11 5C11 5 11.5 3 13 3" stroke="#d97706" stroke-width="1" stroke-linecap="round"/></svg>`;
    case 'scooter':
      return `<svg ${s}><circle cx="6" cy="17" r="3" fill="#64748b" stroke="#334155" stroke-width="1.2"/><circle cx="18" cy="17" r="3" fill="#64748b" stroke="#334155" stroke-width="1.2"/><path d="M6 17H12L15 10H9L8 6H5M15 10L17 17" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case 'cat_sleep':
      return `<svg ${s}><circle cx="12" cy="13" r="7.5" fill="#fed7aa" stroke="#7c2d12" stroke-width="1.2"/><path d="M6 8L8 11M18 8L16 11" stroke="#7c2d12" stroke-width="1.4" stroke-linecap="round"/><path d="M9 14Q10.5 15 12 14Q13.5 15 15 14" stroke="#7c2d12" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="M16 4H19L16 7H19M19 1H21L19 3H21" stroke="#3b82f6" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case 'cancel':
      return `<svg ${s}><circle cx="12" cy="12" r="8" fill="none" stroke="#94a3b8" stroke-width="1.5"/><line x1="7" y1="7" x2="17" y2="17" stroke="#ef4444" stroke-width="1.5"/></svg>`;
    case 'sound_on':
      return `<svg ${s}><polygon points="3,9 7,9 12,4 12,20 7,15 3,15" fill="#10b981" stroke="#047857" stroke-width="1.2"/><path d="M16 8C17.5 9.5 17.5 14.5 16 16M19 5C22 8 22 16 19 19" stroke="#047857" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>`;
    case 'sound_off':
      return `<svg ${s}><polygon points="3,9 7,9 12,4 12,20 7,15 3,15" fill="#94a3b8" stroke="#475569" stroke-width="1.2"/><line x1="16" y1="9" x2="21" y2="15" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/><line x1="21" y1="9" x2="16" y2="15" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case 'music_on':
      return `<svg ${s}><path d="M9 18V5L20 3V16" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="#10b981"/><circle cx="17" cy="16" r="3" fill="#10b981"/></svg>`;
    case 'music_off':
      return `<svg ${s}><path d="M9 18V5L20 3V16" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="#94a3b8"/><circle cx="17" cy="16" r="3" fill="#94a3b8"/><line x1="4" y1="4" x2="20" y2="20" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case 'money_bag':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M12 4 C10 4 9 2.5 7.5 3 C6.5 3.5 7 5.5 8.5 6 C5 8 3.5 12 4 16 C4.5 20.5 8 22 12 22 C16 22 19.5 20.5 20 16 C20.5 12 19 8 15.5 6 C17 5.5 17.5 3.5 16.5 3 C15 2.5 14 4 12 4 Z" fill="#e67e22" stroke="#b95c00" stroke-width="1.2"/><path d="M7.5 6.5 C10 8 14 8 16.5 6.5" stroke="#f1c40f" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="14" r="4.5" fill="#f1c40f" stroke="#b95c00" stroke-width="1"/><text x="12" y="17" font-size="6.5" font-weight="900" fill="#783d00" text-anchor="middle" font-family="Arial, sans-serif">$</text></svg>`;
    case 'wardrobe':
      return `<svg ${s}><path d="M12 4C10.5 4 10 5.5 10 6.5C10 8 12 8.5 12 10L3 15V17H21V15L12 10" stroke="#9b59b6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="18.5" r="1" fill="#9b59b6"/></svg>`;
    case 'box':
      return `<svg ${s}><rect x="4" y="9" width="16" height="12" rx="2" fill="#d97706" stroke="#78350f" stroke-width="1.2"/><path d="M2 9L12 4L22 9" stroke="#78350f" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="9" x2="12" y2="21" stroke="#78350f" stroke-width="1.2"/><rect x="10" y="9" width="4" height="12" fill="#fde68a"/></svg>`;
    case 'fish':
      return `<svg ${s}><path d="M4 12C1 8 2 5 3 4C6 8 8 10 11 9L15 6C19 6 22 9 22 12C22 15 19 18 15 18L11 15C8 14 6 16 3 20C2 19 1 16 4 12Z" fill="#ffb300" stroke="#ff8f00" stroke-width="1"/><circle cx="18.5" cy="10.5" r="1.2" fill="#2d1600"/><circle cx="18.8" cy="10.2" r="0.4" fill="#fff"/></svg>`;
    case 'clock':
      return `<svg ${s}><circle cx="12" cy="12" r="8.5" fill="#f8fafc" stroke="#475569" stroke-width="1.3"/><polyline points="12,7 12,12 15,14" stroke="#475569" stroke-width="1.4" stroke-linecap="round"/></svg>`;
    case 'home':
      return `<svg ${s}><path d="M3 11L12 3L21 11V20H5V11" fill="#f97316" stroke="#9a3412" stroke-width="1.2" stroke-linejoin="round"/><rect x="9" y="14" width="6" height="6" fill="#fef3c7" stroke="#9a3412" stroke-width="1"/></svg>`;
    case 'tools':
      return `<svg ${s}><path d="M14.5 4.5L19.5 9.5L9.5 19.5H4.5V14.5L14.5 4.5Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.2" stroke-linejoin="round"/><circle cx="16" cy="6" r="1" fill="#475569"/></svg>`;
    case 'van':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="2" y="7" width="13" height="10" rx="1.5" fill="#3498db"/><path d="M15 10 H19 L22 13 V17 H15 Z" fill="#2980b9"/><circle cx="6" cy="18" r="2.5" fill="#2c3e50"/><circle cx="18" cy="18" r="2.5" fill="#2c3e50"/></svg>`;
    case 'tag':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M20.6 13 L12.5 4.9 C12.1 4.5 11.6 4.3 11 4.3 H4.5 C3.7 4.3 3 5 3 5.8 V12.3 C3 12.9 3.2 13.4 3.6 13.8 L11.7 21.9 C12.5 22.7 13.7 22.7 14.5 21.9 L20.6 15.8 C21.4 15 21.4 13.8 20.6 13 Z" fill="#e74c3c"/><circle cx="7.5" cy="8.5" r="1.5" fill="#ffffff"/></svg>`;
    case 'inspector':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="12" cy="12" r="7" fill="#f1c40f"/><circle cx="15" cy="11" r="3.5" stroke="#2c3e50" stroke-width="1.5" fill="none"/><line x1="17.5" y1="13.5" x2="20" y2="17" stroke="#2c3e50" stroke-width="1.5"/></svg>`;
    case 'herb':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M17 8C8 10 5 19 5 19C5 19 14 16 16 7" stroke="#27ae60" stroke-width="2" stroke-linecap="round"/><path d="M12 12C9 9 10 3 10 3C10 3 16 4 15 10" fill="#2ecc71"/></svg>`;
    case 'pin':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="5" y="10" width="14" height="4" rx="2" fill="#d35400"/><rect x="2" y="11" width="3" height="2" rx="1" fill="#7f8c8d"/><rect x="19" y="11" width="3" height="2" rx="1" fill="#7f8c8d"/></svg>`;
    case 'sauce':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 9H16V19C16 20.1 15.1 21 14 21H10C8.9 21 8 20.1 8 19V9Z" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1.5"/><path d="M10 5H14V9H10V5Z" fill="#e74c3c"/></svg>`;
    case 'bell':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M18 16V11C18 7.7 15.3 5 12 5C8.7 5 6 7.7 6 11V16L4 18H20L18 16Z" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1.5"/><circle cx="12" cy="19" r="2" fill="#d4ac0d"/></svg>`;
    case 'jar':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="6" y="8" width="12" height="13" rx="3" fill="#3498db" fill-opacity="0.3" stroke="#2980b9" stroke-width="1.5"/><rect x="8" y="4" width="8" height="4" rx="1" fill="#e67e22"/></svg>`;
    case 'glasses':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="7" cy="12" r="4" stroke="#2c3e50" stroke-width="2" fill="none"/><circle cx="17" cy="12" r="4" stroke="#2c3e50" stroke-width="2" fill="none"/><line x1="11" y1="12" x2="13" y2="12" stroke="#2c3e50" stroke-width="2"/></svg>`;
    case 'bow':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><polygon points="4,8 12,12 4,16" fill="#e91e63"/><polygon points="20,8 12,12 20,16" fill="#e91e63"/><circle cx="12" cy="12" r="2.5" fill="#c2185b"/></svg>`;
    case 'flower':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><g stroke="#b83b5e" stroke-width="1.2" stroke-linejoin="round"><circle cx="12" cy="6.5" r="3.8" fill="#ffccd5"/><circle cx="17.2" cy="10.2" r="3.8" fill="#ffccd5"/><circle cx="15.2" cy="16.5" r="3.8" fill="#ffccd5"/><circle cx="8.8" cy="16.5" r="3.8" fill="#ffccd5"/><circle cx="6.8" cy="10.2" r="3.8" fill="#ffccd5"/></g><circle cx="12" cy="12" r="3.2" fill="#ffd166" stroke="#f4a261" stroke-width="1"/></svg>`;
    case 'devil':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M5 4 C6 7 7 10 9 11 C8 9 7 6 5 4 Z" fill="#e74c3c" stroke="#962d22" stroke-width="0.8"/><path d="M19 4 C18 7 17 10 15 11 C16 9 17 6 19 4 Z" fill="#e74c3c" stroke="#962d22" stroke-width="0.8"/><circle cx="12" cy="13" r="8.5" fill="#e74c3c" stroke="#962d22" stroke-width="1.2"/><circle cx="9" cy="11.5" r="1.8" fill="#ffffff"/><circle cx="9.2" cy="11.5" r="0.9" fill="#2c3e50"/><circle cx="15" cy="11.5" r="1.8" fill="#ffffff"/><circle cx="14.8" cy="11.5" r="0.9" fill="#2c3e50"/><path d="M9 15 Q12 18.5 15 15" stroke="#2c3e50" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;
    case 'heart':
      return `<svg ${s}><path d="M12 20C12 20 4 14.5 4 8.5C4 5.5 6.5 3.5 9.5 3.5C11 3.5 12 4.5 12 4.5C12 4.5 13 3.5 14.5 3.5C17.5 3.5 20 5.5 20 8.5C20 14.5 12 20 12 20Z" fill="#f43f5e" stroke="#be123c" stroke-width="1.2"/></svg>`;
    case 'lock':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="6" y="10" width="12" height="11" rx="2" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1.5"/><path d="M8 10 V7 C8 4.8 9.8 3 12 3 C14.2 3 16 4.8 16 7 V10" stroke="#7f8c8d" stroke-width="2" fill="none"/></svg>`;
    case 'scroll':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M5.5 4.5C3.8 4.5 3 5.8 3 7.2C3 8.6 4.1 9.5 5.5 9.5H18.5C19.9 9.5 21 8.6 21 7.2C21 5.8 20.2 4.5 18.5 4.5H5.5Z" fill="#fde68a" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/><path d="M4 8.5V17C4 18.7 5.3 19.5 7 19.5H19.5C18.1 19.5 17 18.4 17 17V8.5H4Z" fill="#fffbeb" stroke="#b45309" stroke-width="1.2"/><path d="M17 16.5H20C21.1 16.5 22 17.4 22 18.5C22 19.6 21.1 20.5 20 20.5H6.5C4.6 20.5 3.5 19.2 3.5 17.5" stroke="#b45309" stroke-width="1.2" stroke-linecap="round"/><circle cx="10.5" cy="13.5" r="3" fill="#e11d48" stroke="#9f1239" stroke-width="0.8"/><circle cx="10.5" cy="13.5" r="1.3" fill="#fbbf24"/></svg>`;
    case 'bubble':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="12" cy="12" r="9" fill="url(#rainbowBubbleGrad)" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/><path d="M7.5 7.5A6 6 0 0115 6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/><circle cx="15.5" cy="15.5" r="1.5" fill="#ffffff" opacity="0.7"/></svg>`;
    case 'wheel':
      return `<svg ${s}><circle cx="12" cy="12" r="9.5" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/><path d="M12 2.5L12 21.5M2.5 12L21.5 12M5.3 5.3L18.7 18.7M5.3 18.7L18.7 5.3" stroke="#fff7ed" stroke-width="1.3"/><circle cx="12" cy="12" r="3" fill="#ea580c" stroke="#fff7ed" stroke-width="1.2"/></svg>`;
    case 'timelapse':
      return `<svg ${s}><circle cx="12" cy="12" r="9" fill="none" stroke="#ffffff" stroke-width="2"/><path d="M12 7V12L15 14.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.5" fill="#ffffff"/></svg>`;
    case 'video_cam':
      return `<svg ${s}><rect x="3" y="6" width="12" height="12" rx="2.5" fill="#10b981" stroke="#047857" stroke-width="1.2"/><polygon points="16,10 21,7 21,17 16,14" fill="#10b981" stroke="#047857" stroke-width="1.2"/><polygon points="8,9.5 12,12 8,14.5" fill="#ffffff"/></svg>`;
    default:
      return '';
  }
}
window.getSvgIcon = getSvgIcon;
/* === Автоинициализация статической разметки: <span data-icon="wheel" data-size="24"></span> === */
(function () {
  function hydrateIcons(root) {
    var nodes = (root || document).querySelectorAll('[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute('data-icon');
      if (!name) continue;
      var size = parseInt(el.getAttribute('data-size') || '16', 10);
      if (isNaN(size) || size <= 0) size = 16;
      var svg = getSvgIcon(name, size);
      if (svg) {
        el.innerHTML = svg;
        el.removeAttribute('data-icon');
        el.removeAttribute('data-size');
      }
    }
  }

  window.hydrateIcons = hydrateIcons;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrateIcons(); });
  } else {
    hydrateIcons();
  }
})();