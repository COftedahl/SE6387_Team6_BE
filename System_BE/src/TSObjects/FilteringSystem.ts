import AMENITY_TYPE from "../Types/AmenityType";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import IFilter from "../Types/IFilter";

class FilteringSystem {
  /* 
   * function to get the details of a set of filtered amenities
   * @param filters: IFilter[] represnting the filters
   * @return: IAmenityDetails[] details of amenities satisfying the filters
   */
  public getAmenityDetails = (filters: IFilter[]): IAmenityDetails[] => {
    return [];
  }

  /* 
   * function to get the set amenities satisfying a set of filters
   * @param type: AMENITY_TYPE of desired amenities
   * @param filters: IFilter[] of filters to apply
   * @return: IAmenity[] of amenities satisfying the criteria
   */
  public getAvailableAmenities = (type: AMENITY_TYPE, filters: IFilter[]): IAmenity[] => {
    return [];
  }

  /* 
   * function to filter a set of amenities by a set of filters
   * @param amenities: IAmenity[] to be filtered
   * @param filters: IFilter[] filters to be applied
   * @return: IAmenity[] of the filtered amenities
   */
  private filter = (amenities: IAmenity[], filters: IFilter[]): IAmenity[] => {
    return [];
  }

  /* 
   * function to filter a set of amenities by a set of filters
   * @param amenities: IAmenityDetails[] to be filtered
   * @param filters: IFilter[] filters to be applied
   * @return: IAmenityDetails[] of the filtered amenity details
   */
  private filterDetails = (amenities: IAmenityDetails[], filters: IFilter[]): IAmenityDetails[] => {
    return [];
  }
}

export default FilteringSystem;