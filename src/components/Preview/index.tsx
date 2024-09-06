import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext"
import Editor from "../CodeEditor/Editor";
import { compile } from "./compiler.worker";
import iframeRaw from './iframe.html?raw'
import { IMPORT_MAP_FILE_NAME } from "../../ReactPlayground/file";
import { Message } from "../Message";
import CompilerWorker from './compiler.worker?worker'
import { debounce } from "lodash-es";


interface MessageData {
    data: {
        type: string
        message: string
    }
}

export default function Preview() {

    const { files } = useContext(PlaygroundContext)
    const [compiledCode, setCompiledCode] = useState('')

    const [error, setError] = useState('')
    const compilerWorkerRef = useRef<Worker>();

    useEffect(() => {
        if (!compilerWorkerRef.current) {
            compilerWorkerRef.current = new CompilerWorker();
            compilerWorkerRef.current.addEventListener('message', ({ data }) => {
                if (data.type === 'COMPILED_CODE') {
                    console.log('worker11', data);
                    setCompiledCode(data.data);
                } else {
                    //console.log('error', data);
                }
            })
        };
            
    }, [])

    useEffect(debounce(() => {
        compilerWorkerRef.current?.postMessage(files)
     }, 500), [files]);

    const getIframeUrl = useCallback(() => {
        const res = iframeRaw.replace(
            '<script type="importmap"></script>',
            `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value
            }</script>`
        ).replace(
            '<script type="module" id="appSrc"></script>',
            `<script type="module" id="appSrc">${compiledCode}</script>`,
        )
        return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
    }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode])
    const [iframeUrl, setIframeUrl] = useState(getIframeUrl());
    const handleMessage = (msg: MessageData) => {
        const { type, message } = msg.data
        if (type === 'ERROR') {
            setError(message)
        }
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])
    


    useEffect(() => {
        setIframeUrl(getIframeUrl())
    }, [getIframeUrl]);

    return <div style={{ height: '100%' }}>
        <iframe
            src={iframeUrl}
            style={{
                width: '100%',
                height: '100%',
                padding: 0,
                border: 'none',
            }}
        />
        <Message type='error' content={error} />
        {/* <Editor file={{
          name: 'dist.js',
          value: compiledCode,
          language: 'javascript'
      }}/> */}
    </div>
}
