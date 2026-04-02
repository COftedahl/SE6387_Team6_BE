import INFRASTRUCTURE_STATUS from "./InfrastructureStatus";
import ILocation from "./ILocation";

export default interface IHallway {
  id: string, 
  name: string, 
  start: ILocation, 
  end: ILocation, 
  status: INFRASTRUCTURE_STATUS, 
  crowdLevel: CROWD_LEVEL, 
}