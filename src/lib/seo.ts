export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://polotno.app';

export const siteConfig = {
  name: 'polotno',
  title: 'polotno — Бесконечный холст для рисования, схем и заметок',
  description:
    'Бесплатный онлайн-инструмент с бесконечным холстом в стиле Apple HIG. Рисуйте от руки эскизы, диаграммы, схемы и заметки на белом холсте, бумаге или меловой доске без регистрации.',
  url: SITE_URL,
  ogImage: `${SITE_URL}/opengraph-image`,
  keywords: [
    'бесконечный холст',
    'онлайн доска для рисования',
    'онлайн доска заметок',
    'рисование от руки онлайн',
    'аналог excalidraw',
    'аналог tldraw',
    'меловая доска онлайн',
    'векторный эскиз',
    'создание диаграмм онлайн',
    'интерактивная доска',
    'polotno app',
    'визуальные заметки',
    'бесплатный холст',
    'дизайн схем онлайн'
  ],
  author: 'polotno team',
  creator: 'polotno',
};

// JSON-LD Structured Data Schema for SoftwareApplication
export const generateSoftwareApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'polotno',
  operatingSystem: 'All',
  applicationCategory: 'DesignApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  description: siteConfig.description,
  url: siteConfig.url,
  image: siteConfig.ogImage,
  author: {
    '@type': 'Organization',
    name: 'polotno',
  },
  featureList: [
    'Бесконечный холст с панорамированием и зумом',
    'Эскизный ручной стиль рисования (Rough.js)',
    'Карандаш с естественным сглаживанием (perfect-freehand)',
    'Темы холста: бумага, сетка, точки, меловая доска',
    'Экспорт в PNG, SVG и JSON',
    'Облачные доски и совместный доступ по ссылке'
  ]
});

// JSON-LD Structured Data Schema for FAQPage on /info
export const generateFaqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
