export const metadata = {
  title: "Disclaimer | MonexMint",
  description:
    "Read the official Disclaimer of MonexMint financial calculators platform. Understand limitations of liability and usage terms.",
  keywords:
    "MonexMint disclaimer, financial calculator disclaimer, no financial advice statement",
};

export default function Disclaimer() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 20px",
        lineHeight: "1.7",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Disclaimer</h1>

      <p>Last updated: {new Date().getFullYear()}</p>

      <p>
        The information provided by MonexMint on this website is for general
        informational and educational purposes only.
      </p>

      <h2>1. No Financial Advice</h2>
      <p>
        All financial calculators, tools, and content available on this
        website are intended solely for informational purposes.
      </p>

      <p>
        MonexMint does not provide financial, investment, tax, legal, or
        accounting advice. Users are strongly encouraged to consult with
        certified professionals before making any financial decisions.
      </p>

      <h2>2. Accuracy of Calculations</h2>
      <p>
        While we strive to ensure that all calculations are accurate and
        up-to-date, we do not guarantee their completeness, reliability, or
        accuracy.
      </p>

      <p>
        Financial results may vary depending on actual bank policies,
        government regulations, tax laws, interest rate changes, and
        individual circumstances.
      </p>

      <h2>3. External Links Disclaimer</h2>
      <p>
        This website may contain links to external websites that are not
        provided or maintained by MonexMint.
      </p>

      <p>
        We do not guarantee the accuracy, relevance, or completeness of any
        information on third-party websites.
      </p>

      <h2>4. Advertisement Disclaimer</h2>
      <p>
        MonexMint may display advertisements through third-party services
        such as Google AdSense.
      </p>

      <p>
        Advertisements do not constitute endorsement or recommendation of any
        financial products or services.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        Under no circumstances shall MonexMint be liable for any loss or
        damage, including without limitation indirect or consequential loss,
        arising out of or in connection with the use of this website.
      </p>

      <p>
        Users assume full responsibility for any decisions made based on
        information provided on this platform.
      </p>

      <h2>6. Use at Your Own Risk</h2>
      <p>
        All information on this website is provided “as is,” with no
        guarantees of completeness, accuracy, usefulness, or timeliness.
      </p>

      <h2>7. Changes to This Disclaimer</h2>
      <p>
        We reserve the right to update or modify this Disclaimer at any time
        without prior notice. Continued use of the website signifies
        acceptance of updated terms.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions regarding this Disclaimer, you may contact
        us at:
      </p>

      <p>Email: support@monexmint.com</p>

      <hr style={{ margin: "40px 0" }} />

      <p style={{ fontSize: "14px", color: "#666" }}>
        This Disclaimer is provided for informational purposes only and does
        not constitute legal advice.
      </p>
    </div>
  );
}