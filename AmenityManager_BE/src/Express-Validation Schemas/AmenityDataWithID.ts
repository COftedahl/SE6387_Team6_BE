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
    notEmpty: true, 
  },  
  location: {
    exists: true, 
  }, 
  'location.locationX': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'location.locationY': {
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