const fs = require('fs')
const path = require('path')

const titleConfig = [
  {
    id: 'language',
    name: '语言'
  },
  {
    id: 'framework',
    name: '框架'
  },
  {
    id: 'environment',
    name: '环境'
  },
  {
    id: 'comprehensive',
    name: '综合'
  },
  {
    id: 'support',
    name: '支撑'
  },
  {
    id: 'data',
    name: '数据'
  }
]

let sidebarModules = titleConfig.map(v => {
  let subdirs = fs.readdirSync(path.resolve(__dirname, '../', v.id))
  subdirs = subdirs.filter(fv => fv.endsWith('.md'))
  return {
    title: v.name,
    collapsable: false,
    children: subdirs.map(fv => `/${v.id}/${fv}`)
  }
})

module.exports = {
  title: 'waningflow的小本儿',
  description: 'Web notes from waningflow',
  themeConfig: {
    nav: [
      {
        text: 'Github',
        link: 'https://github.com/waningflow/WebNotes'
      }
    ],
    sidebar: ['/', ...sidebarModules, '/Reference.md']
  }
}
