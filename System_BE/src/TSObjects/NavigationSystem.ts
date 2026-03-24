import ILocation from "../Types/ILocation";
import IPath from "../Types/IPath";
import ITileNumber from "../Types/ITileNumber";

class NavigationSystem {
  /* 
   * function to get the map to display to the user
   * @param location: ILocation indicating the user's location
   * @param zoom: number indicating the zoom level, in [0, 19] - see https://wiki.openstreetmap.org/wiki/Zoom_levels
   * @return: map data (in the form of a MapBox Vector Tile)
   */
  public getMap = async (location: ILocation, zoom: number) => {
    //note that the latLonToTileNum passes y first to indicate the latitude
    const tileNum: ITileNumber = NavigationSystem.latLonToTileNum(Number.parseFloat(location.y), Number.parseFloat(location.x), zoom);
    const queryString: string = (process.env.NAVIGATION_SYSTEM_MAP_ENDPOINT ?? "") + 
      "tile" + "(" + (tileNum.x + "," + tileNum.y + "," + tileNum.z) + ")" + ".mvt";
    const result = await fetch(queryString, 
      {
        method: process.env.NAVIGATION_SYSTEM_MAP_ENDPOINT_METHOD ?? "GET", 
      }
    ).then((res) => res.text());
    return result;
  }

  /* 
   * function to handle starting navigation
   * @param source: ILocation of the starting location
   * @param target: ILocation of the ending location
   */
  public navigate = async (source: ILocation, target: ILocation) => {
    
  }

  /* 
   * function to get the path between two points
   * @param source: ILocation to start at
   * @param target: ILocation to end at
   * @return: IPath to follow
   */
  public getPath = async (source: ILocation, target: ILocation): Promise<IPath> => {
    const result = await fetch((process.env.NAVIGATION_SYSTEM_NAV_ENDPOINT ?? "") + 
      (source.y + "," + source.x) + ";" + (target.y + "," + target.x), 
      {
        method: process.env.NAVIGATION_SYSTEM_NAV_ENDPOINT_METHOD ?? "GET", 
      }
    ).then((res) => res.json());
    console.log(result);
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
  public reroute = async (newPath: IPath) => {
    //TODO: should this stick with the UCR, which uses target & source as params to start new nav, or use the already-computed reroute path?
  }

  /* 
   * function to handle ending navigation
   * @param navID: string containing the navigation ID of the navigation being ended
   */
  public endNavigation = (navID: string) => {
    
  }

  /* 
   * function to convert latitude and longitude values to tile numbers
   * See the following for more details: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
   * @param lat: number representing the latitude (in degrees) of the point to view
   * @param lon: number representing the longitude (in degrees) of the point to view
   * @param zoom: number representing the zoom level for which to compute the tile
   * @return: ITileNumber representing the tile coordinates
   */
  public static latLonToTileNum = (lat: number, lon: number, zoom: number): ITileNumber => {
    const n: number = Math.pow(2, zoom);
    const latRadians: number = lat * Math.PI / 180;
    const xtile: number = n * ((lon + 180) / 360);
    const ytile: number = n * (1 - (Math.log(Math.tan(latRadians) + 1/(Math.cos(latRadians))) / Math.PI)) / 2;
    return {
      x: Math.round(xtile), 
      y: Math.round(ytile), 
      z: zoom, 
    }
  }
  
  /* 
   * function to convert tile numbers to latitude and longitude values
   * @param tileNum: ITileNumber representing the tile coordinates
   * @return: ILocation where {x = longitude (in degrees), y = latitude (in degrees)}
   */
  public static tileNumToLatLon = (tileNum: ITileNumber): ILocation => {
    const n: number = Math.pow(2, tileNum.z);
    const lon: number = ((tileNum.x / n) * 360.0) - 180.0;
    const latRadians: number = Math.atan(Math.sinh(Math.PI * (1 - 2 * tileNum.y / n)))
    const lat: number = latRadians * 180.0 / Math.PI;
    return {
      x: "" + lon, 
      y: "" + lat, 
    }
  }
}

export default NavigationSystem;