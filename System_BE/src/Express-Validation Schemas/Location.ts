const LocationSchema = {
  locationX: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  locationY: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
}

export default LocationSchema;