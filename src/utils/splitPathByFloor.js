// src/utils/splitPathByFloor.js
export function splitPathByFloor(route = []) {
  const segments = [];
  let current = null;

  for (const node of route) {
    const floor = node.coordinates?.floor;
    if (!current || current.floor !== floor) {
      current = { floor, nodes: [] };
      segments.push(current);
    }
    current.nodes.push(node);
  }

  return segments;
}
