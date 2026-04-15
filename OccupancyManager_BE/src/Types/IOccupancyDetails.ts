import AMENITY_STATUS from "./AmenityStatus";

export default interface IOccupancyDetails {
  currentOccupancy: number, 
  currentAvailableSlots: number, 
  capacity: number, 
  status: AMENITY_STATUS, 
  lastUpdated: string, 
}