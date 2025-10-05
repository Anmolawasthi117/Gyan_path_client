// src/utils/multiFloorRoute.js
// import { calculateDistance } from "./distance";

/**
 * Multi-floor Dijkstra with global + local connections.
 * @param {Object} project - full project schema (with floors + global connections)
 * @param {string} startId
 * @param {string} endId
 */
export function findMultiFloorPath(project, startId, endId) {
  const { floors = [], connections: globalConnections = [] } = project;

  // flatten all floor nodes
  const nodes = floors.flatMap((f) =>
    f.nodes.map((n) => ({ ...n, floorId: f.id }))
  );
  const nodeMap = new Map(nodes.map((n) => [n.nodeId, n]));

  const start = nodeMap.get(startId);
  const end = nodeMap.get(endId);
  if (!start || !end) {
    console.warn("⚠️ [MultiFloorRoute] Start or end node not found");
    return [];
  }

  console.log("🧮 [Dijkstra Input]", { start: start.name, end: end.name });

  // build adjacency map
  const graph = new Map();

  for (const node of nodes) {
    const adj = [];

    // local (same floor) connections
    for (const conn of node.connections || []) {
      if (nodeMap.has(conn.nodeId)) {
        adj.push({ nodeId: conn.nodeId, distance: conn.distance });
      }
    }

    graph.set(node.nodeId, adj);
  }

  // add global (inter-floor) connections
  for (const conn of globalConnections) {
    const { from, to, distance } = conn;
    if (nodeMap.has(from) && nodeMap.has(to)) {
      graph.get(from)?.push({ nodeId: to, distance });
      graph.get(to)?.push({ nodeId: from, distance });
    }
  }

  console.log(
    `🌍 [Graph Built] ${nodes.length} nodes, ${
      globalConnections.length
    } inter-floor links`
  );

  // run Dijkstra
  const path = runDijkstra(graph, startId, endId, nodeMap);
  if (!path.length) {
    console.warn("⚠️ [MultiFloorRoute] No path found");
    return [];
  }

  console.log(
    "✅ [Best Multi-Floor Route]",
    path.map((n) => `${n.name} (${n.coordinates.floor})`)
  );

  return path;
}

function runDijkstra(graph, startId, endId, nodeMap) {
  const distances = {};
  const prev = {};
  const visited = new Set();

  for (const nodeId of graph.keys()) {
    distances[nodeId] = Infinity;
    prev[nodeId] = null;
  }

  distances[startId] = 0;

  while (true) {
    // pick node with smallest unvisited distance
    let curr = null;
    let bestDist = Infinity;
    for (const [id, dist] of Object.entries(distances)) {
      if (!visited.has(id) && dist < bestDist) {
        bestDist = dist;
        curr = id;
      }
    }
    if (curr === null) break;
    if (curr === endId) break;

    visited.add(curr);

    const neighbors = graph.get(curr) || [];
    for (const { nodeId: nb, distance } of neighbors) {
      const alt = distances[curr] + distance;
      if (alt < distances[nb]) {
        distances[nb] = alt;
        prev[nb] = curr;
      }
    }
  }

  // build final path
  const path = [];
  let curr = endId;
  while (curr) {
    const node = nodeMap.get(curr);
    if (node) path.unshift(node);
    curr = prev[curr];
  }

  return path;
}
