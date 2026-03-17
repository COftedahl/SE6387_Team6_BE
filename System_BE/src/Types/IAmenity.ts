import AMENITY_TYPE from "./AmenityType";

export default interface IAmenity {
  id: string, 
  type: AMENITY_TYPE, 
  room: string, 
}