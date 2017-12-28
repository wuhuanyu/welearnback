
/**
 * 
 * @param {Number} code 
 * @param {String} msg 
 */
 module.exports=function(code,msg){
    let error=new Error(msg);
    error.code=code;
    return error;
}

