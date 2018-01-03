/**
 * 
 * @param {Object} obj 
 * @param {Array} fields 
 */
function check(obj,fields){
    return fields.every((field)=>{
        return field in obj;
    });
};

const exts=['png','jpg','gif','bmp'];
function isImage(name){
    let ext=name.split('.').slice(-1)[0];
    return exts.indexOf(ext)>-1;
}
export {isImage};
export default check;