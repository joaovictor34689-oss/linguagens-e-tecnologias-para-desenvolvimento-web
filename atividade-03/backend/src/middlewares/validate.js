export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validEmail(value) {
  return typeof value === "string"
    && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
