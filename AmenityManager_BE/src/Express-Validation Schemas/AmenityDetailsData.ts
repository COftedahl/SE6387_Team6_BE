import AmenityDataSchema from "./AmenityData";

const AmenityDetailsDataSchema = {
  ...AmenityDataSchema, 
  currentOccupancy: {
    exists: true, 
    isNumber: true, 
    notEmpty: true, 
  },  
  currentAvailableSlots: {
    exists: true, 
    isNumber: true, 
    notEmpty: true, 
  }, 
  capacity: {
    exists: true, 
    isNumber: true, 
    notEmpty: true, 
  }, 
  status: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  lastUpdated: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
}

export default AmenityDetailsDataSchema;