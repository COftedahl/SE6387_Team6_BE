import ILocation from "../Types/ILocation";
import IPath from "../Types/IPath";

class NavigationSystem {
  /* 
   * function to get the map to display to the user
   * @param location: ILocation indicating the user's location
   * @return: map data
   */
  public getMap = (location: ILocation) => {
    
  }

  /* 
   * function to handle starting navigation
   * @param source: ILocation of the starting location
   * @param target: ILocation of the ending location
   */
  public navigate = (source: ILocation, target: ILocation) => {

  }

  /* 
   * function to get the path between two points
   * @param source: ILocation to start at
   * @param target: ILocation to end at
   * @return: IPath to follow
   */
  public getPath = (source: ILocation, target: ILocation): IPath => {
    return {
      source: {x: "", y: ""},
      target: {x: "", y: ""},
      route: undefined,
    }
  }

  /* 
   * function to reroute the user (use a different path)
   * @param newPath: IPath of the new path to follow
   */
  public reroute = (newPath: IPath) => {
    //TODO: should this stick with the UCR, which uses target & source as params to start new nav, or use the already-computed reroute path?
  }

  /* 
   * function to handle ending navigation
   * @param navID: string containing the navigation ID of the navigation being ended
   */
  public endNavigation = (navID: string) => {

  }
}

export default NavigationSystem;