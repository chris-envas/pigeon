/*
 * @Author: Evans Chris
 * @Date: 2020-02-03 13:37:43
 * @LastEditTime : 2020-02-06 17:55:15
 * @LastEditors  : Please set LastEditors
 * @Description: useMenuFileList
 * @FilePath: \cloud-electron-docs\src\hooks\useMenuFileList.js
 */
import { useEffect,useRef } from 'react'
const { remote } = window.require('electron')
const { Menu,MenuItem } = remote

const useMenuFileList = (itemArr, targetSelector, deps) => {
  let clickedElement = useRef(null)
  useEffect(() => {
    // Instantiate menu
    const menu = new Menu()
    // push submenu
    itemArr.forEach(item => {
      menu.append(new MenuItem(item))
    })
    const handleContextMenu = (e) => {
      // only show the context menu on current dom element or targetSelector contains target
      if (document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target
        menu.popup({window: remote.getCurrentWindow() })
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, deps)
  return clickedElement
}

export default useMenuFileList