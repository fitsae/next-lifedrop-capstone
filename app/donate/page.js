import DonorForm from "@/components/DonorForm";

export const metadata = {
  title: "Become a Donor",
  description:
    "Register as a blood donor in Ethiopia. Add your blood type and city to be matched with requests near you.",
  alternates: { canonical: "/donate" },
};

export default function DonatePage() {
  return (
    <div>
      <h1>Become a Donor</h1>
      <p className="text-muted mb-6">
        Your one donation can save up to three lives. Register once and we’ll
        match you with requests in your area.
      </p>
      <DonorForm />
    </div>
  );
}
