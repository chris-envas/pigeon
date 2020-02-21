import { useEffect } from 'react'
const { ipcRenderer } = window.require('electron')

const useIpcRenderer = (obj) => {
    useEffect(() => {
        Object.keys(obj).forEach(key => {
            ipcRenderer.on(key,obj[key])
        })
        return () => {
            Object.keys(obj).forEach(key => {
                ipcRenderer.removeListener(key,obj[key])
            })
        }
    })
}

export default useIpcRenderer