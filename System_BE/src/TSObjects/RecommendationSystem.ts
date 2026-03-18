import AMENITY_SORTING_TYPE from "../Types/AmenitySortingType";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import IFilter from "../Types/IFilter";
import ILocation from "../Types/ILocation";
import FilteringSystem from "./FilteringSystem";

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
  public getMapSuggestions = (filters: IFilter[], userLocation: ILocation, sortBy: AMENITY_SORTING_TYPE) => {
    const possibleAmenities: IAmenity[] = this.filteringSystem.getAvailableAmenities(filters);
    return this.generateSuggestions(possibleAmenities, userLocation, sortBy);
  }

  /* 
   * function that actually generates suggestions for a given set of filters
   * @param possibleAmenities: IAmenity[] list of amenities satisfying the user's filters
   * @param userLocation: ILocation[] current location of the user
   * @return: IAmenity[] of the suggested amenities matching the filters
   */
  private generateSuggestions = (possibleAmenities: IAmenity[], userLocation: ILocation, sortBy: AMENITY_SORTING_TYPE): IAmenity[] => {
    return possibleAmenities.sort((a: IAmenity, b: IAmenity) => RecommendationSystem.getAmenitySortingFunction(sortBy)(a, b, userLocation));
  }

  /* 
   * function that computes distance between 2 locations
   * @param location1: ILocation[] 
   * @param location2: ILocation[] 
   * @return: number representing the distance between locations
   */
  private static distanceBetween = (location1: ILocation, location2: ILocation): number => {
    return Math.sqrt(Math.pow(Math.abs(Number.parseFloat(location1.x) - (Number.parseFloat(location2.x))), 2) 
                   + Math.pow(Math.abs(Number.parseFloat(location1.x) - (Number.parseFloat(location2.x))), 2)
    );
  }

  /* 
   * function to get the sorting function based on user's preferences
   * @param sortBy: AMENITY_SORTING_TYPE indicating user's preferences
   * @return: function of the form (a: IAmenity, b: IAmenity, userLocation: ILocation) => number used to sort amenities
   */
  //TODO: make this method actually do what it's supposed to
  private static getAmenitySortingFunction = (sortBy: AMENITY_SORTING_TYPE): ((a: IAmenity, b: IAmenity, userLocation: ILocation) => number) => {
    switch (sortBy) {
      case AMENITY_SORTING_TYPE.BEST_ROUTE: 
        return (a: IAmenity, b: IAmenity, userLocation: ILocation) => (RecommendationSystem.distanceBetween(a.location, userLocation) > RecommendationSystem.distanceBetween(a.location, userLocation) ? 1 : 0);
        break;
      case AMENITY_SORTING_TYPE.LEAST_WALKING: 
        return (a: IAmenity, b: IAmenity, userLocation: ILocation) => (RecommendationSystem.distanceBetween(a.location, userLocation) > RecommendationSystem.distanceBetween(a.location, userLocation) ? 1 : 0);
        break;
      default: 
      case AMENITY_SORTING_TYPE.LEAST_WAIT_TIME: 
        return (a: IAmenity, b: IAmenity, userLocation: ILocation) => (RecommendationSystem.distanceBetween(a.location, userLocation) > RecommendationSystem.distanceBetween(a.location, userLocation) ? 1 : 0);
        break;
    }
  }
}

export default RecommendationSystem;