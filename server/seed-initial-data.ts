import { storage } from "./storage";

export async function seedInitialData() {
  try {
    // Создаем все необходимые категории
    const defaultCategories = [
      {
        name: "Доступность",
        slug: "accessibility",
        description: "Статьи о цифровой доступности и инклюзивном дизайне"
      },
      {
        name: "Лучшие практики",
        slug: "best-practices",
        description: "Проверенные решения и подходы к созданию доступных интерфейсов"
      },
      {
        name: "Программы экранного доступа",
        slug: "screen-readers",
        description: "Обзор популярных скринридеров: NVDA, JAWS, VoiceOver и советы по их использованию"
      },
      {
        name: "Мобильные приложения",
        slug: "mobile-apps",
        description: "Доступность в мобильных приложениях: iOS, Android и кроссплатформенные решения"
      },
      {
        name: "Образование и вебинары",
        slug: "education",
        description: "Образовательные материалы, курсы и записи вебинаров по цифровой доступности"
      }
    ];

    for (const categoryData of defaultCategories) {
      const existingCategory = await storage.getCategoryBySlug(categoryData.slug);
      if (!existingCategory) {
        await storage.createCategory(categoryData);
        console.log(`✓ Создана категория: ${categoryData.name}`);
      }
    }

    // Создаем приветственную статью если её нет
    const existingArticles = await storage.getArticles({ limit: 1 });
    
    if (existingArticles.length === 0) {
      const category = await storage.getCategoryBySlug("accessibility");
      const admin = await storage.getUserByUsername("Gomer98");
      
      if (category && admin) {
        await storage.createArticle({
          title: "Добро пожаловать в Incluser!",
          slug: "welcome-to-incluser",
          content: `<h2>Добро пожаловать в блог о цифровой доступности!</h2>
          
<p>Этот блог посвящен вопросам цифровой доступности и инклюзивного дизайна. Здесь вы найдете практические советы, руководства и инструменты для создания более доступных веб-сайтов и приложений.</p>

<h3>О чем этот блог:</h3>
<ul>
<li>Руководства по WCAG (Web Content Accessibility Guidelines)</li>
<li>Практические советы по инклюзивному дизайну</li>
<li>Инструменты для тестирования доступности</li>
<li>Реальные примеры и решения</li>
</ul>

<p>Начните изучение с навигации по категориям или воспользуйтесь поиском для поиска интересующих вас тем.</p>`,
          excerpt: "Добро пожаловать в блог о цифровой доступности! Здесь вы найдете практические советы и руководства для создания более инклюзивного интернета.",
          authorId: admin.id,
          categoryId: category.id,
          isPublished: true,
          readingTime: 2,
          featuredImage: null,
          featuredImageAlt: null,

        });
        console.log("✓ Создана приветственная статья");
      }
    }

    console.log("✓ Инициализация базовых данных завершена");
  } catch (error) {
    console.error("Ошибка при инициализации данных:", error);
  }
}