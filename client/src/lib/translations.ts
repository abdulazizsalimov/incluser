export const translations = {
  ru: {
    // Header navigation
    home: "Главная",
    articles: "Статьи", 
    about: "Об авторе",
    contact: "Контакты",
    accessibility: "Доступность",
    adminPanel: "Админ-панель",
    login: "Вход",
    logout: "Выход",
    allArticles: "Все статьи",
    
    // Main page
    siteTitle: "Incluser",
    siteSubtitle: "доступный сайт о доступности",
    personalBlog: "Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, которыми могут пользоваться все люди, независимо от их способностей.",
    readArticles: "Читать статьи",
    aboutAuthor: "Об авторе",
    recentArticles: "Свежие статьи",
    lastPublications: "Последние публикации о цифровой доступности, лучших практиках и инклюзивном дизайне.",
    
    // Accessibility features
    accessibilityFeatures: "Возможности доступности",
    tryButton: "Попробовать",
    accessibilitySlider: {
      title1: "Увеличение текста",
      description1: "Увеличивайте размер шрифта до 200% для лучшей читаемости. Помогает людям с нарушениями зрения.",
      title2: "Высокий контраст",
      description2: "Переключайтесь между обычным и высококонтрастным режимами для комфортного чтения.",
      title3: "Синтез речи",
      description3: "Прослушивайте любой текст на сайте с помощью технологии преобразования текста в речь.",
      title4: "Навигация с клавиатуры",
      description4: "Полная поддержка навигации с помощью клавиатуры. Используйте Tab для перемещения между элементами.",
      title5: "Адаптивный дизайн",
      description5: "Сайт автоматически адаптируется под разные размеры экранов и устройства."
    },
    
    // Article actions
    listen: "Прослушать",
    pause: "Пауза", 
    continue: "Продолжить",
    share: "Поделиться",
    
    // Footer
    allRightsReserved: "Все права защищены",
    
    // Language
    selectLanguage: "Выбрать язык",
    russian: "Русский",
    english: "English"
  },
  
  en: {
    // Header navigation
    home: "Home",
    articles: "Articles",
    about: "About Author", 
    contact: "Contact",
    accessibility: "Accessibility",
    adminPanel: "Admin Panel",
    login: "Login",
    logout: "Logout",
    allArticles: "All Articles",
    
    // Main page
    siteTitle: "Incluser",
    siteSubtitle: "accessible site about accessibility",
    personalBlog: "Personal blog dedicated to digital accessibility, inclusive design and creating web solutions that can be used by everyone, regardless of their abilities.",
    readArticles: "Read Articles",
    aboutAuthor: "About Author", 
    recentArticles: "Recent Articles",
    lastPublications: "Latest publications on digital accessibility, best practices and inclusive design.",
    
    // Accessibility features
    accessibilityFeatures: "Accessibility Features",
    tryButton: "Try It",
    accessibilitySlider: {
      title1: "Text Magnification",
      description1: "Increase font size up to 200% for better readability. Helps people with visual impairments.",
      title2: "High Contrast",
      description2: "Switch between normal and high contrast modes for comfortable reading.",
      title3: "Text-to-Speech",
      description3: "Listen to any text on the site using text-to-speech technology.",
      title4: "Keyboard Navigation", 
      description4: "Full keyboard navigation support. Use Tab to move between elements.",
      title5: "Responsive Design",
      description5: "The site automatically adapts to different screen sizes and devices."
    },
    
    // Article actions
    listen: "Listen",
    pause: "Pause",
    continue: "Continue", 
    share: "Share",
    
    // Footer
    allRightsReserved: "All rights reserved",
    
    // Language
    selectLanguage: "Select Language",
    russian: "Русский", 
    english: "English"
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.ru;