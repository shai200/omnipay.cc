import OnrampWidget from './components/OnrampWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">OmniPay</h1>
          <p className="text-xl text-gray-400">
            Your Gateway from Fiat to Crypto
          </p>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Buy Crypto Instantly</h2>
            <p className="text-gray-300 mb-6">
              Convert your fiat currency to cryptocurrency with ease. Powered by Stripe.
            </p>

            <OnrampWidget
              sourceAmount={100}
              destinationCurrency="eth"
              destinationNetwork="ethereum"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Fast & Secure</h3>
              <p className="text-sm text-gray-400">
                Instant transactions with bank-grade security
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold mb-2">Multiple Payment Methods</h3>
              <p className="text-sm text-gray-400">
                Credit card, debit card, and more
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-semibold mb-2">Multi-Chain Support</h3>
              <p className="text-sm text-gray-400">
                BTC, ETH, SOL, MATIC, USDC, XLM
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <div className="mb-4 space-x-4">
            <a href="/BusinessInfo" className="hover:text-gray-300 transition-colors">
              Business Info
            </a>
            <span>•</span>
            <a href="/PrivacyPolicy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/TermsOfService" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
          </div>
          <p>Powered by Stripe Crypto Onramp</p>
        </footer>
      </div>
    </div>
  );
}
