import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import { BLANK_AMENITY_DETAILS } from "../constants";

class AmenityManager {
  /* 
   * function to retrieve amenities
   * @return: IAmenity[]
   */
  public getAmenities = async (): Promise<IAmenity[]> => {
    if (process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD !== undefined && process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT !== undefined) {
      const result = await fetch(process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT, {
        method: process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD,
      }).then((res) => res.text());
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
    if (process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD !== undefined && process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT !== undefined) {
      const result = await fetch(process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT, {
        method: process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD,
        headers: {
          "Content-Type": "application/json", 
        }, 
        body: JSON.stringify({id: id}),
      }).then((res) => res.text());
      return JSON.parse(result);
    }
    return BLANK_AMENITY_DETAILS;
  }

  /* 
   * function to get the details of a all amenities
   * @return: IAmenityDetails[] details about the amenities
   */
  public getAllAmenityDetails = async (): Promise<IAmenityDetails[]> => {
    if (process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD !== undefined && process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT !== undefined) {
      const result = await fetch(process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT, {
        method: process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD,
      }).then((res) => res.text());
      return JSON.parse(result);
    }
    return [];
  }
}

export default AmenityManager;