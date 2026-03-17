import IFilter from "../Types/IFilter";

class AccountManager {
  /* 
   * function to get the filters of an account
   * @param id: string holding the account id
   * @return: IFilter[] the filters saved with the account
   */
  public getAccountFilters = (id: string): IFilter[] => {
    return [];
  }
}

export default AccountManager;