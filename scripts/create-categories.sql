-- Скрипт для создания базовых категорий в продакшне
-- Безопасно добавляет категории только если они не существуют

-- Создаем базовые категории
INSERT INTO categories (name, slug, description, "createdAt", "updatedAt")
SELECT 'Лучшие практики', 'best-practices', 'Проверенные решения и подходы к созданию доступных интерфейсов', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'best-practices');

INSERT INTO categories (name, slug, description, "createdAt", "updatedAt")
SELECT 'Программы экранного доступа', 'screen-readers', 'Обзор популярных скринридеров: NVDA, JAWS, VoiceOver и советы по их использованию', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'screen-readers');

INSERT INTO categories (name, slug, description, "createdAt", "updatedAt")
SELECT 'Мобильные приложения', 'mobile-apps', 'Доступность в мобильных приложениях: iOS, Android и кроссплатформенные решения', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'mobile-apps');

INSERT INTO categories (name, slug, description, "createdAt", "updatedAt")
SELECT 'Обучение и вебинары', 'education', 'Образовательные материалы, курсы и записи вебинаров по цифровой доступности', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'education');

INSERT INTO categories (name, slug, description, "createdAt", "updatedAt")
SELECT 'Доступность', 'accessibility', 'Статьи о цифровой доступности и инклюзивном дизайне', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'accessibility');

-- Проверяем результат
SELECT name, slug, description FROM categories ORDER BY name;