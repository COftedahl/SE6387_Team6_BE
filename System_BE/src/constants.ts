import ACCESSIBILITY_CLASS from "./Types/AccessibilityClass";
import AMENITY_STATUS from "./Types/AmenityStatus";
import AMENITY_TYPE from "./Types/AmenityType";
import IAmenityDetails from "./Types/IAmenityDetails";

export const BLANK_AMENITY_DETAILS: IAmenityDetails = {
  currentOccupancy: 0,
  currentAvailableSlots: 0,
  capacity: 0,
  status: AMENITY_STATUS.OPEN,
  lastUpdated: "",
  id: "",
  type: AMENITY_TYPE.BAR,
  room: "",
  location: {
    x: "",
    y: ""
  },
  accessibilityClass: ACCESSIBILITY_CLASS.ACCESSIBLE,
}