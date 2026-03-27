import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '福慧學習護照 使用手冊',
  description: '福慧學習護照 管理後台使用手冊',
  base: '/admin-manual/',
  lang: 'zh-TW',
  head: [['link', { rel: 'icon', href: '/admin-manual/favicon.ico' }]],
  themeConfig: {
    nav: [
      { text: '首頁', link: '/' },
      { text: '管理後台', link: 'https://admin.ct-passport.org' },
    ],
    sidebar: [
      {
        text: '開始使用',
        items: [
          { text: '簡介', link: '/' },
          { text: '登入', link: '/login' },
        ],
      },
      {
        text: '學員管理',
        items: [
          { text: '學員列表', link: '/students' },
          { text: '匯入學員', link: '/student-import' },
        ],
      },
      {
        text: '班級管理',
        items: [
          { text: '班級列表', link: '/classes' },
          { text: '學員報名與完成', link: '/class-enrollment' },
        ],
      },
      {
        text: '活動記錄',
        items: [
          { text: '記錄管理與蓋印', link: '/activities' },
        ],
      },
      {
        text: '統計報表',
        items: [
          { text: '達標情況統計', link: '/achievement-stats' },
          { text: '活動統計', link: '/activity-stats' },
        ],
      },
    ],
    outline: { label: '目錄' },
    search: { provider: 'local' },
    footer: {
      message: '福慧學習護照 管理後台使用手冊',
    },
  },
})
