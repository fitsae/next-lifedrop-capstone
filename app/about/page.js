export const metadata = {
  title: "About",
  description:
    "LifeDrop connects blood requests with willing donors across Ethiopia. Learn how it works and how we protect your privacy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="card">
      <h1>About LifeDrop</h1>
      <p>
        LifeDrop is a lightweight web application that connects hospitals and
        patients who need blood with willing donors across Ethiopia.
      </p>

      <h2>How it works</h2>
      <ol>
        <li>Hospitals post requests with blood type, city, and urgency.</li>
        <li>Donors search requests or register to be matched.</li>
        <li>Contact details are shown only for open requests.</li>
      </ol>

      <h2>Privacy</h2>
      <p>
        We use <strong>mock data only</strong> in this demonstration. No real
        personal information is collected. A production version would require
        verified hospitals, encrypted contact channels, and consent flows.
      </p>
    </article>
  );
}
