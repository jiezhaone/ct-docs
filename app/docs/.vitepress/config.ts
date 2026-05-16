import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '福慧學習護照 App 使用手冊',
  description: '福慧學習護照 行動應用程式使用手冊',
  base: '/app-manual/',
  lang: 'zh-TW',
  head: [['link', { rel: 'icon', href: '/app-manual/favicon.ico' }]],
  themeConfig: {
    nav: [
      { text: '首頁', link: '/' },
    ],
    sidebar: [
      {
        text: '開始使用',
        items: [
          { text: '簡介', link: '/' },
          { text: '下載與安裝', link: '/install' },
          { text: '登入與註冊', link: '/login' },
        ],
      },
      {
        text: '成就與進度',
        items: [
          { text: '開啟旅程與修行歷程', link: '/journey' },
          { text: '護照進度', link: '/progress' },
        ],
      },
      {
        text: '修行記錄',
        items: [
          { text: '報數（提交記錄）', link: '/submit-practice' },
          { text: '歷史記錄', link: '/history' },
          { text: '八大修行項目', link: '/activity-types' },
          { text: '修習內容管理', link: '/sutras' },
        ],
      },
      {
        text: '我的課程',
        items: [
          { text: '查看課程', link: '/my-courses' },
        ],
      },
      {
        text: '通知',
        items: [
          { text: '通知訊息', link: '/notifications' },
        ],
      },
      {
        text: '個人設定',
        items: [
          { text: '個人資料', link: '/profile' },
          { text: '語言切換', link: '/language' },
        ],
      },
    ],
    outline: { label: '目錄' },
    search: { provider: 'local' },
    footer: {
      message: '福慧學習護照 App 使用手冊',
    },
  },
})
