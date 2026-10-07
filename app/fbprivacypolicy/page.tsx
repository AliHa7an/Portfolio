import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Ali Hassan",
  description: "Privacy policy for alihexan.com and the Pages Posting Automation Facebook app.",
  alternates: { canonical: "/fbprivacypolicy" },
};

const EMAIL = "alihexan@gmail.com";

export default function FbPrivacyPolicy() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="7 October 2026">
      <div>
        <h2>Who we are</h2>
        <p>
          This website (alihexan.com) and the Facebook app &ldquo;Pages Posting Automation&rdquo; are run by Ali Hassan,
          a software engineer based in Pakistan. The app is a personal publishing tool: it posts content to Facebook Pages
          that Ali Hassan owns and manages.
        </p>
      </div>

      <div>
        <h2>What the app does</h2>
        <p>
          The app uses the Facebook Pages API only to publish and schedule posts, images and short videos (Reels) on Pages
          managed by Ali Hassan. It does not offer Facebook Login to the public and does not read, collect or store
          information about other Facebook users.
        </p>
      </div>

      <div>
        <h2>Information we store</h2>
        <ul>
          <li>The content of each post we publish (text, image or video) and the ID Facebook returns for it, so the same post is never published twice.</li>
          <li>Page access tokens, kept encrypted in secure secret storage and never shared or published.</li>
        </ul>
        <p>
          We do not collect personal information from people who view, like, comment on or share our posts, and we do not
          collect personal information from visitors of this website beyond standard, anonymous server logs.
        </p>
      </div>

      <div>
        <h2>How we use and share information</h2>
        <p>
          Stored information is used only to publish and schedule our own posts. We do not sell, rent or share data with
          third parties, and we do not use it for advertising.
        </p>
      </div>

      <div>
        <h2>Data retention</h2>
        <p>
          Publishing records are kept only as long as needed to avoid duplicate posts and to review what was published,
          and are removed periodically.
        </p>
      </div>

      <div id="data-deletion" className="scroll-mt-32">
        <h2>Data deletion</h2>
        <p>
          The app does not store personal data about Facebook users. If you believe we hold any information about you, or
          you want something removed, see our{" "}
          <a href="/fbdatadeletion">data deletion instructions</a> or email{" "}
          <a href={`mailto:${EMAIL}?subject=Data%20deletion%20request`}>{EMAIL}</a>. We will delete it and confirm within 30 days.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </LegalPage>
  );
}
