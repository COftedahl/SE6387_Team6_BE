import FiltersSchema from "./Filters";
import LocationSchema from "./Location";
import SortMethodSchema from "./SortMethod";

const LocationPlusFiltersPlusSortMethodSchema = {
  ...LocationSchema, 
  ...FiltersSchema, 
  ...SortMethodSchema, 
}

export default LocationPlusFiltersPlusSortMethodSchema;