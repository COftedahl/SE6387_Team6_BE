import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";

const convertDetailsToAmenityData = (details: IAmenityDetails): IAmenity => {
  return {
    id: details.id,
    type: details.type,
    room: details.room,
    location: details.location,
    accessibilityClass: details.accessibilityClass, 
  }
}

export default convertDetailsToAmenityData;