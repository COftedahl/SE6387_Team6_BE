const IDAndStatusArrSchema = {
  updates: {
    isArray: true, 
    exists: true, 
  }, 
  'updates.*.id': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  'updates.*.status': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
}

export default IDAndStatusArrSchema;