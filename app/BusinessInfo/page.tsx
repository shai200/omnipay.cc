import type { Metadata } from 'next';
import { LegalPage } from '../components/LegalPage';

export const metadata: Metadata = { title: 'Business Information' };

// Wording on this page is legal copy and must not be edited. Only layout
// and class names differ from the previous version.
export default function BusinessInfo() {
  return (
    <LegalPage title="Business Information" subtitle="Everything you need to know about OmniPay.cc">
      <h2>Business Name</h2>
      <p className="legal-emphasis">OmniPay.cc</p>
      <p className="legal-note">Registered business name matching our Stripe account</p>

      <h2>Business Description</h2>
      <p>
        OmniPay.cc is a cryptocurrency onramp service that helps customers in supported countries
        easily purchase cryptocurrency using Stripe's Crypto Onramp technology. We provide a simple,
        secure, and compliant platform for individuals to convert their fiat currency into popular
        cryptocurrencies like Bitcoin, Ethereum, and more.
      </p>
      <p>
        By leveraging Stripe's trusted payment infrastructure and regulatory compliance framework, we
        make crypto accessible to everyone while maintaining the highest standards of security and user
        protection across the Americas, Europe, and Asia Pacific regions.
      </p>

      <h2>Products & Services Offered</h2>

      <h3>Cryptocurrency Purchase Service</h3>
      <p>
        Users can purchase cryptocurrency directly using their credit or debit cards through Stripe's
        secure payment processing system. We support multiple cryptocurrencies including:
      </p>
      <ul>
        <li>Bitcoin (BTC)</li>
        <li>Ethereum (ETH)</li>
        <li>USD Coin (USDC)</li>
        <li>Stellar (XLM)</li>
        <li>Solana (SOL)</li>
        <li>Polygon (MATIC)</li>
      </ul>

      <h3>Key Features</h3>
      <ul>
        <li>Instant cryptocurrency purchases with credit/debit cards</li>
        <li>Real-time pricing and exchange rates</li>
        <li>Secure wallet address delivery</li>
        <li>Transaction history and tracking</li>
        <li>KYC/AML compliant verification (handled by Stripe)</li>
      </ul>

      <h2>Customer Service Contact</h2>
      <p>
        Our customer support team is here to help with any questions or concerns about your crypto
        purchases.
      </p>

      <h3>Email Support</h3>
      <p>
        <a href="mailto:support@omnipay.cc">
          support@omnipay.cc
        </a>
      </p>

      <h3>Website</h3>
      <p>
        <a href="https://omnipay.cc">
          https://omnipay.cc
        </a>
      </p>

      <p className="legal-note">
        We typically respond to inquiries within 24-48 hours during business days.
      </p>

      <h2>Refund & Dispute Policy</h2>
      <div className="callout callout-warning">
        <p>
          All cryptocurrency purchases are final and non-refundable once blockchain settlement occurs.
        </p>
      </div>
      <p>
        Due to the irreversible nature of blockchain transactions, cryptocurrency purchases cannot be
        refunded or reversed once the crypto has been delivered to your wallet address and confirmed on
        the blockchain.
      </p>

      <h3>Before completing a purchase, please ensure:</h3>
      <ul>
        <li>Your wallet address is correct and compatible with the cryptocurrency you're purchasing</li>
        <li>You understand the amount of cryptocurrency you will receive</li>
        <li>You accept the current exchange rate and transaction fees</li>
        <li>You have reviewed all transaction details before confirming</li>
      </ul>

      <p>
        <strong>Disputes:</strong> If you believe there was an error in your transaction (incorrect
        amount delivered, technical failure, etc.), please contact our support team at{' '}
        <a href="mailto:support@omnipay.cc">
          support@omnipay.cc
        </a>{' '}
        immediately with your transaction ID and details. We will investigate valid claims, but cannot
        guarantee recovery of funds once they are sent on-chain.
      </p>

      <h2>Cancellation Policy</h2>
      <div className="callout callout-warning">
        <p>
          Cryptocurrency purchases cannot be canceled once processed.
        </p>
      </div>
      <p>
        OmniPay.cc does not offer subscriptions or recurring billing. All transactions are one-time
        purchases of cryptocurrency.
      </p>
      <p>
        Once you confirm a purchase and Stripe processes your payment, the transaction is immediately
        executed on the blockchain. Cancellation is not possible after this point due to the
        irreversible nature of cryptocurrency transactions.
      </p>
      <p>
        Please review all details carefully before confirming your purchase. If you have any questions
        before completing a transaction, contact us at{' '}
        <a href="mailto:support@omnipay.cc">
          support@omnipay.cc
        </a>.
      </p>

      <h2>Legal & Geographic Restrictions</h2>

      <h3>Supported Jurisdictions</h3>
      <p>OmniPay.cc services are available in the following regions:</p>

      <div className="region-grid">
        <div>
          <h4>🌎 Americas</h4>
          <ul>
            <li>United States</li>
          </ul>
        </div>

        <div>
          <h4>🌍 Europe</h4>
          <ul>
            <li>European Union (all member states)</li>
            <li>United Kingdom</li>
            <li>Norway</li>
            <li>Switzerland</li>
          </ul>
        </div>

        <div>
          <h4>🌏 Asia Pacific</h4>
          <ul>
            <li>Australia</li>
            <li>Singapore</li>
            <li>New Zealand</li>
          </ul>
        </div>
      </div>

      <p>By using OmniPay.cc, you represent and warrant that:</p>
      <ul>
        <li>You are a resident of one of the supported jurisdictions listed above</li>
        <li>You are at least 18 years old (or the age of legal majority in your jurisdiction)</li>
        <li>Your use complies with all applicable federal, state, and local laws</li>
        <li>You are not located in any jurisdiction where cryptocurrency services are prohibited</li>
      </ul>

      <h3>Compliance with Stripe's Crypto Onramp Terms</h3>
      <div className="callout">
        <p>
          Important: OmniPay.cc uses Stripe's regulated Crypto Onramp to process payments.
        </p>
      </div>
      <p>
        By purchasing cryptocurrency through OmniPay.cc, you also agree to comply with the Stripe Crypto
        Onramp Merchant Terms of Service and Stripe Restricted Businesses Policy.
      </p>

      <h3>Prohibited Jurisdictions</h3>
      <div className="callout callout-danger">
        <p>
          OmniPay.cc services are strictly prohibited in the following regions:
        </p>
      </div>
      <ul>
        <li>Cuba</li>
        <li>Iran</li>
        <li>North Korea</li>
        <li>Syria</li>
        <li>Crimea region of Ukraine</li>
        <li>Donetsk region of Ukraine</li>
        <li>Luhansk region of Ukraine</li>
      </ul>
      <p>
        OmniPay.cc does not permit use of its services in or by individuals or entities located in any
        jurisdiction prohibited by Stripe or applicable U.S. law, including those listed above.
      </p>

      <h3>Compliance Requirements</h3>
      <p>OmniPay.cc complies with applicable regulations in all supported jurisdictions including:</p>
      <ul>
        <li>Anti-Money Laundering (AML) regulations</li>
        <li>Know Your Customer (KYC) requirements (enforced by Stripe)</li>
        <li>Counter-Terrorist Financing (CTF) laws</li>
        <li>Economic sanctions and embargoes</li>
        <li>Data protection regulations (GDPR, CCPA, etc.)</li>
        <li>Office of Foreign Assets Control (OFAC) requirements</li>
      </ul>

      <h3>Prohibited Use</h3>
      <p>You may not use OmniPay.cc if you are:</p>
      <ul>
        <li>Located outside the supported jurisdictions or in any prohibited region</li>
        <li>Subject to economic sanctions or designated on any prohibited party lists</li>
        <li>Engaging in illegal activities or violating applicable laws</li>
        <li>Attempting to bypass identity verification requirements</li>
        <li>Acting on behalf of sanctioned individuals or entities</li>
      </ul>

      <p className="legal-note">
        <strong>Note:</strong> We reserve the right to restrict access to our services based on
        geographic location, regulatory requirements, or at our sole discretion. Service availability
        may be expanded to additional jurisdictions in the future, subject to regulatory approval and
        compliance requirements.
      </p>
    </LegalPage>
  );
}
