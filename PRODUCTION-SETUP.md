# Настройка продакшн среды

## Создание базовых категорий

Если категории не были созданы автоматически при развертывании, выполните следующие команды в консоли PostgreSQL:

```sql
-- Создание базовых категорий (безопасно - добавляет только отсутствующие)
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
```

## Альтернативный способ через файл

1. Скопируйте содержимое файла `scripts/create-categories.sql`
2. Выполните его в вашей продакшн базе данных
3. Проверьте результат:

```sql
SELECT name, slug FROM categories ORDER BY name;
```

## Автоматическая инициализация

При следующем развертывании новой версии все категории будут созданы автоматически через функцию `seedInitialData()`.

## Важно

Эти категории защищены от удаления и являются основой для навигации на главной странице.