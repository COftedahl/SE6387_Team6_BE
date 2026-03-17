import ILocation from "./ILocation";

export default interface IPath {
  source: ILocation, 
  target: ILocation, 
  route: any, 
}