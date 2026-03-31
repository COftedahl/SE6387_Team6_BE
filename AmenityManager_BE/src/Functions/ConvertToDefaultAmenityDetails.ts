import AMENITY_STATUS from "../Types/AmenityStatus";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";

/* 
 * function to get a generic value for amenity details from an amenity
 * @param amenity: IAmenity
 * @return: IAmenityDetails
 */
const convertToDefaultAmenityDetails = (amenity: IAmenity): IAmenityDetails => {
  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
    hour12: false, 
    year: "2-digit", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
  });

  return {
    ...amenity,
    capacity: 1,
    currentAvailableSlots: 1,
    currentOccupancy: 0,
    lastUpdated: formatter.format(Date.now()),
    status: AMENITY_STATUS.OPEN,
  }
}

export default convertToDefaultAmenityDetails;