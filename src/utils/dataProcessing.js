/*
 * @Author: evans chris 
 * @Date: 2020-01-30 13:23:51
 * @LastEditTime : 2020-01-31 15:39:48
 * @LastEditors  : Please set LastEditors
 * @Description: this is data processing function
 * @FilePath: \cloud-electron-docs\src\utils\dataProcessing.js
 */
export const flattenArr = (arr) => {
    if(arr.length) {
        return arr.reduce((original,item) => {
            original[item.id] = item
            return original
        },{})
    }
    return false
}

export const enumToArr = (obj) => {
    if(obj) {
        return Object.keys(obj).map(key => obj[key])
    }
    return false
}