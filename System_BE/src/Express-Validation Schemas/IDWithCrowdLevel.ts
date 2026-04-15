const IDWithCrowdLevelSchema = {
  id: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  crowdLevel: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
}

export default IDWithCrowdLevelSchema;