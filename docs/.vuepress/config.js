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
    id: 'support',
    name: '支撑'
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
  title: 'Web Notes',
  description: 'web note from waningflow',
  themeConfig: {
    sidebar: ['/', ...sidebarModules, '/Reference.md']
  }
}
