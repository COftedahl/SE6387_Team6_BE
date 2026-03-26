import ILocation from "../ILocation";

export default interface IWSNavigateMessageBody {
  source: ILocation,
  target: ILocation,
  useAccessibleRouting: boolean, 
}