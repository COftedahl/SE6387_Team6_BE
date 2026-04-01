const IDAndLevelArrSchema = {
  updates: {
    isArray: true, 
    exists: true, 
  }, 
  'updates.*.id': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  'updates.*.crowdLevel': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
}

export default IDAndLevelArrSchema;