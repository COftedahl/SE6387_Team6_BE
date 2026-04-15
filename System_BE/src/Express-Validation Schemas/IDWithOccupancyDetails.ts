const IDWithOccupancyDetailsSchema = {
  id: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  details: {
    exists: true, 
  }, 
  'details.currentOccupancy': {
    isInt: true, 
    exists: true, 
  }, 
  'details.currentAvailableSlots': {
    isInt: true, 
    exists: true, 
  }, 
  'details.capacity': {
    isInt: true, 
    exists: true, 
  }, 
  'details.status': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  'details.lastUpdated': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
}

export default IDWithOccupancyDetailsSchema;