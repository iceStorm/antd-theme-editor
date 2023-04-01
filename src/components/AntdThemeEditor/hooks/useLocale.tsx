import { useState } from 'react'

const locales = {
  cn: {
    title: '主题编辑器',
    save: '保存',
    edit: '编辑',
    export: '导出',
    editModelTitle: '编辑主题配置',
    editJsonContentTypeError: '主题 JSON 格式错误',
    editSuccessfully: '编辑成功',
    saveSuccessfully: '保存成功',
    initialEditor: '正在初始化编辑器...',
    ok: 'Ok',
    preview: 'View JSON',
  },
  en: {
    title: 'Theme Editor',
    save: 'Save',
    ok: 'Ok',
    edit: 'Edit',
    preview: 'View JSON',
    export: 'Export',
    editModelTitle: 'Edit Theme Config',
    editJsonContentTypeError: 'The theme of the JSON format is incorrect',
    editSuccessfully: 'Edited successfully',
    saveSuccessfully: 'Saved successfully',
    initialEditor: 'Initializing Editor...',
  },
}

export function useLocale() {
  const [selectedLocale, setSelectedLocale] = useState<keyof typeof locales>('en')

  return { lang: selectedLocale, locale: locales[selectedLocale] }
}
