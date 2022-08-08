/**
 * 
 * @param {object} document Data document
 * @param {object} model Data model
 * @returns {object} Data inserted into model
 * @throws Exception if missing required fields
 */
 export default function VerifyModel (document: any, model: any, parent?: string) {
    return Object.getOwnPropertyNames(model).map((prop) => {
      const value = document[prop];
      const modelValue = model[prop];
  
      /**
       * Model type is array, check array objects fit model
       */
      if(Array.isArray(modelValue)){
        if(!value || !Array.isArray(value) || value.length < 1){
          const required = (modelValue.length > 1 && modelValue[1] === 1);
          if(required)
            throw({
              status: 400,
              message: `Missing required Array ${(parent)? `${parent}.${prop}` : prop}`
            })
  
          return {
            key: prop,
            value: []
          }
        }
        const rowModel = modelValue[0]
        return {
          key: prop,
          value: value.map((row) => {
            return VerifyModel(row, rowModel, (parent)? `${parent}.${prop}` : prop)
          })
        }
      }
  
      /**
       * Model type is object, check childrens
       */
      if(typeof modelValue === "object"){
        return {
          key: prop,
          value: VerifyModel(value, modelValue, (parent)? `${parent}.${prop}` : prop)
        }
      }
  
      const required = (modelValue === 1);
  
      if(required && !value)
        throw({
          status: 400,
          message: `Missing required field ${(parent)? `${parent}.${prop}` : prop}`
        })
  
      return {
        key: prop,
        value: value || null
      }
    }).reduce((pv, cv) => {
      return {
        ...pv,
      [cv.key]: cv.value
      }
    }, {})
  }