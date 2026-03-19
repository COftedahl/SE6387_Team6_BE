const LocationSchema = {
  x: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  y: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
}

export default LocationSchema;