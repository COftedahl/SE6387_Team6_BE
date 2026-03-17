import AMENITY_STATUS from "../Types/AmenityStatus";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import AMENITY_TYPE from "../Types/AmenityType";

class AmenityManager {
  /* 
   * function to retrieve amenities
   * @return: IAmenity[]
   */
  public getAmenities = (): IAmenity[] => {
    return [];
  }

  /* 
   * function to get the details of a particular amenity
   * @param id: string indicating the id of the amenity for which details should be retrieved
   * @return: IAmenityDetails details about the amenity
   */
  public getAmenityDetails = (id: string): IAmenityDetails => {
    return {
      id: "",
      type: AMENITY_TYPE.BAR,
      room: "",
      location: {
        x: "",
        y: ""
      },
      currentOccupancy: 0,
      currentAvailableSlots: 0,
      capacity: 0,
      status: AMENITY_STATUS.OPEN,
      lastUpdated: ""
    }
  }
}

export default AmenityManager;