import IEnvInfo from "../Types/IEnvInfo";
import IPath from "../Types/IPath";

class ReroutingSystem {
  /* 
   * function to calculate a route from the new environmental information
   * @param updatedEnvInfo: IEnvInfo containing the updated env info
   * @return: IPath calculated using the new info
   */
  public getRoute = (updatedEnvInfo: IEnvInfo): IPath => {
    return {
      source: {x: "", y: ""},
      target: {x: "", y: ""},
      route: [],
    }
  }
}

export default ReroutingSystem;