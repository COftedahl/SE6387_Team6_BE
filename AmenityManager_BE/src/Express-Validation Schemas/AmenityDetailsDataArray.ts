import AmenityDataArraySchema from "./AmenityDataArray";

const AmenityDetailsDataArraySchema = {
  ...AmenityDataArraySchema, 
  'data.*.currentOccupancy': {
    exists: true, 
    isNumber: true, 
    notEmpty: true, 
  },  
  'data.*.currentAvailableSlots': {
    exists: true, 
    isNumber: true, 
    notEmpty: true, 
  }, 
  'data.*.capacity': {
    exists: true, 
    isNumber: true, 
    notEmpty: true, 
  }, 
  'data.*.status': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'data.*.lastUpdated': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
}

export default AmenityDetailsDataArraySchema;