/*
 * @Author: evans chris 
 * @Date: 2020-01-30 13:23:51
 * @LastEditTime : 2020-01-30 13:28:12
 * @LastEditors  : Please set LastEditors
 * @Description: this is data processing function
 * @FilePath: \cloud-electron-docs\src\utils\dataProcessing.js
 */
export const flattenArr = (arr) => {
    return arr.reduce((original,item) => {
        original[item.id] = item
        return original
    },{})
}

export const enumToArr = (obj) => {
    return Object.keys(obj).map(key => obj[key])
}