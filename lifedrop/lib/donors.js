import donorsData from "@/data/donors.json";

export const donors = donorsData;

export function addDonor(donor) {
  const newDonor = {
    id: `donor-${Date.now()}`,
    ...donor,
    available: true,
    createdAt: new Date().toISOString(),
  };
  donors.push(newDonor);
  return newDonor;
}
