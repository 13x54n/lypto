import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center mb-6">
            <Image
              src="/logo.png"
              alt="Zypto Logo"
              width={32}
              height={32}
              className="mr-3 h-8 w-auto"
            />
            <span className="text-2xl font-bold dark:text-white">Zypto</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: January 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using Zypto's crypto payment processing services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Zypto provides cryptocurrency payment processing services that allow businesses to accept payments in various cryptocurrencies. Our platform facilitates borderless access to global products and services through crypto payment solutions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To use our services, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and current information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Payment Processing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our payment processing services are subject to the following terms:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>All transactions are processed using blockchain technology</li>
              <li>Transaction fees may apply as disclosed in our fee schedule</li>
              <li>Settlement times may vary depending on network conditions</li>
              <li>We reserve the right to hold or freeze transactions for compliance purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Prohibited Uses
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may not use our services for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Illegal activities or transactions</li>
              <li>Money laundering or terrorist financing</li>
              <li>Fraudulent or deceptive practices</li>
              <li>Violation of any applicable laws or regulations</li>
              <li>Activities that could harm our platform or other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Compliance and KYC
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To comply with applicable laws and regulations, we may require you to provide additional information for Know Your Customer (KYC) and Anti-Money Laundering (AML) purposes. Failure to provide required information may result in account suspension or termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Fees and Charges
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our current fee schedule is available on our website. We reserve the right to modify our fees with 30 days' notice. All fees are non-refundable unless otherwise specified.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Zypto shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use our services will cease immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Email: legal@zypto.com<br />
                Address: Ming Open Web Headquarters<br />
                Website: https://zypto.com
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
