import FiltersSchema from "./Filters";
import LocationSchema from "./Location";

const LocationPlusFiltersSchema = {
  ...LocationSchema, 
  ...FiltersSchema, 
}

export default LocationPlusFiltersSchema;