import WS_MESSAGE_TYPE from "./WSMessageType";

export default interface IWSMessage {
  messageType: WS_MESSAGE_TYPE, 
  body: any, 
}