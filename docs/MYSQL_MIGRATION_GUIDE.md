# Руководство по миграции с Firebase на MySQL

**Внимание:** Переход с Firebase Firestore (база данных NoSQL) на MySQL (база данных SQL) является значительным архитектурным изменением. Это потребует существенной переработки кода вашего приложения. Текущая версия проекта глубоко интегрирована с сервисами Firebase (Firestore, Auth). Это руководство описывает шаги, необходимые для такой миграции.

### Шаг 1: Создание базы данных в cPanel

1.  Войдите в вашу панель управления cPanel.
2.  Перейдите в раздел "Базы данных" и откройте **"Мастер баз данных MySQL®"** (`MySQL® Database Wizard`).
3.  **Создайте базу данных:** Придумайте имя для вашей БД (например, `mysitedb`).
4.  **Создайте пользователя БД:** Создайте нового пользователя и сгенерируйте для него надежный пароль. **Сохраните имя пользователя и пароль**, они понадобятся позже.
5.  **Назначьте права:** Добавьте созданного пользователя к созданной базе данных и предоставьте ему **"Все права"** (`ALL PRIVILEGES`).

После этого шага у вас будут имя базы данных, имя пользователя и пароль.

### Шаг 2: Модификация кода приложения

Это наиболее сложный и трудоемкий этап.

1.  **Установите драйвер MySQL:**
    Для взаимодействия с MySQL из вашего Node.js приложения, установите необходимую библиотеку:
    ```bash
    npm install mysql2
    ```

2.  **Создайте модуль подключения к БД:**
    Создайте новый файл, например, `src/lib/mysql-connector.ts`, для управления пулом соединений с базой данных.

    ```typescript
    import mysql from 'mysql2/promise';

    // Для безопасности используйте переменные окружения, а не жестко заданные значения
    const pool = mysql.createPool({
      host: 'localhost', // На cPanel обычно 'localhost'
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    export default pool;
    ```

3.  **Спроектируйте и создайте SQL-таблицы:**
    Вам необходимо преобразовать вашу NoSQL структуру (коллекции и документы Firestore) в реляционные таблицы SQL. Вот примерная структура на основе вашего проекта:

    *   **Таблица `users`:**
        *   `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
        *   `firebase_uid` (VARCHAR, UNIQUE) - можно использовать для первоначальной миграции данных
        *   `displayName` (VARCHAR)
        *   `email` (VARCHAR, UNIQUE)
        *   `age` (INT)
        *   `city` (VARCHAR)
        *   `bio` (TEXT)
        *   `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
        
    *   **Таблица `chats`:**
        *   `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
        *   `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

    *   **Таблица `chat_members` (связующая):**
        *   `chat_id` (INT, FOREIGN KEY to `chats.id`)
        *   `user_id` (INT, FOREIGN KEY to `users.id`)
        *   PRIMARY KEY (`chat_id`, `user_id`)

    *   **Таблица `messages`:**
        *   `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
        *   `chat_id` (INT, FOREIGN KEY to `chats.id`)
        *   `sender_id` (INT, FOREIGN KEY to `users.id`)
        *   `text` (TEXT)
        *   `sent_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

    Вам нужно будет создать SQL-скрипт для создания этих (и других) таблиц в вашей новой базе данных.

4.  **Перепишите логику доступа к данным:**
    *   **Создайте API эндпоинты:** В Next.js создайте API маршруты (внутри `src/app/api/`) для каждой операции с данными (например, `src/app/api/users/route.ts`, `src/app/api/chats/route.ts`).
    *   **Реализуйте SQL-запросы:** Внутри этих маршрутов используйте коннектор (`mysql-connector.ts`) для выполнения SQL-запросов (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
    *   **Обновите UI-компоненты:** Все компоненты и хуки, которые использовали Firebase (`useUser`, `useCollection`, `useDoc`), должны быть переписаны. Теперь они должны отправлять запросы (`fetch`) к вашим новым API эндпоинтам.
    *   **Замените систему аутентификации:** Firebase Auth необходимо заменить. Это самая критичная часть. Популярным решением является реализация аутентификации на основе JWT (JSON Web Tokens). Это сложная задача, требующая особого внимания к безопасности.

### Шаг 3: Настройка переменных окружения в cPanel

1.  В cPanel вернитесь в раздел **"Setup Node.js App"**.
2.  Найдите ваше приложение и откройте его настройки.
3.  Перейдите в раздел **"Environment Variables"** (Переменные окружения).
4.  Добавьте переменные, которые вы определили в файле `mysql-connector.ts`:
    *   `DB_NAME`: имя вашей базы данных.
    *   `DB_USER`: имя пользователя базы данных.
    *   `DB_PASSWORD`: пароль пользователя.
5.  Сохраните изменения и перезапустите ваше Node.js приложение.
