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

export default check;