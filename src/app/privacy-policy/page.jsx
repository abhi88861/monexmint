export const metadata = {
  title: "Privacy Policy | MonexMint",
  description:
    "Read the Privacy Policy of MonexMint. Learn how we collect, use, and protect your information while using our financial calculators.",
  keywords:
    "MonexMint privacy policy, financial calculator privacy, user data protection",
};

export default function PrivacyPolicy() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 20px",
        lineHeight: "1.7",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Privacy Policy</h1>

      <p>
        Last updated: {new Date().getFullYear()}
      </p>

      <p>
        Welcome to MonexMint. Your privacy is important to us. This Privacy
        Policy explains how we collect, use, disclose, and safeguard your
        information when you visit our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        MonexMint provides financial calculators that run directly in your
        browser. We do not store or collect the financial data you enter into
        calculators such as loan amounts, interest rates, salary details, or
        investment values.
      </p>

      <p>
        However, we may collect non-personal information such as:
      </p>

      <ul>
        <li>Browser type and version</li>
        <li>Device information</li>
        <li>Pages visited</li>
        <li>Time spent on pages</li>
        <li>Referring websites</li>
      </ul>

      <h2>2. Cookies and Tracking Technologies</h2>
      <p>
        We may use cookies and similar tracking technologies to improve user
        experience and analyze traffic.
      </p>

      <p>
        Third-party services such as Google AdSense or Google Analytics may
        also use cookies to serve personalized advertisements and measure
        performance.
      </p>

      <h2>3. Google AdSense</h2>
      <p>
        We may use Google AdSense to display advertisements. Google uses
        cookies to serve ads based on your prior visits to this website or
        other websites.
      </p>

      <p>
        You may opt out of personalized advertising by visiting Google Ads
        Settings.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement reasonable security measures to protect your information.
        However, no method of transmission over the Internet is 100% secure.
      </p>

      <h2>5. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices or content of those sites.
      </p>

      <h2>6. Children's Privacy</h2>
      <p>
        MonexMint does not knowingly collect personal information from
        children under 13 years of age.
      </p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated revision date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, you may contact
        us at:
      </p>

      <p>
        Email: support@monexmint.com
      </p>

      <hr style={{ margin: "40px 0" }} />

      <p style={{ fontSize: "14px", color: "#666" }}>
        This Privacy Policy is provided for informational purposes only and
        does not constitute legal advice.
      </p>
    </div>
  );
}