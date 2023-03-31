import { ThemeConfig } from 'antd'

export function isObject(target: any) {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export function handleExportThemeToFile(theme: ThemeConfig) {
  const file = new File([JSON.stringify(theme, null, 2)], `Ant Design Theme.json`, {
    type: 'text/json; charset=utf-8;',
  })
  const tmpLink = document.createElement('a')
  const objectUrl = URL.createObjectURL(file)

  tmpLink.href = objectUrl
  tmpLink.download = file.name
  document.body.appendChild(tmpLink)
  tmpLink.click()

  document.body.removeChild(tmpLink)
  URL.revokeObjectURL(objectUrl)
}
