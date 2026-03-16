import LocationSchema from "./Location";

const LocationPlusTypeSchema = {
  ...LocationSchema, 
  amenityType: {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }
}

export default LocationPlusTypeSchema;