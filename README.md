smart-realtor/
├── public/
│   └── (изображения, иконки)
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Главная страница с чатом
│   │   └── api/
│   │       └── apartments/
│   │           └── route.ts      ← API для получения и кэширования apartments
│   ├── components/
│   │   ├── Chat.tsx              ← Компонент чат-интерфейса
│   │   ├── Message.tsx           ← Компонент одного сообщения
│   │   └── Card.tsx              ← Карточка квартиры (для красивого вывода)
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts         ← Firebase для клиента (если нужно)
│   │   │   └── admin.ts          ← Firebase Admin SDK
│   │   ├── cache/
│   │   │   ├── manager.ts        ← Кэш-менеджер с Redis
│   │   │   └── keys.ts           ← Ключи для Redis-кэша
│   │   ├── fetchapartments.ts   ← Логика загрузки и кэширования apartments
│   │   └── steps.ts              ← Массив логики шагов воронки
│   ├── types/
│   │   └── apartment.ts          ← Типы и интерфейсы apartments и кликов
│   ├── utils/
│   │   └── formatPrice.ts        ← Утилита форматирования цен
│   └── styles/
│       └── globals.css           ← Общие стили
├── .env.local                    ← Переменные окружения
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
