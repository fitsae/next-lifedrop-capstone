import requestsData from "@/data/requests.json";

export const requests = requestsData;

export function searchRequests({ bloodType, city, urgency } = {}) {
  let result = [...requests];
  if (bloodType) result = result.filter((r) => r.bloodType === bloodType);
  if (city)
    result = result.filter((r) => r.city.toLowerCase() === city.toLowerCase());
  if (urgency) result = result.filter((r) => r.urgency === urgency);
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function findRequest(id) {
  return requests.find((r) => r.id === id) ?? null;
}

export function getRequestsByOwner(ownerId) {
  return requests.filter((r) => r.ownerId === ownerId);
}

export function getCities() {
  return [...new Set(requests.map((r) => r.city))].sort();
}
