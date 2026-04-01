import ILeg from "../Types/ILeg";

class HallwayWaypointConverter {
  /* 
   * function to get the nodes (waypoints) associated with a hallway
   * @param hallwayID: string
   * @return: ILeg[] of the node pairs associated with the hallway
   */
  public static getHallwayWaypoints = (hallwayID: string): ILeg[] => {
    const waypointIDs: ILeg[] = [];
    throw new Error("Need to implement HallwayWaypointConverter.getHallwayWaypoints")
    return waypointIDs;
  }
}

export default HallwayWaypointConverter;