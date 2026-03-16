
# SwiftMatch Launch Runbook (White-Label Guide)

Этот документ — ваш путеводитель по запуску копии SwiftMatch под вашим брендом или в новом регионе за 60 минут.

---

### 1. Подготовка Инфраструктуры (Firebase)
1. **Проект:** Создайте проект в [Firebase Console](https://console.firebase.google.com/).
2. **Сервисы:** Включите Authentication (Google/Email) и Firestore (в регионе целевой аудитории).
3. **Конфиг:** Замените значения в `src/firebase/config.ts`.

### 2. Мозг приложения (AI)
1. **Ключ:** Получите API-ключ Gemini в [Google AI Studio](https://aistudio.google.com/).
2. **Настройка:** Добавьте ключ в переменные окружения (`GEMINI_API_KEY`) вашего хостинга.

### 3. PWA и Мобильная установка
SwiftMatch — это прогрессивное веб-приложение (PWA).
1. **Манифест:** Настройте иконки и цвета в `public/manifest.json`.
2. **Offline:** Service Worker (`public/sw.js`) уже настроен для базового кэширования.
3. **Push:** Для работы пуш-уведомлений в iOS пользователь должен добавить приложение на главный экран.

### 4. Нативная сборка (Capacitor)
Чтобы выпустить приложение в App Store и Google Play:
1. `npm run build` — создайте веб-сборку.
2. `npx cap sync` — синхронизируйте код с нативными проектами.
3. `npx cap open android` или `ios` — откройте проект в Android Studio / Xcode.

### 5. Брендирование (White-Labeling)
1. **Название:** Замените "SwiftMatch" в `src/app/layout.tsx` и `src/components/layout/app-header.tsx`.
2. **Дизайн:** Измените значение `--primary` в `src/app/globals.css` для смены основного цвета бренда.
3. **Логотип:** Замените файл `public/favicon.ico` и иконки в манифесте.

### 6. Настройка контента (через Админку)
1. Зайдите в `/admin/content`.
2. Обновите списки интересов и целей знакомства под вашу специфику.
3. Проверьте Feature Flags в `/admin/features`.

---
**Ваш бизнес готов к запуску.**
