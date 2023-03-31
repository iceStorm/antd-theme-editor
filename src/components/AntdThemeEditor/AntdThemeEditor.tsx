import { clsx } from 'clsx'
import { Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react'

import { Button, ConfigProvider, message, Modal, Spin, ThemeConfig, Typography } from 'antd'
import { enUS, ThemeEditor, zhCN } from 'antd-token-previewer'
import { StyleProvider } from '@ant-design/cssinjs'

import {
  JSONContent,
  TextContent,
  OnChange,
  ContentValidationErrors,
  Content,
} from 'vanilla-jsoneditor'

import { useLocale } from './hooks/useLocale'
import { Editor as JSONEditor } from './JSONEditor'
import { handleExportThemeToFile, isObject } from './AntdThemeEditor.service'

const ANT_DESIGN_V5_THEME_EDITOR_THEME = 'ant-design-v5-theme-editor-theme'

export function AntdThemeEditor() {
  const { lang, locale } = useLocale()
  const [theme, setTheme] = useState<ThemeConfig>({})

  const [messageApi, contextHolder] = message.useMessage()

  const [editModelOpen, setEditModelOpen] = useState<boolean>(false)
  const [editThemeFormatRight, setEditThemeFormatRight] = useState<boolean>(true)
  const [themeConfigContent, setThemeConfigContent] = useState<Content>({
    text: '{}',
    json: {},
  })

  useLayoutEffect(() => {
    const storedConfig = localStorage.getItem(ANT_DESIGN_V5_THEME_EDITOR_THEME)
    if (storedConfig) {
      setTheme(() => JSON.parse(storedConfig))
    }
  }, [])

  useEffect(() => {
    if (editModelOpen === true) return

    setThemeConfigContent({
      json: theme as any,
      text: '',
    })
  }, [theme, editModelOpen])

  const handleSave = () => {
    localStorage.setItem(ANT_DESIGN_V5_THEME_EDITOR_THEME, JSON.stringify(theme))
    messageApi.success(locale.saveSuccessfully)
  }

  const handleEditConfig = () => {
    setEditModelOpen(true)
  }

  const editModelClose = useCallback(() => {
    setEditModelOpen(false)
  }, [themeConfigContent])

  const handleEditConfigChange: OnChange = (newcontent, preContent, status) => {
    setThemeConfigContent(newcontent)

    const validationErrors = (status.contentErrors as ContentValidationErrors).validationErrors
    if (validationErrors) {
      if (Array.isArray(validationErrors) && validationErrors.length === 0) {
        setEditThemeFormatRight(true)
      } else {
        setEditThemeFormatRight(false)
      }
    }
  }

  const editSave = useCallback(() => {
    if (!editThemeFormatRight) {
      message.error(locale.editJsonContentTypeError)
      return
    }

    const themeConfig = (themeConfigContent as TextContent).text
      ? JSON.parse((themeConfigContent as TextContent).text)
      : (themeConfigContent as JSONContent).json

    if (!isObject(themeConfig)) {
      message.error(locale.editJsonContentTypeError)
      return
    }

    setTheme(themeConfig)
    editModelClose()

    messageApi.success(locale.editSuccessfully)
  }, [themeConfigContent])

  return (
    <>
      {contextHolder}

      <Modal
        open={editModelOpen}
        title={locale.editModelTitle}
        width={600}
        okText={locale.save}
        onOk={editSave}
        onCancel={editModelClose}
      >
        <Suspense
          fallback={
            <div
              style={{
                textAlign: 'center',
                width: '100%',
                padding: '24px 0',
              }}
            >
              <Spin tip={locale.initialEditor} />
            </div>
          }
        >
          <JSONEditor
            content={themeConfigContent}
            onChange={handleEditConfigChange}
            mainMenuBar={false}
          />
        </Suspense>
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
                <Button onClick={handleEditConfig}>{locale.edit}</Button>
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
