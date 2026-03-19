import ACCESSIBILITY_CLASS from "./AccessibilityClass";
import AMENITY_TYPE from "./AmenityType";
import ILocation from "./ILocation";

export default interface IAmenity {
  id: string, 
  type: AMENITY_TYPE, 
  room: string, 
  location: ILocation, 
  accessibilityClass: ACCESSIBILITY_CLASS, 
}