import INFRASTRUCTURE_STATUS from "../Types/InfrastructureStatus";

class SpeedConverter {
  /* 
   * function to convert a crowd level to a speed
   * @param crowdLevel: CROWD_LEVEL
   * @return: number indicating corresponding speed
   */
  public static crowdLevelToSpeed = (crowdLevel: CROWD_LEVEL): number => {
    switch (crowdLevel) {
      case CROWD_LEVEL.STANDSTILL:
        return 0;
        break;
      case CROWD_LEVEL.HIGH: 
        return 2.5;
        break;
      case CROWD_LEVEL.MEDIUM: 
        return 4;
        break;
      case CROWD_LEVEL.LOW: 
      case CROWD_LEVEL.EMPTY: 
      default:
        return 5; //5 is the standard walking speed for OSRM
        break;
    }
  }

  /* 
   * function to convert a status and crowd level combination to a speed
   * @param crowdLevel: CROWD_LEVEL
   * @param status: INFRASTRUCTURE_STATUS
   * @return: number indicating the corresponding speed
   */
  public static statusToSpeed = (crowdLevel: CROWD_LEVEL, status: INFRASTRUCTURE_STATUS): number => {
    const crowdLevelSpeed: number = SpeedConverter.crowdLevelToSpeed(crowdLevel);
    let statusSpeedCap: number = 5;
    switch (status) {
      default: 
      case INFRASTRUCTURE_STATUS.OPEN: 
        statusSpeedCap = 5;
        break;
      case INFRASTRUCTURE_STATUS.CLOSED: 
      case INFRASTRUCTURE_STATUS.OOS: 
        statusSpeedCap = 0;
        break;
    }
    return Math.min(statusSpeedCap, crowdLevelSpeed);
  }
}

export default SpeedConverter;