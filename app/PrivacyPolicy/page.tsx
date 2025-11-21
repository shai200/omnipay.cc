export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: October 8, 2025</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-6">
          <p>
            OmniPay.cc ("we," "us," or "our") respects your privacy and is committed to protecting your
            personal information. This Privacy Policy explains how we collect, use, and share information
            when you access or use our website, services, or payment processing features powered by
            Stripe's Crypto Onramp.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you use OmniPay.cc to purchase cryptocurrency through Stripe's Crypto Onramp, we may
            collect the following types of information:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">a. Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Identification Information:</strong> Your name, email address, and country of residence.</li>
            <li><strong>Payment Information:</strong> Payment method details entered through Stripe's Crypto Onramp.</li>
            <li><strong>Verification Data:</strong> Identity documents or verification data required by Stripe to comply with applicable financial regulations (KYC/AML).</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">b. Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage Data:</strong> Information about how you use our website, including IP address, browser type, and device information.</li>
            <li><strong>Cookies:</strong> We may use cookies to improve website functionality and user experience. You can control cookie preferences through your browser settings.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facilitate cryptocurrency purchases through Stripe's Crypto Onramp.</li>
            <li>Provide customer support and respond to your inquiries.</li>
            <li>Comply with legal and regulatory requirements (including anti-money laundering (AML) and know-your-customer (KYC) laws).</li>
            <li>Improve the performance and security of our services.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Use of Stripe's Crypto Onramp</h2>
          <p>
            All cryptocurrency transactions on OmniPay.cc are processed by Stripe, Inc. through its Crypto
            Onramp service. When you make a purchase, your information is shared directly with Stripe,
            which processes and secures your payment according to its own Privacy Policy and Crypto Onramp
            Terms.
          </p>
          <p>
            We do not store or have access to your full payment details, identity documents, or financial
            account information submitted to Stripe.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> Such as Stripe, for transaction processing and compliance.</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or regulatory request.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your information may be transferred as part of the transaction.</li>
          </ul>
          <p>We do not sell or rent your personal information.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We retain only the information necessary to comply with applicable laws and fulfill our service
            obligations. Stripe may retain transaction data and verification information according to
            financial compliance regulations.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical measures to protect your data.
            However, no method of transmission or storage is 100% secure. Use our services at your own
            discretion.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access or correct your personal information.</li>
            <li>Request deletion of your data (subject to legal and regulatory obligations).</li>
            <li>Withdraw consent for data processing.</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </ul>
          <p>To exercise these rights, contact us at privacy@omnipay.cc.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
          <p>
            Our services are intended for adults aged 18 and above. We do not knowingly collect personal
            information from minors. If we become aware that a minor has provided personal information, we
            will take steps to delete it.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The latest version will always be posted
            on this page with the "Last Updated" date revised accordingly.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
          <p>For any questions about this Privacy Policy or our practices, please contact us at:</p>
          <p className="mt-4">
            <strong>OmniPay.cc</strong><br />
            <a href="mailto:privacy@omnipay.cc" className="text-blue-400 hover:text-blue-300">privacy@omnipay.cc</a><br />
            <a href="https://omnipay.cc" className="text-blue-400 hover:text-blue-300">https://omnipay.cc</a>
          </p>
        </div>
      </div>
    </div>
  );
}
