// src/utils/linkStairs.js
export function linkStairs(nodes) {
  const stairsGroups = {};

  // group stairs by name
  nodes.forEach((n) => {
    if (n.type === "stair" && n.name) {
      stairsGroups[n.name] = stairsGroups[n.name] || [];
      stairsGroups[n.name].push(n);

      // 🟢 make sure connections exists
      if (!Array.isArray(n.connections)) n.connections = [];
    }
  });

  // add cross-floor links
  Object.values(stairsGroups).forEach((group) => {
    if (group.length > 1) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const a = group[i];
          const b = group[j];

          // 🟢 only add if missing
          if (!a.connections.find((c) => c.nodeId === b.nodeId)) {
            a.connections.push({ nodeId: b.nodeId, distance: 1 });
          }
          if (!b.connections.find((c) => c.nodeId === a.nodeId)) {
            b.connections.push({ nodeId: a.nodeId, distance: 1 });
          }
        }
      }
    }
  });

  console.log("🟡 Linked stairs groups:", stairsGroups);
  return nodes;
}
