const AmenityDataWithIDSchema = {
  oldID: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  id: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  type: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  room: {
    exists: true, 
    isString: true, 
  },  
  location: {
    exists: true, 
  }, 
  'location.x': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'location.y': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  accessibilityClass: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
}

export default AmenityDataWithIDSchema;