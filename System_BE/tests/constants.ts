import AmenityManager from "../src/TSObjects/AmenityManager";
import FilteringSystem from "../src/TSObjects/FilteringSystem";
import ACCESSIBILITY_CLASS from "../src/Types/AccessibilityClass";
import AMENITY_STATUS from "../src/Types/AmenityStatus";
import AMENITY_TYPE from "../src/Types/AmenityType";
import IAmenity from "../src/Types/IAmenity";
import IAmenityDetails from "../src/Types/IAmenityDetails";

export const TESTING_AMENITIES_ROUTE_PATH: string = "/amenities";
export const TESTING_NAV_ROUTE_PATH: string = "/nav";
export const TESTING_ORIGINAL_LOG = console.log;
export const TESTING_EMPTY_AMENITY_DETAILS: IAmenityDetails = {
  currentOccupancy: 0,
  currentAvailableSlots: 0,
  capacity: 0,
  status: AMENITY_STATUS.OPEN,
  lastUpdated: '',
  id: '',
  type: AMENITY_TYPE.BAR,
  room: '',
  location: {
    x: '',
    y: ''
  },
  accessibilityClass: ACCESSIBILITY_CLASS.ACCESSIBLE
};
export const TESTING_AMENITY_MANAGER: AmenityManager = new AmenityManager();
//modify amenityManager functions to be useful for testing the filtering system
  TESTING_AMENITY_MANAGER.getAmenities = async (): Promise<IAmenity[]> => {
    return [testAmenity1, testAmenity2, testAmenity3];
  }

  TESTING_AMENITY_MANAGER.getAmenityDetails = async (id: string): Promise<IAmenityDetails> => {
    switch (Number.parseInt(id)) {
      case 1: 
        return testAmenityDetails1;
        break;
      case 2: 
        return testAmenityDetails2;
        break;
      default: 
      case 3: 
        return testAmenityDetails3;
        break;
    }
  }

  TESTING_AMENITY_MANAGER.getAllAmenityDetails = async (): Promise<IAmenityDetails[]> => {
    return [testAmenityDetails1, testAmenityDetails2, testAmenityDetails3];
  }
export const TESTING_FILTERING_SYSTEM: FilteringSystem = new FilteringSystem(TESTING_AMENITY_MANAGER);
export const testAmenity1: IAmenity = {
  id: '1',
  type: AMENITY_TYPE.BAR,
  room: '',
  location: {
    x: '',
    y: ''
  },
  accessibilityClass: ACCESSIBILITY_CLASS.ACCESSIBLE
};
export const testAmenity2: IAmenity = {
  id: '2',
  type: AMENITY_TYPE.RESTROOM,
  room: '',
  location: {
    x: '',
    y: ''
  },
  accessibilityClass: ACCESSIBILITY_CLASS.INACCESSIBLE
};
export const testAmenity3: IAmenity = {
  id: '3',
  type: AMENITY_TYPE.COFFEE,
  room: '',
  location: {
    x: '',
    y: ''
  },
  accessibilityClass: ACCESSIBILITY_CLASS.ACCESSIBLE
};
export const testAmenityDetails1: IAmenityDetails = {
  ...testAmenity1, 
  currentOccupancy: 0,
  currentAvailableSlots: 4,
  capacity: 4,
  status: AMENITY_STATUS.OOS,
  lastUpdated: '',
}
export const testAmenityDetails2: IAmenityDetails = {
  ...testAmenity2, 
  currentOccupancy: 1,
  currentAvailableSlots: 2,
  capacity: 3,
  status: AMENITY_STATUS.OPEN,
  lastUpdated: '',
}
export const testAmenityDetails3: IAmenityDetails = {
  ...testAmenity3, 
  currentOccupancy: 0,
  currentAvailableSlots: 3,
  capacity: 3,
  status: AMENITY_STATUS.CLOSED,
  lastUpdated: '',
}