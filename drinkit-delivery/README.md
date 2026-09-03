# МАРУ — сайт доставки

Сайт доставки кофе и еды. Отдельный проект на Next.js.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Полноценное хранение в продакшене (Netlify + Supabase)

Приложение автоматически работает в двух режимах:

- **Supabase режим** (рекомендуется для Netlify): если заданы `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY`
- **Файловый режим** (локально): если переменные Supabase не заданы, данные хранятся в `data/*.json`

### 1) Создайте таблицы в Supabase

Выполните SQL из файла:

```sql
supabase/schema.sql
```

### 2) Настройте Netlify (важно)

В **Site configuration → Build & deploy → Build settings**:

- **Base directory**: `drinkit-delivery`
- **Build command**: `npm run build`
- **Publish directory**: оставьте пустым (или `.next`) — используется `@netlify/plugin-nextjs`

В корне репозитория уже есть `netlify.toml` с этими настройками.

### 3) Добавьте переменные окружения в Netlify

```env
ADMIN_PASSWORD=maru-admin
SUPABASE_URL=https://YOUR_PROJECT.supabase.cohttps://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 4) Фото меню

Фото загружаются кнопкой **Загрузить фото** в админке.

- Локально файлы пишутся в `public/uploads/menu`
- На Netlify — в **Supabase Storage**, bucket `menu` (создаётся автоматически при первой загрузке)

Если bucket не создался сам, выполните в SQL Editor:

```sql
insert into storage.buckets (id, name, public)
values ('menu', 'menu', true)
on conflict (id) do update set public = true;
```

## Возможности

- Каталог с категориями: новинки, кофе, чай, холодные, еда, десерты
- Выбор размера и типа молока
- Корзина с сохранением в localStorage
- Оформление заказа с адресом и телефоном
- Бесплатная доставка от 800 ₽
- Оплата картой или через **СБП** (QR-код) на этапе checkout
- Личный кабинет клиента: `/account`
- Админ-панель: `/admin` (пароль по умолчанию: `maru-admin`)
  - вкладка **Заказы** — статусы доставки
  - вкладка **Меню** — добавление, редактирование и удаление позиций без кода

## Статусы заказов

- **Готовится** — заказ принят
- **В пути** — курьер доставляет
- **Доставлен** — заказ завершён
- **Отменён** — заказ отменён

Пароль администратора можно задать через переменную окружения `ADMIN_PASSWORD`.

## Управление меню

1. Откройте `/admin` и войдите с паролем
2. Перейдите на вкладку **Меню**
3. Нажмите **Добавить**, заполните название, цену, категорию и фото
4. Изменения сразу появляются на главной странице

Локально меню хранится в `data/menu.json`. В продакшене (при включенном Supabase) меню и заказы хранятся в БД.

Обновить меню из PDF-данных Алабуги:

```bash
node scripts/build-alabuga-menu.mjs
```

## Тестовые карты

- `4242 4242 4242 4242` — успешная оплата
- `4000 0000 0000 0002` — отклонение банком

Срок: любая будущая дата, CVC: любые 3 цифры.

## СБП (Система быстрых платежей)

В checkout можно выбрать оплату через **СБП** — показывается QR-код для приложения банка.

Сейчас это **демо-режим**: QR генерируется локально, кнопка «Я оплатил через банк» имитирует успешный платёж.

### Подключение настоящего СБП

Для реальных платежей нужен договор с платёжным агрегатором:

- [ЮKassa — СБП](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/manual-integration/other/sbp)
- [Tinkoff Acquiring — СБП](https://www.tinkoff.ru/kassa/develop/api/payments/)
- Сбер, Альфа-Bank и другие банки-эквайеры

Типовой процесс:

1. Регистрация ИП/ООО и подключение интернет-эквайринга
2. В API создаётся платёж с методом `sbp`
3. Агрегатор возвращает ссылку или payload для QR
4. Сайт опрашивает статус платежа или получает webhook
5. После `succeeded` создаётся заказ

Переменные окружения для продакшена (пример ЮKassa):

```env
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
```

## R-Keeper (подготовка, опционально)

Интеграция **выключена по умолчанию** и на работу сайта не влияет.
Сейчас добавлен только каркас: после сохранения заказа формируется payload для кипера.

### Что уже сделано

- поле `rkeeperCode` у товара (в админке: «Код R-Keeper»)
- маппинг заказа → payload (`src/lib/rkeeper/`)
- хук после `createOrder` в `/api/order`
- статус: `GET /api/admin/rkeeper` (нужна авторизация админа)

### Включение позже

В Netlify / `.env`:

```env
RKEEPER_ENABLED=false
RKEEPER_BASE_URL=
RKEEPER_OBJECT_ID=
RKEEPER_STATION_ID=
RKEEPER_USERNAME=
RKEEPER_PASSWORD=
# Опционально: падать при ошибке кипера (по умолчанию заказ всё равно сохраняется)
RKEEPER_FAIL_ORDER_ON_ERROR=false
```

Когда будут доступы к API (White Server / XML / UCS), нужно дописать реальный HTTP-вызов в `src/lib/rkeeper/client.ts` и проставить коды блюд в админке.

## Структура

```
src/
  app/           — страницы и API
  components/    — UI-компоненты
  context/       — корзина
  data/          — меню
  lib/           — расчёт цен, rkeeper-каркас
  types/         — TypeScript-типы
```
