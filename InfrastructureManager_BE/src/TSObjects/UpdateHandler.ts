import SubscriptionManager from "./SubscriptionManager";

class UpdateHandler {
  /* 
   * function to convert an array of objects describing updates into a CSV update string
   * @param updatesArr: {start: string, end: string, speed: number}[]
   * @return: string containing the CSV update string
   */
  public static getUpdateString = (updatesArr: {start: string, end: string, speed: number}[]): string => {
    return updatesArr.map(({start, end, speed}: {start: string, end: string, speed: number}) => start + "," + end + "," + speed).join("\n");
  }

  /* 
   * function to propagate updates to the nav system
   * @param updatesArr: {start: string, end: string, speed: number}[]
   * @param res: Express.Response object from the express endpoint
   */
  public static saveUpdates = async (updatesArr: {start: string, end: string, speed: number}[], res: any) => {
    const updateString: string = UpdateHandler.getUpdateString(updatesArr);

    if (updateString.length < 1) {
      res.status(200).json({ message: "No update needed" })
      return;
    }

    const result = await fetch(process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT ?? "", {
      method: process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT_METHOD ?? "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({fileContents: updateString}), 
    });

    setTimeout(() => {
      SubscriptionManager.notifySubscribers();
    }, 5 * 1000);

    if (result.status === 200) {
      res.status(200).json({ message: (await result.json()).message })
      return
    }
    res.status(502).json({ message: "Error updating navigation BE" })
  }
}

export default UpdateHandler;