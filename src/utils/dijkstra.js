// src/utils/dijkstra.js

export function dijkstra(startId, endId, nodes) {
  const distances = {};
  const prev = {};
  const visited = new Set();
  const queue = [];

  // Map nodeId -> node
  const nodeMap = new Map(nodes.map((n) => [n.nodeId, n]));

  for (const node of nodes) {
    distances[node.nodeId] = Infinity;
    prev[node.nodeId] = null;
  }

  distances[startId] = 0;
  queue.push({ nodeId: startId, distance: 0 });

  while (queue.length > 0) {
    // Get node with min distance
    queue.sort((a, b) => a.distance - b.distance);
    const { nodeId } = queue.shift();

    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const current = nodeMap.get(nodeId);
    if (!current) continue;

    for (const conn of current.connections) {
      const alt = distances[nodeId] + conn.distance;
      if (alt < distances[conn.nodeId]) {
        distances[conn.nodeId] = alt;
        prev[conn.nodeId] = nodeId;
        queue.push({ nodeId: conn.nodeId, distance: alt });
      }
    }
  }

  // Build path
  const path = [];
  let currId = endId;
  while (currId) {
    const node = nodeMap.get(currId);
    if (node) path.unshift(node);
    currId = prev[currId];
  }

  return path;
}
