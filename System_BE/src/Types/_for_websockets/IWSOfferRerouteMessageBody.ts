import IPath from "../IPath";
import REROUTE_REASON from "../RerouteReason";

export default interface IWSOfferRerouteMessageBody {
  newRoute: IPath, 
  rerouteReason: REROUTE_REASON, 
}