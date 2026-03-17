import IAmenity from "../Types/IAmenity";
import IFilter from "../Types/IFilter";

class RecommendationSystem {
  /* 
   * function to get the suggested amenities for a given accomodation profile
   * @param TODO: accountID OR filters
   * @return: IAmenity[] of the suggested amenities
   */
  public getMapSuggestions = () => {

  }

  /* 
   * function that actually generates suggestions for a given set of filters
   * @param filters: IFilter[] indicating an accessibility profile
   * @return: IAmenity[] of the suggested amenities matching the filters
   */
  private generateSuggestions = (filters: IFilter[]): IAmenity[] => {
    return [];
  }
}

export default RecommendationSystem;