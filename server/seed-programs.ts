import { storage } from "./storage";

export async function seedPrograms() {
  try {
    console.log("Starting programs seeding...");
    
    // Get category IDs
    const categories = await storage.getProgramCategories();
    const screenReadersCategory = categories.find(c => c.slug === "screen-readers");
    const mobileAppsCategory = categories.find(c => c.slug === "mobile-apps");

    if (!screenReadersCategory || !mobileAppsCategory) {
      console.log("Program categories not found, skipping programs seeding");
      return;
    }

    // Check if programs already exist to avoid duplicates
    const existingPrograms = await storage.getPrograms({ published: undefined });
    const existingSlugs = existingPrograms.map(p => p.slug);

    const programsToCreate = [
      // Программы экранного доступа
      {
        title: "NVDA",
        slug: "nvda",
        description: "NVDA (NonVisual Desktop Access) — бесплатная программа экранного доступа с открытым исходным кодом для операционной системы Microsoft Windows. Обеспечивает речевой и брайлевский вывод информации с экрана компьютера.",
        logo: null,
        developer: "NV Access",
        officialWebsite: "https://www.nvaccess.org/",
        releaseYear: 2006,
        license: "GPL",
        platforms: ["windows"],
        downloadUrl: "https://www.nvaccess.org/download/",
        isPublished: true,
        categoryId: screenReadersCategory.id,
      },
      {
        title: "JAWS",
        slug: "jaws",
        description: "JAWS (Job Access With Speech) — профессиональная программа экранного доступа для Windows, предоставляющая речевой и брайлевский доступ к содержимому экрана и приложениям.",
        logo: null,
        developer: "Freedom Scientific",
        officialWebsite: "https://www.freedomscientific.com/products/software/jaws/",
        releaseYear: 1995,
        license: "Коммерческая",
        platforms: ["windows"],
        downloadUrl: "https://www.freedomscientific.com/downloads/jaws/",
        isPublished: true,
        categoryId: screenReadersCategory.id,
      },
      {
        title: "VoiceOver",
        slug: "voiceover",
        description: "VoiceOver — встроенная программа экранного доступа в macOS и iOS. Обеспечивает полную навигацию с помощью клавиатуры или жестов, речевое описание элементов интерфейса.",
        logo: null,
        developer: "Apple",
        officialWebsite: "https://www.apple.com/accessibility/vision/",
        releaseYear: 2005,
        license: "Встроенная",
        platforms: ["macos", "ios"],
        downloadUrl: null,
        isPublished: true,
        categoryId: screenReadersCategory.id,
      },
      {
        title: "Orca",
        slug: "orca",
        description: "Orca — бесплатная программа экранного доступа с открытым исходным кодом для Linux. Предоставляет доступ к рабочему столу GNOME через речь, брайль и увеличение.",
        logo: null,
        developer: "GNOME Project",
        officialWebsite: "https://help.gnome.org/users/orca/stable/",
        releaseYear: 2004,
        license: "LGPL",
        platforms: ["linux"],
        downloadUrl: null,
        isPublished: true,
        categoryId: screenReadersCategory.id,
      },
      // Мобильные приложения
      {
        title: "Be My Eyes",
        slug: "be-my-eyes",
        description: "Приложение, соединяющее незрячих и слабовидящих людей с зрячими волонтерами и компаниями через видеозвонок для получения визуальной помощи.",
        logo: null,
        developer: "Be My Eyes",
        officialWebsite: "https://www.bemyeyes.com/",
        releaseYear: 2015,
        license: "Бесплатная",
        platforms: ["ios", "android"],
        downloadUrl: "https://www.bemyeyes.com/",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.bemyeyes.bemyeyes",
        appStoreUrl: "https://apps.apple.com/app/be-my-eyes/id905177575",
        isPublished: true,
        categoryId: mobileAppsCategory.id,
      },
      {
        title: "Seeing AI",
        slug: "seeing-ai",
        description: "Приложение от Microsoft, использующее искусственный интеллект для описания окружающего мира. Распознает текст, людей, объекты, цвета и многое другое.",
        logo: null,
        developer: "Microsoft",
        officialWebsite: "https://www.microsoft.com/en-us/ai/seeing-ai",
        releaseYear: 2017,
        license: "Бесплатная",
        platforms: ["ios"],
        downloadUrl: null,
        appStoreUrl: "https://apps.apple.com/app/seeing-ai/id999062298",
        isPublished: true,
        categoryId: mobileAppsCategory.id,
      },
      {
        title: "Lookout",
        slug: "lookout",
        description: "Приложение от Google, которое помогает незрячим и слабовидящим людям получать информацию об окружающей среде с помощью машинного обучения.",
        logo: null,
        developer: "Google",
        officialWebsite: "https://support.google.com/accessibility/android/answer/9031274",
        releaseYear: 2019,
        license: "Бесплатная",
        platforms: ["android"],
        downloadUrl: null,
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.reveal",
        isPublished: true,
        categoryId: mobileAppsCategory.id,
      },
      {
        title: "TapTapSee",
        slug: "taptapsee",
        description: "Простое приложение для идентификации объектов. Сделайте фото, и приложение опишет, что на нем изображено, используя технологию распознавания изображений.",
        logo: null,
        developer: "Image Searcher Inc.",
        officialWebsite: "https://taptapseeapp.com/",
        releaseYear: 2012,
        license: "Бесплатная",
        platforms: ["ios", "android"],
        downloadUrl: "https://taptapseeapp.com/",
        googlePlayUrl: "https://play.google.com/store/apps/details?id=com.msearcher.taptapsee.android",
        appStoreUrl: "https://apps.apple.com/app/taptapsee/id567635020",
        isPublished: true,
        categoryId: mobileAppsCategory.id,
      },
    ];

    for (const program of programsToCreate) {
      if (!existingSlugs.includes(program.slug)) {
        await storage.createProgram(program);
        console.log(`✓ Создана программа: ${program.title}`);
      } else {
        console.log(`Program already exists: ${program.title}`);
      }
    }

    console.log("Programs seeding completed");
  } catch (error) {
    console.error("Error seeding programs:", error);
  }
}