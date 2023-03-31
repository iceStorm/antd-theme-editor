import React, { useEffect, useRef } from 'react'

import { JSONEditor, JSONEditorPropsOptional, Mode } from 'vanilla-jsoneditor'

export function Editor(props: JSONEditorPropsOptional) {
  const editorRef = useRef<JSONEditor>()
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (container.current) {
      editorRef.current = new JSONEditor({
        target: container.current,
        props: { mode: Mode.text },
      })
    }

    return () => {
      editorRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    editorRef.current?.updateProps(props)
  }, [props])

  return <div ref={container} className="vanilla-jsoneditor-react" />
}
