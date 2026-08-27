# Bird Network

Сайт и PWA для сети ресторанов и лаунжей: выбор заведения, меню, афиша, галерея, бронирование.

## Заведения (9 точек)

| Заведение | Город |
|-----------|-------|
| The Bird | Набережные Челны |
| Buddu Lounge | Набережные Челны |
| Mare | Набережные Челны |
| Chilling Lounge (проспект) | Набережные Челны |
| Chilling Lounge (ТРК) | Набережные Челны |
| Urman | Набережные Челны |
| ChillOut ethno bar | Елабуга |
| ChillOut resto club | Альметьевск |
| Chilling Lounge | Казань |

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Языки

- Русский (по умолчанию): `/`
- English: `/en`

## PWA

На телефоне: «Поделиться» → «На экран Домой» (iOS) или «Установить приложение» (Android/Chrome).

## Бронирование

Заявки отправляются на API `/api/booking` и логируются в консоль сервера. Для продакшена подключите email (Resend, Nodemailer) или Telegram-бот.

## Контент

Данные заведений — в `src/data/venues.ts`. Замените адреса, телефоны, меню и фото на реальные.

## Сборка

```bash
npm run build
npm start
```
