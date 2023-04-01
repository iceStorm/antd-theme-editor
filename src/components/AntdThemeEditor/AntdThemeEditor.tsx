import { clsx } from 'clsx'
import { useLayoutEffect, useState } from 'react'

import { Button, ConfigProvider, message, Modal, ThemeConfig, Typography } from 'antd'
import { enUS, ThemeEditor, zhCN } from 'antd-token-previewer'
import { StyleProvider } from '@ant-design/cssinjs'
import { JSONTree } from 'react-json-tree'

import { useLocale } from './hooks/useLocale'
import { handleExportThemeToFile } from './AntdThemeEditor.service'

const ANT_DESIGN_V5_THEME_EDITOR_THEME = 'ant-design-v5-theme-editor-theme'

export function AntdThemeEditor() {
  const { lang, locale } = useLocale()
  const [theme, setTheme] = useState<ThemeConfig>({})

  const [messageApi, contextHolder] = message.useMessage()
  const [editModelOpen, setEditModelOpen] = useState<boolean>(false)

  useLayoutEffect(() => {
    const storedConfig = localStorage.getItem(ANT_DESIGN_V5_THEME_EDITOR_THEME)
    if (storedConfig) {
      setTheme(() => JSON.parse(storedConfig))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(ANT_DESIGN_V5_THEME_EDITOR_THEME, JSON.stringify(theme))
    messageApi.success(locale.saveSuccessfully)
  }

  return (
    <>
      {contextHolder}

      <Modal
        open={editModelOpen}
        title={locale.editModelTitle}
        width={600}
        okText={locale.ok}
        onOk={() => setEditModelOpen(false)}
        onCancel={() => setEditModelOpen(false)}
      >
        <JSONTree data={theme} theme={{ scheme: 'google' }} invertTheme hideRoot />
      </Modal>

      <ConfigProvider theme={{ inherit: false }}>
        <StyleProvider hashPriority="high">
          <div className={clsx('fixed', 'flex flex-col w-full')}>
            <header
              className={clsx(
                'sticky top-0 z-50',
                'py-2 px-3',
                'flex justify-between items-center',
                'bg-white border-b',
                'shadow',
              )}
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                {locale.title}
              </Typography.Title>

              <div className="flex gap-3">
                <Button onClick={() => handleExportThemeToFile(theme)}>{locale.export}</Button>
                <Button onClick={() => setEditModelOpen(true)}>{locale.preview}</Button>
                <Button type="primary" onClick={handleSave}>
                  {locale.save}
                </Button>
              </div>
            </header>

            <ThemeEditor
              theme={{ name: 'Antd Theme Editor', key: 'test', config: theme }}
              className="h-screen pb-10"
              onThemeChange={(newTheme) => setTheme(newTheme.config)}
              locale={lang === 'cn' ? zhCN : enUS}
            />
          </div>
        </StyleProvider>
      </ConfigProvider>
    </>
  )
}
