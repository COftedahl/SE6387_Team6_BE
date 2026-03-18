import AMENITY_STATUS from "./AmenityStatus";
import AMENITY_TYPE from "./AmenityType";
import IAmenity from "./IAmenity";
import ILocation from "./ILocation";

export default interface IAmenityDetails extends IAmenity {
  currentOccupancy: number, 
  currentAvailableSlots: number, 
  capacity: number, 
  status: AMENITY_STATUS, 
  lastUpdated: string, 
}