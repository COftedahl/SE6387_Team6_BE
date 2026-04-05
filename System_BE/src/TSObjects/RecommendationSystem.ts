import AMENITY_SORTING_TYPE from "../Types/AmenitySortingType";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import IFilter from "../Types/IFilter";
import ILocation from "../Types/ILocation";
import FilteringSystem from "./FilteringSystem";

interface IExtendedAmenityDetails extends IAmenityDetails {
  distanceToAmenity?: number, 
  durationToAmenity?: number, 
}

class RecommendationSystem {
  private filteringSystem: FilteringSystem;
  
  public constructor(filteringSystem: FilteringSystem) {
    this.filteringSystem = filteringSystem;
  }
  /* 
   * function to get the suggested amenities for a given accomodation profile
   * @param filters: IFilter[] of filters from the user's profile
   * @param userLocation: ILocation[] current location of the user
   * @return: IAmenity[] of the suggested amenities
   */
  public getMapSuggestions = async (filters: IFilter[], userLocation: ILocation, sortBy: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
    const possibleAmenities: IAmenityDetails[] = await this.filteringSystem.getAmenityDetails(filters);
    return await this.generateSuggestions(possibleAmenities, userLocation, sortBy);
  }

  /* 
   * function that actually generates suggestions for a given set of filters
   * @param possibleAmenities: IAmenity[] list of amenities satisfying the user's filters
   * @param userLocation: ILocation[] current location of the user
   * @return: IAmenity[] of the suggested amenities matching the filters
   */
  private generateSuggestions = async (possibleAmenities: IAmenityDetails[], userLocation: ILocation, sortBy: AMENITY_SORTING_TYPE): Promise<IAmenityDetails[]> => {
    let durationTable: number[] | null = null;
    let distanceTable: number[] | null = null;
    if (sortBy !== AMENITY_SORTING_TYPE.LEAST_WAIT_TIME && 
      process.env.NAVIGATION_SYSTEM_TABLE_ENDPOINT !== undefined && 
      process.env.NAVIGATION_SYSTEM_TABLE_ENDPOINT_METHOD !== undefined
    ) {
      const url: string = process.env.NAVIGATION_SYSTEM_TABLE_ENDPOINT + 
          (userLocation.x + "," + userLocation.y) + 
          (possibleAmenities.map((amenity: IAmenityDetails) => ";" + amenity.location.x + "," + amenity.location.y).join("")) + 
          "?sources=0&annotations=distance,duration";
      const result = await fetch(url, 
      {
        method: process.env.NAVIGATION_SYSTEM_TABLE_ENDPOINT_METHOD,
      }).then((res) => res.json());
      durationTable = result.durations[0];
      distanceTable = result.distances[0];
    }
    const extendedAmenities: IExtendedAmenityDetails[] = (durationTable !== null && distanceTable !== null ? 
      possibleAmenities.map((amenity, index: number) => {return {...amenity, distanceToAmenity: distanceTable[index + 1], durationToAmenity: durationTable[index + 1]}}) 
    : 
      possibleAmenities
    )
    // return possibleAmenities.sort((a: IExtendedAmenityDetails, b: IExtendedAmenityDetails) => RecommendationSystem.getAmenitySortingFunction(sortBy)(a, b));
    return extendedAmenities.sort(RecommendationSystem.getAmenitySortingFunction(sortBy));
  }

  /* 
   * function to get the sorting function based on user's preferences
   * @param sortBy: AMENITY_SORTING_TYPE indicating user's preferences
   * @return: function of the form (a: IExtendedAmenityDetails, b: IExtendedAmenityDetails) => number used to sort amenities
   */
  private static getAmenitySortingFunction = (sortBy: AMENITY_SORTING_TYPE): ((a: IExtendedAmenityDetails, b: IExtendedAmenityDetails) => number) => {
    switch (sortBy) {
      case AMENITY_SORTING_TYPE.BEST_ROUTE: 
        return (a: IExtendedAmenityDetails, b: IExtendedAmenityDetails) => (a.durationToAmenity !== undefined && b.durationToAmenity !== undefined ? 
          (a.durationToAmenity > b.durationToAmenity ? 1 : -1)
        : 
          1
        );
      case AMENITY_SORTING_TYPE.LEAST_WALKING: 
        return (a: IExtendedAmenityDetails, b: IExtendedAmenityDetails) => (a.distanceToAmenity !== undefined && b.distanceToAmenity !== undefined ? 
          (a.distanceToAmenity > b.distanceToAmenity ? 1 : -1)
        : 
          1
        );
      default: 
      case AMENITY_SORTING_TYPE.LEAST_WAIT_TIME: 
        return (a: IExtendedAmenityDetails, b: IExtendedAmenityDetails) => (a.currentAvailableSlots > b.currentAvailableSlots ? 1 : 0);
    }
  }
}

export default RecommendationSystem;