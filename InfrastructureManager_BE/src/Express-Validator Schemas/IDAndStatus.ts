const IDAndStatusSchema = {
  id: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  status: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
}

export default IDAndStatusSchema;