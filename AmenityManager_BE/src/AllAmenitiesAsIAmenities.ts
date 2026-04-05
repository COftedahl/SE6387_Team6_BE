import ALL_AMENITIES_GEO_JSON from "./AllAmenitiesGeoJSON";
import ACCESSIBILITY_CLASS from "./Types/AccessibilityClass";
import AMENITY_TYPE from "./Types/AmenityType";
import IAmenity from "./Types/IAmenity";

const ALL_AMENITIES: IAmenity[] = ALL_AMENITIES_GEO_JSON.features.map((feature, index) => {
  return {
    id: "" + feature.properties.fid, 
    type: AMENITY_TYPE.RESTROOM, 
    room: "" + index, 
    location: {x: "" + feature.geometry.coordinates[0], y: "" + feature.geometry.coordinates[1]}, 
    accessibilityClass: feature.properties.accessible ? ACCESSIBILITY_CLASS.ACCESSIBLE: ACCESSIBILITY_CLASS.INACCESSIBLE, 
    amenityInformation: feature.properties.type, 
  }
})

export default ALL_AMENITIES;