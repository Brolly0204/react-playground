import { useContext, useEffect, useState } from "react"
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext"
import { FileNameItem } from "./FileNameItem"
import styles from './index.module.scss'
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from "../../ReactPlayground/file"

const FileNameList = () => {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName
  } = useContext(PlaygroundContext)
  const [tabs, setTabs] = useState([''])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    setTabs(Object.keys(files))
  }, [files])

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name)
    setSelectedFileName(name)
    setCreating(false)
  }

  const addTab = () => {
    const newFileName = 'Comp' + Math.random().toString().slice(2,6) + '.tsx';
    addFile(newFileName);
    setSelectedFileName(newFileName)
    setCreating(true)
  }

  const handleRemove = (name: string) => {
    removeFile(name)
    setSelectedFileName(ENTRY_FILE_NAME)
  }
  const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME];

  return <div className={styles.tabs}>
    {
      tabs.map((item, index, arr) => (
        <FileNameItem
          key={item + index}
          onClick={() => setSelectedFileName(item)}
          value={item}
          readonly={readonlyFileNames.includes(item)}
          creating={creating && arr.length - 1 === index}
          actived={selectedFileName === item}
          onRemove={() => handleRemove(item)}
          onEditComplete={name => handleEditComplete(name, item)}
        ></FileNameItem>
      ))
    }
    <div className={styles.add} onClick={addTab}>
            +
        </div>
  </div>
}

export default FileNameList