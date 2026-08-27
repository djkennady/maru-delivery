# МАРУ — доставка

Репозиторий сайта доставки. Приложение лежит в папке `drinkit-delivery`.

## Запуск

```bash
cd drinkit-delivery
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Деплой (Netlify)

В корне есть `netlify.toml`:

- Base directory: `drinkit-delivery`
- Build: `npm run build`
- Plugin: `@netlify/plugin-nextjs`

Подробности по Supabase и админке — в [`drinkit-delivery/README.md`](drinkit-delivery/README.md).
