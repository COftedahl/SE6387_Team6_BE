import LocationSchema from "./Location";

const LocationPlusZoomSchema = {
  ...LocationSchema, 
  zoom: {
    isInt: true, 
    exists: true, 
  }, 
}

export default LocationPlusZoomSchema;