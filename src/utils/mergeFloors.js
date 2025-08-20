// src/utils/mergeFloors.js
import floorG from "../data/nodes_floorG.json";
import floor1 from "../data/nodes_floor1.json";
import bridges from "../data/bridges.json";

export function mergeFloors() {
  const nodes = [...floorG, ...floor1];

  for (const bridge of bridges) {
    const [a, b] = bridge.between;
    const fromNode = nodes.find(n => n.nodeId === a.nodeId);
    const toNode = nodes.find(n => n.nodeId === b.nodeId);

    if (fromNode && toNode) {
      const distance = 1; // default distance
      fromNode.connections = fromNode.connections || [];
      toNode.connections = toNode.connections || [];

      fromNode.connections.push({ nodeId: toNode.nodeId, distance });
      toNode.connections.push({ nodeId: fromNode.nodeId, distance });
    }
  }

  return nodes;
}
