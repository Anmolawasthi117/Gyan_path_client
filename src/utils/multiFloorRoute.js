import { dijkstra } from "./dijkstra.js";

/**
 * Multi-floor pathfinder — unified graph approach.
 * ------------------------------------------------
 * 1️⃣ Build a single graph of all floors + inter-floor connections.
 * 2️⃣ Run Dijkstra globally (so stairs & elevators are just edges).
 * 3️⃣ Extract full path and split by floor transitions.
 * 4️⃣ Optionally refine each floor segment with per-floor Dijkstra.
 */
export function findMultiFloorPath(projectSchema, startId, endId) {
  // Flatten all floor nodes
  const allNodes = projectSchema.floors.flatMap(f =>
    f.nodes.map(n => ({
      ...n,
      floorId: f.id,
    }))
  );

  // Build a universal connection list
  const allConnections = [];

  // intra-floor connections
  for (const floor of projectSchema.floors) {
    for (const node of floor.nodes) {
      for (const c of node.connections || []) {
        allConnections.push({
          from: node.nodeId,
          to: c.nodeId,
          distance: c.distance || 1,
        });
      }
    }
  }

  // inter-floor connections
  for (const c of projectSchema.connections || []) {
    allConnections.push({
      from: c.from,
      to: c.to,
      distance: c.distance || 10, // assign a small constant if vertical dist unknown
    });
  }

  // 🧭 Build node map for easier lookups
  const nodeMap = new Map(allNodes.map(n => [n.nodeId, n]));

  // Wrap Dijkstra for this unified graph
  const globalDijkstra = (start, end) => {
    const neighbors = {};
    for (const { from, to, distance } of allConnections) {
      if (!neighbors[from]) neighbors[from] = [];
      neighbors[from].push({ nodeId: to, distance });
      if (!neighbors[to]) neighbors[to] = [];
      neighbors[to].push({ nodeId: from, distance });
    }

    // Local Dijkstra using the shared structure
    const dist = {};
    const prev = {};
    const visited = new Set();
    const queue = [];

    for (const n of allNodes) {
      dist[n.nodeId] = Infinity;
      prev[n.nodeId] = null;
    }
    dist[start] = 0;
    queue.push({ nodeId: start, distance: 0 });

    while (queue.length > 0) {
      queue.sort((a, b) => a.distance - b.distance);
      const { nodeId } = queue.shift();
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      for (const neighbor of neighbors[nodeId] || []) {
        const alt = dist[nodeId] + neighbor.distance;
        if (alt < dist[neighbor.nodeId]) {
          dist[neighbor.nodeId] = alt;
          prev[neighbor.nodeId] = nodeId;
          queue.push({ nodeId: neighbor.nodeId, distance: alt });
        }
      }
    }

    // reconstruct path
    const path = [];
    let walker = end;
    while (walker) {
      const node = nodeMap.get(walker);
      if (node) path.unshift(node);
      walker = prev[walker];
    }

    return path;
  };

  // Run unified Dijkstra across entire building
  const fullPath = globalDijkstra(startId, endId);
  if (!fullPath || fullPath.length === 0) {
    console.warn("❌ No valid global path found.");
    return [];
  }

  console.log("✅ [Global Multi-Floor Path]", fullPath.map(n => n.name));

  // Split path by floors
  const splitByFloor = [];
  let currentSegment = { floor: fullPath[0].floorId, nodes: [] };

  for (let i = 0; i < fullPath.length; i++) {
    const node = fullPath[i];
    if (node.floorId !== currentSegment.floor) {
      splitByFloor.push(currentSegment);
      currentSegment = { floor: node.floorId, nodes: [] };
    }
    currentSegment.nodes.push(node);
  }
  splitByFloor.push(currentSegment);

  console.log("🗺️ [Floor Segments]", splitByFloor.map(s => s.floor));

  // optional refinement: re-run single-floor Dijkstra for each floor segment
  const refinedSegments = splitByFloor.map(seg => {
    if (seg.nodes.length <= 1) return seg;
    const floorNodes = allNodes.filter(n => n.floorId === seg.floor);
    const refined = dijkstra(
      seg.nodes[0].nodeId,
      seg.nodes[seg.nodes.length - 1].nodeId,
      floorNodes
    );
    return { floor: seg.floor, nodes: refined };
  });

  // flatten refined segments for final navigation path
  const refinedPath = refinedSegments.flatMap(seg => seg.nodes);

  console.log("🏁 [Refined Multi-Floor Route]", refinedPath.map(n => n.name));

  return refinedPath;
}
