export const getParentNode = (node, parentClassName) => {
    let target = node.current || node
    console.log('getParentNode',target)
    while (target !== null) {
        if(target.classList && target.classList.contains(parentClassName)) {
            return target
        }
        target = target.parentNode
    }
    return false 
}