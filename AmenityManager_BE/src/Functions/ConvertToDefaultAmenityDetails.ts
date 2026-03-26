import AMENITY_STATUS from "../Types/AmenityStatus";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";

/* 
 * function to get a generic value for amenity details from an amenity
 * @param amenity: IAmenity
 * @return: IAmenityDetails
 */
const convertToDefaultAmenityDetails = (amenity: IAmenity): IAmenityDetails => {
  return {
    ...amenity,
    capacity: 1,
    currentAvailableSlots: 1,
    currentOccupancy: 0,
    lastUpdated: "",
    status: AMENITY_STATUS.OPEN,
  }
}

export default convertToDefaultAmenityDetails;