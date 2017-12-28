/**
 * common query for mongoose
 */
import * as models from '../models/models';
const mongoose=require('mongoose');
/**
 * 
 * @param {String} category 
 * @param {Array} fields 
 * @param {Object} sortOptions 
 * @param {Number} limit 
 */
module.exports = (category, fields, sortOptions, limit) => (fieldVs) => {
      let model=mongoose.model(category);
      if(model){
        let option = {};
        if(fields.length!=fieldVs.length){
            throw new Error("Fields mismatch fieldVs");
        }
        fields.forEach((f,idx)=>{
            option[f]=fieldVs[idx];
        })
        return model.find(option).limit(limit || Number.MAX_SAFE_INTEGER).sort(sortOptions || {});
      }
      else throw new Error("Model not supported by mongoose");
}