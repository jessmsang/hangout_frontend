//Normalize input groupSize into a consistent object.
//Accepts either a number or an object with min/max.

export function normalizeGroupSize(input) {
  if (typeof input === "number") {
    return { min: input, max: input };
  }

  if (
    typeof input === "object" &&
    typeof input.min === "number" &&
    typeof input.max === "number"
  ) {
    return input;
  }

  throw new Error("Invalid groupSize input. Must be a number or { min, max }.");
}

//Check if a size is valid for the normalized group size.

export function isValidGroupSize(size, groupSize) {
  const normalized = normalizeGroupSize(groupSize);
  return size >= normalized.min && size <= normalized.max;
}

//Format group size for display (e.g. "2 people", "2–4 people").

export function displayGroupSize(groupSize) {
  const normalized = normalizeGroupSize(groupSize);
  if (normalized.min === normalized.max) {
    return `${normalized.min} person${normalized.min > 1 ? "s" : ""}`;
  } else {
    return `${normalized.min}–${normalized.max} people`;
  }
}
