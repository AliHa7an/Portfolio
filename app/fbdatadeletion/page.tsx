import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Data Deletion Instructions — Ali Hassan",
  description: "How to request deletion of your data from the Pages Posting Automation Facebook app.",
  alternates: { canonical: "/fbdatadeletion" },
};

const EMAIL = "alihexan@gmail.com";

export default function FbDataDeletion() {
  return (
    <LegalPage eyebrow="Legal" title="Data Deletion Instructions" updated="7 October 2026">
      <div>
        <p>
          The Facebook app &ldquo;Pages Posting Automation&rdquo; only publishes content to Facebook Pages owned by Ali
          Hassan. It does not use Facebook Login for the public and does not store personal data about Facebook users.
          Read the full <a href="/fbprivacypolicy">privacy policy</a>.
        </p>
      </div>

      <div>
        <h2>Request deletion by email</h2>
        <ul>
          <li>
            Email <a href={`mailto:${EMAIL}?subject=Data%20deletion%20request`}>{EMAIL}</a> with the subject
            &ldquo;Data deletion request&rdquo;.
          </li>
          <li>Tell us your name and what you would like deleted (for example a Facebook profile link).</li>
          <li>We delete any matching data and confirm by email within 30 days.</li>
        </ul>
      </div>

      <div>
        <h2>Remove the app from your Facebook account</h2>
        <ul>
          <li>Open Facebook and go to <strong>Settings &amp; privacy → Settings</strong>.</li>
          <li>Open <strong>Business integrations</strong> (or <strong>Apps and websites</strong>).</li>
          <li>Find <strong>Pages Posting Automation</strong>, select it and choose <strong>Remove</strong>.</li>
        </ul>
      </div>
    </LegalPage>
  );
}
