# Инструкции по деплою Incluser Blog

## Для production деплоя

При деплое проекта на production сервер необходимо убедиться, что следующие файлы и папки присутствуют:

### 1. PDF файлы для страницы WCAG

PDF файл `wcag-2.1-guide.pdf` должен находиться в папке `attached_assets/` в корне проекта.

**Важно:** PDF файл должен находиться в папке attached_assets/. Если файл отсутствует после клонирования:

### Вариант 1: Скачать с официального сайта
1. Скачайте русскую версию WCAG 2.1: https://www.w3.org/Translations/WCAG21-ru/
2. Переименуйте файл в `wcag-2.1-guide.pdf`
3. Поместите в папку `attached_assets/`

### Вариант 2: Скачать из Releases GitHub
Если файл слишком большой для основного репозитория, он будет размещен в Releases:
1. Перейдите в раздел Releases проекта на GitHub
2. Скачайте `wcag-2.1-guide.pdf`
3. Поместите в папку `attached_assets/`

### Проверка после установки
Убедитесь что файл доступен по адресу: `http://yourdomain.com/attached_assets/wcag-2.1-guide.pdf`

### Решение проблемы 404 на production

Если PDF файл собирается в `dist/public/assets/` но возвращает 404, выполните следующие шаги:

#### Автоматическое решение (рекомендуется)
1. Скопируйте скрипт копирования с правильными правами доступа:
```bash
node scripts/copy-assets.js
```

#### Ручное решение
1. После сборки проекта (`npm run build`) скопируйте PDF файл с правильными правами:
```bash
cp attached_assets/wcag-2.1-guide.pdf dist/public/assets/
chmod 644 dist/public/assets/wcag-2.1-guide.pdf
```

2. Также убедитесь что исходный файл имеет правильные права:
```bash
chmod 644 attached_assets/wcag-2.1-guide.pdf
```

#### Диагностика проблемы
Если PDF все еще недоступен, запустите диагностику:
```bash
node debug-pdf.js
```

Проверьте права доступа к файлам:
```bash
ls -la attached_assets/wcag-2.1-guide.pdf
ls -la dist/public/assets/wcag-2.1-guide.pdf
```

Файлы должны иметь права `644` (-rw-r--r--) для корректной работы веб-сервера.

#### Проверка структуры файлов
Убедитесь что в `dist/public/assets/` присутствует файл `wcag-2.1-guide.pdf`:
```bash
ls -la dist/public/assets/ | grep wcag
```

### 2. Статические файлы

Сервер настроен на обслуживание статических файлов из папки `attached_assets/` по следующим путям:
- `/attached_assets/` - основной путь
- `/assets/` - резервный путь для совместимости

### 3. Проверка работы PDF

После деплоя проверьте доступность PDF по адресу:
```
https://yourdomain.com/attached_assets/wcag-2.1-guide.pdf
```

Если файл не доступен, убедитесь что:
1. Файл существует в папке `attached_assets/`
2. У файла правильные права доступа (644)
3. Веб-сервер имеет доступ к папке

### 4. Альтернативное решение

Если проблемы с доступом продолжаются, можно:
1. Поместить PDF файл в папку `uploads/`
2. Изменить путь в коде с `/attached_assets/wcag-2.1-guide.pdf` на `/uploads/wcag-2.1-guide.pdf`

## Структура проекта для production

```
project-root/
├── attached_assets/
│   ├── wcag-2.1-guide.pdf          # PDF файл WCAG
│   └── [другие медиа файлы]
├── uploads/
│   └── images/                      # Загруженные через админку изображения
├── server/
├── client/
└── shared/
```