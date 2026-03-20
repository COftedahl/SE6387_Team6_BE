import AMENITY_STATUS from "./AmenityStatus";
import IAmenity from "./IAmenity";

export default interface IAmenityDetails extends IAmenity {
  currentOccupancy: number, 
  currentAvailableSlots: number, 
  capacity: number, 
  status: AMENITY_STATUS, 
  lastUpdated: string, 
}