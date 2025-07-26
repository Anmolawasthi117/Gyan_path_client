// Squared Euclidean distance – cheaper than sqrt
export const distanceSq = (x1, y1, x2, y2) =>
  (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
