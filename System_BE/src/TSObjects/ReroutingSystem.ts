import ILocation from "../Types/ILocation";
import IPath from "../Types/IPath";

class ReroutingSystem {
  /* 
   * function to check whether a new optimal path is different than an old path, which would indicate that the old path is now sub-optimal
   * @param newPath: IPath containing the new path
   * @param oldPath: IPath containing the old path
   * @return: boolean indicating whether new path should be taken
   */
  public checkShouldReroute = (newPath: IPath, oldPath: IPath): boolean => {
    if (newPath.route.length < 1) {
      return false;
    }
    const indexOfNewFirstLegInOldPath: number = oldPath.route.findIndex((curr: ILocation) => JSON.stringify(curr) === JSON.stringify(newPath.route[0])) ?? -1;
    const indexOfOldFirstLegInNewPath: number = newPath.route.findIndex((curr: ILocation) => JSON.stringify(curr) === JSON.stringify(oldPath.route[0])) ?? -1;
    const maxIndexOfCommonLeg: number = Math.max(indexOfNewFirstLegInOldPath, indexOfOldFirstLegInNewPath);
    const oldPathIndexAdjustment: number = (maxIndexOfCommonLeg === indexOfNewFirstLegInOldPath ? 0 : maxIndexOfCommonLeg);
    const newPathIndexAdjustment: number = (maxIndexOfCommonLeg === indexOfOldFirstLegInNewPath ? 0 : maxIndexOfCommonLeg);
    //after getting the maxIndexOfCommonLeg, if < 0 then suggest reroute; else check each leg from that index on to see if matches with old route; if any different then suggest reroute
    if (maxIndexOfCommonLeg < 0) {
      return true;
    }
    for (let i = maxIndexOfCommonLeg; i < newPath.route.length; i += 1) {
      //check if the current legs being compared are different
      if (JSON.stringify(newPath.route[i + newPathIndexAdjustment]) !== JSON.stringify(oldPath.route[i + oldPathIndexAdjustment])) {
        return true;
      }
    }
    //if all remaining legs of the route are the same, we say the new route is equivalent to the old route and no need to reroute
    return false;
  }
}

export default ReroutingSystem;