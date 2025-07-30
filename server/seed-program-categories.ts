import { storage } from "./storage";

export async function seedProgramCategories() {
  try {
    console.log("Starting program categories seeding...");
    
    // Check if categories already exist to avoid duplicates
    const existingCategories = await storage.getProgramCategories();
    const existingSlugs = existingCategories.map(cat => cat.slug);

    const categoriesToCreate = [
      {
        name: "Программы экранного доступа",
        slug: "screen-readers",
        description: "Программы для озвучивания экрана и навигации с помощью клавиатуры для людей с нарушениями зрения",
      },
      {
        name: "Мобильные приложения",
        slug: "mobile-apps", 
        description: "Доступные мобильные приложения для iOS и Android, облегчающие повседневные задачи",
      },
    ];

    for (const category of categoriesToCreate) {
      if (!existingSlugs.includes(category.slug)) {
        await storage.createProgramCategory(category);
        console.log(`✓ Создана категория программ: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    console.log("Program categories seeding completed");
  } catch (error) {
    console.error("Error seeding program categories:", error);
  }
}