import ILocation from "../ILocation";
import IPath from "../IPath";
import REROUTE_REASON from "../RerouteReason";

export default interface IWSConnection {
  connection: any, 
  navID: string, 
  currentLocation: ILocation | null, 
  target: ILocation | null, 
  currentPath: IPath | null, 
  suggestedPath: IPath | null, 
  usingAccessibleRouting: boolean | null, 
}