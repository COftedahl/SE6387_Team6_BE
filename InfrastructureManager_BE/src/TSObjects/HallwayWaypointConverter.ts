import ILeg from "../Types/ILeg";
import ALL_HALLWAYS from "../AllHallways";
import ALL_NAV_DATA_DOC from "../AllNavData";

class HallwayWaypointConverter {
  /* 
   * function to get the nodes (waypoints) associated with a hallway
   * @param hallwayID: string
   * @param bidirectional: boolean indicating whether the routes in both directions should be returned
   * @return: ILeg[] of the node pairs associated with the hallway
   */
  public static getHallwayWaypoints = async (hallwayID: string, bidirectional: boolean = true): Promise<ILeg[]> => {
    const hallwayIndex: number = ALL_HALLWAYS.findIndex((currHall) => currHall.id === hallwayID);
    if (hallwayIndex < 0) {
      throw new Error("Invalid hallway id " + hallwayID + " received by HallwayWaypointConverter.getHallwayWaypoints");
      return [];
    }
    const hallway = ALL_HALLWAYS[hallwayIndex];
    let path: {lat: string, lon: string}[] = [];
    try {
      const routingResult = await fetch(
        process.env.NAVIGATION_SYSTEM_NAV_ENDPOINT + 
          hallway.start.lon + "," + hallway.start.lat + ";" + 
          hallway.end.lon   + "," + hallway.end.lat, 
        {
          method: process.env.NAVIGATION_SYSTEM_NAV_ENDPOINT_METHOD ?? "GET", 
        }, 
      );

      if (routingResult.status !== 200) {
        throw new Error("Error getting route between points " + 
          JSON.stringify(hallway.start) + ", " + JSON.stringify(hallway.end) + 
          ". Received status " + routingResult.status);
        return [];
      }

      path = (await routingResult.json()).waypoints.map((obj: any) => { 
        return { lat: obj.location[1], lon: obj.location[0] } 
      });
    } catch (e) {
      path = [hallway.start, hallway.end];
    }

    const pathNodes = [];

    for (let pathEntry of path) {
      const nearestResult = await fetch(process.env.NAVIGATION_SYSTEM_NEAREST_ENDPOINT + pathEntry.lon + "," + pathEntry.lat + "?number=1", 
        {method: process.env.NAVIGATION_SYSTEM_NEAREST_ENDPOINT_METHOD ?? "GET"}
      );
      if (nearestResult.status === 200) {
        const result = await nearestResult.json();
        const id = result.waypoints[0].nodes[1];
        pathNodes.push(id);
      }
    }

    const allWays = ALL_NAV_DATA_DOC.getElementsByTagName("way");
    const waysArray = Array.from({ length: allWays.length }, (_, i) => allWays.item(i));
    // const allNodes = ALL_NAV_DATA_DOC.getElementsByTagName("node");

    const nodePairsToModify = new Set();

    //loop over all nodes in path
    for (let nodeID of pathNodes) {
      // console.log(nodeID);
      let includesNode = false;
      // console.log(allWays[0]);
      // console.log(typeof allWays)
      for (let way of waysArray) {
        includesNode = false;
        if (way !== null) {
          const wayChildNodesArr = Array.from(way.childNodes)
          for (let i = 1; i < wayChildNodesArr.length - 1; i += 1) {
            const child = wayChildNodesArr[i];
            if ((child as any).nodeName === "nd") {
              const refAttr = (child as any).attributes.getNamedItem("ref").value;
              includesNode = includesNode || (refAttr !== null && refAttr == nodeID);
            }
          }
          if (includesNode) {
            const childNodes = []
            // console.log("Adding all nodes from way id=" + (way as any).attributes.getNamedItem("id").value + " to return set");
            const wayChildNodesArr = Array.from(way.childNodes);
            for (let child of wayChildNodesArr) {
              if (child.nodeName === "nd") {
                childNodes.push(child);
              }
            }
            //add each pair of nodes to the set
            for (let i = 0; i < childNodes.length - 1; i += 1) {
              nodePairsToModify.add(JSON.stringify({
                0: (childNodes[i] as any).attributes.getNamedItem("ref").value, 
                1: (childNodes[i + 1] as any).attributes.getNamedItem("ref").value
              }));
              if (bidirectional) {
                nodePairsToModify.add(JSON.stringify({
                  1: (childNodes[i] as any).attributes.getNamedItem("ref").value, 
                  0: (childNodes[i + 1] as any).attributes.getNamedItem("ref").value
                }));
              }
            }
          }
        }
      }
    }
    return Array.from(nodePairsToModify.values()).map((txt: any) => JSON.parse(txt)).map((val) => {return {start: val[0], end: val[1]}});
  }
}

export default HallwayWaypointConverter;