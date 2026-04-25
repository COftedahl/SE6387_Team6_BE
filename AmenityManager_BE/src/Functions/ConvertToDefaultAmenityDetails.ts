import AMENITY_STATUS from "../Types/AmenityStatus";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import IAmenityOccupancyInfo from "../Types/IAmenityOccupancyInfo";

/* 
 * function used for initialization of mock data - returns the occupance of an amenity given its id
 * @param ID: string containing amenity ID
 * @return: IAmenityOccupancyInfo of the occupancy
 */
const getOccupanceInfo = (id: string): IAmenityOccupancyInfo => {
  const AVLBL_SLOTS_0: string[] = [11, 14, 17, ].map((v) => "" + v);
  const AVLBL_SLOTS_5: string[] = [15, 27, 31, ].map((v) => "" + v);
  const AVLBL_SLOTS_10: string[] = [12, 18, 33, ].map((v) => "" + v);

  const randVal: number = Math.ceil(Math.random() * 10);

  if (AVLBL_SLOTS_0.includes(id)) {
    return {
      currentOccupancy: randVal, 
      currentAvailableSlots: 0, 
      capacity: randVal + 0, 
    }
  }
  else if (AVLBL_SLOTS_5.includes(id)) {
    return {
      currentOccupancy: randVal, 
      currentAvailableSlots: 5, 
      capacity: randVal + 5, 
    }
  }
  else if (AVLBL_SLOTS_10.includes(id)) {
    return {
      currentOccupancy: randVal, 
      currentAvailableSlots: 10, 
      capacity: randVal + 10, 
    }
  }
  else {
    return {
      currentOccupancy: randVal, 
      currentAvailableSlots: 1, 
      capacity: randVal + 1, 
    }
  }
}

/* 
 * function used for initialization of mock data - returns the status of an amenity given its id
 * @param ID: string containing amenity ID
 * @return: AMENITY_STATUS of the occupancy
 */
const getStatus = (id: string): AMENITY_STATUS => {
  const OOS: string[] = [15, 30, 33, ].map((v) => "" + v);
  const CLOSED: string[] = [1, 16, 31, ].map((v) => "" + v);

  if (OOS.includes(id)) {
    return AMENITY_STATUS.OOS;
  }
  else if (CLOSED.includes(id)) {
    return AMENITY_STATUS.CLOSED;
  }
  else {
    return AMENITY_STATUS.OPEN;
  }
}

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

  const amenityOccupancyInfo = getOccupanceInfo(amenity.id);
  const status = getStatus(amenity.id);

  return {
    ...amenity,
    capacity: amenityOccupancyInfo.capacity,
    currentAvailableSlots: amenityOccupancyInfo.currentAvailableSlots,
    currentOccupancy: amenityOccupancyInfo.currentOccupancy,
    lastUpdated: formatter.format(Date.now()),
    status: status,
  }
}

export default convertToDefaultAmenityDetails;