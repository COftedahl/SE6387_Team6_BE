const AmenityDataArraySchema = {
  data: {
    isArray: true, 
    exists: true, 
  }, 
  'data.*.id': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'data.*.type': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'data.*.room': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  },  
  'data.*.location': {
    exists: true, 
  }, 
  'data.*.location.locationX': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'data.*.location.locationY': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'data.*.accessibilityClass': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
}

export default AmenityDataArraySchema;