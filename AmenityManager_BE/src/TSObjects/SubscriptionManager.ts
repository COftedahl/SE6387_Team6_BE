import ISubscriber from "../Types/ISubscriber";

class SubscriptionManager {
  private static subscribers: ISubscriber[] = [];
  private static currID: number = 1;

  /* 
   * function to subscribe to update notifications
   * @param endpoint: endpoint to call, using a GET request, when an update occurs
   * @return: string containing the id assigned to the subscriber
   */
  public static addSubscriber = (endpoint: string): string => {
    const newSub: ISubscriber = {
      id: "SUB_" + SubscriptionManager.currID, 
      notificationEndpoint: endpoint, 
    }
    SubscriptionManager.subscribers.push(newSub);
    SubscriptionManager.currID += 1;
    return newSub.id;
  }

  /* 
   * function to unsubscribe from update notifications
   * @param id: string containing the id of the subscriber to unsubscribe
   * @return: boolean indicating success or not: if return false, means the subscriber did not exist
   */
  public static removeSubscriber = (id: string): boolean => {
    const subRemovingIndex: number = SubscriptionManager.subscribers.findIndex((sub: ISubscriber) => sub.id === id);
    if (subRemovingIndex < 0) {
      return false;
    }

    SubscriptionManager.subscribers.splice(subRemovingIndex, 1);
    return true;
  }

  /* 
   * function to get the list of subscribers
   * @return: ISubscriber[]
   */
  public static getSubscriberList = (): ISubscriber[] => {
    return JSON.parse(JSON.stringify(SubscriptionManager.subscribers));
  }

  /* 
   * function to notify all subscribers
   */
  public static notifySubscribers = () => {
    for (let subscriber of SubscriptionManager.subscribers) {
      try {
        fetch(subscriber.notificationEndpoint, {method: "GET"});
      }
      catch (e) {
        console.log("Error notifying subscriber <" + subscriber.id + "> at endpoint \"" + subscriber.notificationEndpoint + "\"");
      }
    }
  }
}

export default SubscriptionManager;