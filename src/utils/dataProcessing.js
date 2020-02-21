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
