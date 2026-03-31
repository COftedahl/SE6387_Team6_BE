const WeightsUpdateSchema = {
  fileContents: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }
}

export default WeightsUpdateSchema;