export const metadata = {
  title: "Terms of Use | MonexMint",
  description:
    "Read the Terms of Use for MonexMint financial calculators platform. Understand your rights and responsibilities while using our website.",
  keywords:
    "MonexMint terms of use, website terms and conditions, financial calculator terms",
};

export default function TermsOfUse() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 20px",
        lineHeight: "1.7",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Terms of Use</h1>

      <p>Last updated: {new Date().getFullYear()}</p>

      <p>
        Welcome to MonexMint. By accessing or using our website, you agree to
        be bound by these Terms of Use. If you do not agree with any part of
        these terms, please do not use our website.
      </p>

      <h2>1. Use of Website</h2>
      <p>
        MonexMint provides free financial calculators and educational content
        for informational purposes only. You agree to use the website in a
        lawful manner and not for any fraudulent or harmful activities.
      </p>

      <h2>2. No Financial Advice</h2>
      <p>
        The information and calculations provided on this website are for
        informational and educational purposes only.
      </p>

      <p>
        MonexMint does not provide financial, investment, legal, or tax
        advice. Users should consult certified professionals before making
        financial decisions.
      </p>

      <h2>3. Accuracy of Information</h2>
      <p>
        While we strive to ensure that all calculations and information are
        accurate, we do not guarantee completeness, reliability, or accuracy.
      </p>

      <p>
        Financial institution policies, interest rates, tax rules, and
        regulations may vary and change over time.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on this website, including text, graphics, logos, design,
        and code, is the property of MonexMint unless otherwise stated.
      </p>

      <p>
        You may not reproduce, distribute, or use our content without prior
        written permission.
      </p>

      <h2>5. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for the content, policies, or practices of those websites.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        MonexMint shall not be held liable for any direct, indirect,
        incidental, or consequential damages resulting from the use of this
        website.
      </p>

      <p>
        Users assume full responsibility for financial decisions made based on
        calculator outputs.
      </p>

      <h2>7. Modifications to Terms</h2>
      <p>
        We reserve the right to update or modify these Terms of Use at any
        time without prior notice. Continued use of the website constitutes
        acceptance of updated terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms shall be governed by and interpreted in accordance with
        applicable laws.
      </p>

      <h2>9. Contact Information</h2>
      <p>
        If you have any questions about these Terms of Use, you may contact
        us at:
      </p>

      <p>Email: support@monexmint.com</p>

      <hr style={{ margin: "40px 0" }} />

      <p style={{ fontSize: "14px", color: "#666" }}>
        These Terms of Use are provided for informational purposes only and do
        not constitute legal advice.
      </p>
    </div>
  );
}