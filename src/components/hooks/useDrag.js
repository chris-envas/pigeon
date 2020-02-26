import { useEffect } from 'react'
const fs = window.require('fs')
const {basename,extname} = window.require('path')

const useDrag = (callback) => {
    useEffect(() => {
       // 获取body
        var content=document.getElementsByTagName('body')[0]
        //取消H5拖拽事件默认行为 
        content.ondragenter=content.ondragover=content.ondragleave=function(){
            return false; /*阻止默认行为*/
        }
        content.ondrop=function(e){
            e.preventDefault();     
            const path = e.dataTransfer.files[0].path;
            // if(extname(path) !== 'md') {
            //     alert('暂不支持markdwon以外的格式')
            //     return
            // }
            fs.readFile(path,'utf-8',(err,data)=>{
                if(err){
                    console.log(err);
                    return false;
                }else{
                    let params = {
                        title: basename(path),
                        path
                    }
                    callback(params)
                }
            })
        }
    })
}

export default useDrag