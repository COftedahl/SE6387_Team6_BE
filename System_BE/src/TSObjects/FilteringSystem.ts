import AMENITY_TYPE from "../Types/AmenityType";
import IAmenity from "../Types/IAmenity";
import IAmenityDetails from "../Types/IAmenityDetails";
import IFilter from "../Types/IFilter";
import AmenityManager from "./AmenityManager";

class FilteringSystem {
  private amenityManager: AmenityManager;
  
  public constructor(amenityManager: AmenityManager) {
    this.amenityManager = amenityManager;
  }

  /* 
   * function to get the details of a set of filtered amenities
   * @param filters: IFilter[] represnting the filters
   * @return: IAmenityDetails[] details of amenities satisfying the filters
   */
  public getAmenityDetails = async (filters: IFilter[]): Promise<IAmenityDetails[]> => {
    const allAmenities: IAmenityDetails[] = await this.amenityManager.getAllAmenityDetails();
    return this.filterDetails(allAmenities, filters);
  }

  /* 
   * function to get the set amenities satisfying a set of filters
   * @param filters: IFilter[] of filters to apply
   * @return: IAmenity[] of amenities satisfying the criteria
   */
  public getAvailableAmenities = async (filters: IFilter[]): Promise<IAmenity[]> => {
    const allAmenities: IAmenity[] = await this.amenityManager.getAmenities();
    return this.filter(allAmenities, filters);
  }

  /* 
   * function to get the set amenities satisfying a set of filters
   * @param type: AMENITY_TYPE of desired amenities
   * @param filters: IFilter[] of filters to apply
   * @return: IAmenity[] of amenities satisfying the criteria
   */
  public getAvailableAmenitiesOfType = async (type: AMENITY_TYPE, filters: IFilter[]): Promise<IAmenity[]> => {
    const allAmenities: IAmenity[] = await this.amenityManager.getAmenities();
    const updatedFilters: IFilter[] = [...filters.filter((filter: IFilter) => filter.filterKey !== "type"), { filterKey: "type", value: type }];
    return this.filter(allAmenities, updatedFilters);
  }

  /* 
   * function to filter a set of amenities by a set of filters
   * @param amenities: IAmenity[] to be filtered
   * @param filters: IFilter[] filters to be applied
   * @return: IAmenity[] of the filtered amenities
   */
  private filter = (amenities: IAmenity[], filters: IFilter[]): IAmenity[] => {
    return amenities.filter((amenity: IAmenity) => filters.reduce((accumValue: boolean, currFilter: IFilter) => accumValue && (amenity as any)[currFilter.filterKey] !== undefined && (amenity as any)[currFilter.filterKey] === currFilter.value, true));
  }

  /* 
   * function to filter a set of amenities by a set of filters
   * @param amenities: IAmenityDetails[] to be filtered
   * @param filters: IFilter[] filters to be applied
   * @return: IAmenityDetails[] of the filtered amenity details
   */
  private filterDetails = (amenities: IAmenityDetails[], filters: IFilter[]): IAmenityDetails[] => {
    return amenities.filter((amenity: IAmenityDetails) => filters.reduce((accumValue: boolean, currFilter: IFilter) => accumValue && (amenity as any)[currFilter.filterKey] !== undefined && (amenity as any)[currFilter.filterKey] === currFilter.value, true));;
  }
}

export default FilteringSystem;