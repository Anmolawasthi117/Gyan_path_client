// src/utils/dijkstra.js
export function dijkstra(startId, endId, nodes) {
  const nodeMap = new Map(nodes.map((n) => [n.nodeId, n]));
  const distances = {};
  const prev = {};
  const visited = new Set();
  const queue = [];

  for (const n of nodes) {
    distances[n.nodeId] = Infinity;
    prev[n.nodeId] = null;
  }
  distances[startId] = 0;
  queue.push({ nodeId: startId, distance: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const { nodeId } = queue.shift();
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const curr = nodeMap.get(nodeId);
    if (!curr) continue;

    for (const conn of curr.connections || []) {
      if (!conn?.nodeId) continue;
      const neighbor = nodeMap.get(conn.nodeId);
      if (!neighbor) continue;

      const dist = Number(conn.distance);
      if (!Number.isFinite(dist)) {
        console.warn(`⚠️ Missing distance between ${curr.name} and ${neighbor.name}`);
        continue;
      }

      const alt = distances[nodeId] + dist;
      if (alt < distances[conn.nodeId]) {
        distances[conn.nodeId] = alt;
        prev[conn.nodeId] = nodeId;
        queue.push({ nodeId: conn.nodeId, distance: alt });
      }
    }
  }

  // build final path
  const path = [];
  let walker = endId;
  while (walker) {
    const node = nodeMap.get(walker);
    if (node) path.unshift(node);
    walker = prev[walker];
  }

  console.log("✅ [Single-Floor Dijkstra Result]", path.map((n) => n.name));
  return path;
}
