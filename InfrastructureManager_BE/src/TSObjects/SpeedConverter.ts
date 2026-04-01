class SpeedConverter {
  /* 
   * function to convert a crowd level to a speed
   * @param crowdLevel: CROWD_LEVEL
   * @return: number indicating corresponding speed
   */
  public static crowdLevelToSpeed = (crowdLevel: CROWD_LEVEL): number => {
    switch (crowdLevel) {
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
}

export default SpeedConverter;