import { PropsWithChildren, useEffect, useState } from 'react'
import { Files, PlaygroundContext } from './PlaygroundContext.ts'
import { compress, fileName2Language, uncompress } from './utils.ts'
import { initFiles } from './file.ts'
import { Theme } from './PlaygroundContext.ts'

const getFilesFromUrl = () => {
  let files: Files | undefined
  try {
      const hash = uncompress(window.location.hash.slice(1))
      files = JSON.parse(hash)
  } catch (error) {
    console.error(error)
  }
  return files
}

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props
  const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles)
  const [selectedFileName, setSelectedFileName] = useState('App.tsx');
  const [ theme, setTheme ] = useState<Theme>('light')
  const addFile = (name: string) => {
    files[name] = {
      name,
      language: fileName2Language(name),
      value: '',
    }
    setFiles({ ...files })
  }

  const removeFile = (name: string) => {
    delete files[name]
    setFiles({ ...files })
  }

  const updateFileName = (oldFieldName: string, newFieldName: string) => {
    if (!files[oldFieldName] || newFieldName === undefined || newFieldName === null) return
    const { [oldFieldName]: value, ...rest } = files
    const newFile = {
      [newFieldName]: {
        ...value,
        language: fileName2Language(newFieldName),
        name: newFieldName,
      },
    }
    setFiles({
      ...rest,
      ...newFile,
    })
  }

  useEffect(() => {
    const hash = compress(JSON.stringify(files))
    console.log('hash')
    window.location.hash = hash
  }, [files])
    
  return (
    <PlaygroundContext.Provider
      value={{
        theme,
        files,
        setTheme,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}
