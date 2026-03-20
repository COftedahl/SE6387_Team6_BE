import AmenityDataWithIDSchema from "./AmenityDataWithID";


const AmenityDetailsDataWithIDSchema = {
  ...AmenityDataWithIDSchema, 
  currentOccupancy: {
    exists: true, 
    isInt: true, 
    notEmpty: true, 
  },  
  currentAvailableSlots: {
    exists: true, 
    isInt: true, 
    notEmpty: true, 
  }, 
  capacity: {
    exists: true, 
    isInt: true, 
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

export default AmenityDetailsDataWithIDSchema;