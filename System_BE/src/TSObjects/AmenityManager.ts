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
  public getAllAmenityDetails = (): IAmenityDetails[] => {
    return [];
  }
}

export default AmenityManager;