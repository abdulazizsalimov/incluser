# Развертывание обновлений на продакшн сервере

## Пошаговая инструкция

### 1. Подготовка к развертыванию

```bash
# Сделайте резервную копию базы данных (ВАЖНО!)
pg_dump -h localhost -U postgres -d incluser_blog > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Обновление кода

```bash
# Перейдите в директорию проекта
cd /path/to/your/project

# Остановите приложение
pm2 stop incluser-blog  # или systemctl stop your-service

# Получите последние изменения
git pull origin main

# Установите новые зависимости (если есть)
npm install
```

### 3. Обновление базы данных

```bash
# Обновите схему базы данных
npm run db:push

# Если команда просит подтверждение, выберите:
# "No, add the constraint without truncating the table"
```

### 4. Настройка переменных окружения

Убедитесь, что в файле `.env` или в переменных окружения установлены:

```bash
# Google OAuth (обязательно)
GOOGLE_CLIENT_ID=ваш_client_id
GOOGLE_CLIENT_SECRET=ваш_client_secret

# База данных
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Сессии
SESSION_SECRET=ваш_секретный_ключ_для_сессий
```

### 5. Сборка и запуск

```bash
# Соберите проект
npm run build

# Запустите приложение
pm2 start ecosystem.config.js  # или ваш метод запуска
# или
npm start
```

### 6. Проверка работоспособности

1. Откройте сайт в браузере
2. Проверьте локальный вход (Gomer98/12345)
3. Проверьте Google OAuth
4. Зайдите в админ панель → Пользователи
5. Убедитесь, что новый раздел работает

## Важные моменты

### База данных
- **ВСЕГДА** делайте резервную копию перед обновлением
- Новое поле `lastLoginAt` добавится автоматически
- Существующие данные не пострадают

### Google OAuth
- Убедитесь, что в Google Cloud Console настроены правильные redirect URI:
  - `https://yourdomain.com/api/auth/google/callback`
- Проверьте, что домен добавлен в "Authorized JavaScript origins"

### Файлы загрузок
- Папка `uploads/` должна быть доступна для записи
- Убедитесь, что nginx/apache настроен на обслуживание статических файлов

## Откат в случае проблем

Если что-то пошло не так:

```bash
# Остановите приложение
pm2 stop incluser-blog

# Восстановите базу данных из резервной копии
psql -h localhost -U postgres -d incluser_blog < backup_YYYYMMDD_HHMMSS.sql

# Вернитесь к предыдущей версии кода
git reset --hard HEAD~1

# Запустите приложение
pm2 start incluser-blog
```

## Структура новых файлов

После обновления у вас появятся:
- `client/src/pages/admin/UserManagement.tsx` - страница управления пользователями
- Обновленные API маршруты в `server/routes.ts`
- Новое поле `lastLoginAt` в таблице `users`

## Проверочный список

- [ ] Резервная копия базы данных создана
- [ ] Код обновлен (`git pull`)
- [ ] Зависимости установлены (`npm install`)
- [ ] База данных обновлена (`npm run db:push`)
- [ ] Переменные окружения настроены
- [ ] Проект собран (`npm run build`)
- [ ] Приложение запущено
- [ ] Локальный вход работает
- [ ] Google OAuth работает
- [ ] Админ панель → Пользователи доступна