import IWSConnection from "../Types/_for_websockets/IWSConnection";
import IWSMessage from "../Types/_for_websockets/IWSMessage";
import WS_MESSAGE_TYPE from "../Types/_for_websockets/WSMessageType";
import ILocation from "../Types/ILocation";
import IPath from "../Types/IPath";
import ITileNumber from "../Types/ITileNumber";

class NavigationSystem {
  private navigationConnections: IWSConnection[] = [];
  private static readonly NAV_ID_PREFIX: string = "NAVID_";
  private nextNavID: number = 1;
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
   * function to call when a client connects
   * @param connection: the Websocket object indicating the connection between client and server
   * @return: string containing the new connection's navID
   * SIDE EFFECTS: sends ID message to the corresponding connection
   */
  public initializeConnection = (connection: any): string => {
    const newConnection: IWSConnection = {
      navID: NavigationSystem.NAV_ID_PREFIX + this.nextNavID, 
      connection: connection, 
    }
    this.navigationConnections.push(newConnection);
    this.nextNavID += 1;
    const idMessage: IWSMessage = {
      messageType: WS_MESSAGE_TYPE.SEND_NAV_ID, 
      body: newConnection.navID,
    }
    connection.send(JSON.stringify(idMessage));
    return newConnection.navID;
  }

  /* 
   * function to handle starting navigation
   * @param source: ILocation of the starting location
   * @param target: ILocation of the ending location
   * @param useAccessibleRouting: boolean indicating whether accessible routing is needed
   * @param connection: the Websocket object indicating the connection between client and server
   * @return: IPath containing the path to use for navigation
   * SIDE EFFECTS: sends PATH message to the corresponding connection
   */
  public navigate = async (source: ILocation, target: ILocation, useAccessibleRouting: boolean, navID: string): Promise<IPath> => {
    const connection: IWSConnection | undefined = this.navigationConnections.find((wsConnection: IWSConnection) => wsConnection.navID === navID);
    if (connection !== undefined) {
      const path: IPath = await this.getPath(source, target, useAccessibleRouting);
      const pathMessage: IWSMessage = {
        messageType: WS_MESSAGE_TYPE.SEND_PATH, 
        body: path, 
      }
      connection.connection.send(JSON.stringify(pathMessage));
      return path
    }
    else {
      throw new Error("Invalid NavID \"" + navID + "\" for navigate request");
    }
  }

  /* 
   * function to get the path between two points
   * @param source: ILocation to start at
   * @param target: ILocation to end at
   * @param useAccessibleRouting: boolean indicating whether accessible routing is needed
   * @return: IPath to follow
   */
  public getPath = async (source: ILocation, target: ILocation, useAccessibleRouting: boolean): Promise<IPath> => {
    const result = await fetch((process.env.NAVIGATION_SYSTEM_NAV_ENDPOINT ?? "") + 
      (source.x + "," + source.y) + ";" + (target.x + "," + target.y)
      + (useAccessibleRouting ? "?exclude=inaccessible" : ""), 
      {
        method: process.env.NAVIGATION_SYSTEM_NAV_ENDPOINT_METHOD ?? "GET", 
      }
    ).then((res) => res.json());
    return {
      source: source, 
      target: target, 
      route: result.waypoints.map((waypoint: any) => { 
        return {
          x: waypoint.location[0], 
          y: waypoint.location[1], 
        }
      }),
    };
  }

  /* 
   * function to reroute the user (use a different path)
   * @param navID: string containing the navigation ID of the navigation being rerouted
   * @param newPath: IPath of the new path to follow
   * SIDE EFFECTS: sends PATH message to the corresponding connection
   */
  public reroute = async (navID: string, newPath: IPath) => {
    const removingConnection: IWSConnection | undefined = this.navigationConnections.find((wsConnection: IWSConnection) => wsConnection.navID === navID);
    if (removingConnection !== undefined) {
      const rerouteMessage: IWSMessage = {
        messageType: WS_MESSAGE_TYPE.SEND_PATH, 
        body: newPath, 
      }
      removingConnection.connection.send(JSON.stringify(rerouteMessage));
    }
    else {
      throw new Error("Invalid NavID \"" + navID + "\" for reroute request");
    }
  }

  /* 
   * function to handle ending navigation
   * @param navID: string containing the navigation ID of the navigation being ended
   * SIDE EFFECTS: removes corresponding IWSConnection object from this.navigationConnections and closes the websocket connection
   */
  public endNavigation = (navID: string) => {
    console.log("Closing connection for ID ", navID);
    const removingConnectionIndex: number = this.navigationConnections.findIndex((wsConnection: IWSConnection) => wsConnection.navID === navID);
    if (removingConnectionIndex >= 0) {
      const removingConnection: IWSConnection = this.navigationConnections[removingConnectionIndex];
      this.navigationConnections.splice(removingConnectionIndex, 1);
      removingConnection.connection.close();
    }
    else {
      throw new Error("Invalid NavID \"" + navID + "\" for end navigation request");
    }
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