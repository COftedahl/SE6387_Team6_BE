import AMENITY_STATUS from "./AmenityStatus";
import AMENITY_TYPE from "./AmenityType";
import ILocation from "./ILocation";

export default interface IAmenityDetails {
  id: string, 
  type: AMENITY_TYPE, 
  room: string, 
  location: ILocation, 
  currentOccupancy: number, 
  currentAvailableSlots: number, 
  capacity: number, 
  status: AMENITY_STATUS, 
  lastUpdated: string, 
}