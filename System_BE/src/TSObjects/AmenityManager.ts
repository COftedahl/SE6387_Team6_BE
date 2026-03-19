import AMENITY_STATUS from "../Types/AmenityStatus";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import AMENITY_TYPE from "../Types/AmenityType";
import ACCESSIBILITY_CLASS from "../Types/AccessibilityClass";

class AmenityManager {
  /* 
   * function to retrieve amenities
   * @return: IAmenity[]
   */
  public getAmenities = async (): Promise<IAmenity[]> => {
    if (process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD && process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT) {
      const result = await fetch(process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT, {
        method: process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD,
      }).then((res) => res.json());
      return JSON.parse(result);
    }
    return [];
  }

  /* 
   * function to get the details of a particular amenity
   * @param id: string indicating the id of the amenity for which details should be retrieved
   * @return: IAmenityDetails details about the amenity
   */
  public getAmenityDetails = async (id: string): Promise<IAmenityDetails> => {
    if (process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD && process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT) {
      const result = await fetch(process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT, {
        method: process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD,
        body: JSON.stringify({id: id}),
      }).then((res) => res.json());
      return JSON.parse(result);
    }
    return {
      currentOccupancy: 0,
      currentAvailableSlots: 0,
      capacity: 0,
      status: AMENITY_STATUS.OPEN,
      lastUpdated: "",
      id: "",
      type: AMENITY_TYPE.BAR,
      room: "",
      location: {
        x: "",
        y: ""
      },
      accessibilityClass: ACCESSIBILITY_CLASS.ACCESSIBLE,
    }
  }

  /* 
   * function to get the details of a all amenities
   * @return: IAmenityDetails[] details about the amenities
   */
  public getAllAmenityDetails = async (): Promise<IAmenityDetails[]> => {
    if (process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD && process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT) {
      const result = await fetch(process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT, {
        method: process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD,
      }).then((res) => res.json());
      return JSON.parse(result);
    }
    return [];
  }
}

export default AmenityManager;