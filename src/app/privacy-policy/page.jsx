import React from "react";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "controller", label: "Data Controller Information" },
  { id: "categories", label: "Categories of Personal Data We Collect" },
  { id: "collection", label: "How We Collect Data" },
  { id: "legal-basis", label: "Legal Basis for Processing" },
  { id: "use", label: "How We Use Personal Data" },
  { id: "sharing", label: "Sharing and Disclosure" },
  { id: "security", label: "Data Security" },
  { id: "transfers", label: "International Data Transfers" },
  { id: "retention", label: "Data Retention" },
  { id: "rights", label: "User Rights" },
  { id: "children", label: "Children’s Data" },
  { id: "automated", label: "Automated Decision-Making" },
  { id: "changes", label: "Changes to this Privacy Policy" },
];

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <div className="mt-3 space-y-3 text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

const page = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            CERVANNA CARE – PRIVACY POLICY
          </h1>

          {/* <p className="mt-2 text-gray-600">
            <span className="font-medium">Last Updated:</span> {LAST_UPDATED}
          </p> */}

          <p className="mt-4 text-gray-700">
            Cervanna Care (“Cervanna”, “we”, “us”, or “our”) is committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, process, use, disclose, and store your personal data when
            you use our website, mobile application, and related services
            (collectively, the “Platform”).
          </p>

          <p className="mt-2 text-gray-700">
            By accessing or using the Platform, you consent to the practices
            described in this Privacy Policy.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        {/* TOC */}
        <aside className="lg:sticky lg:top-6 h-fit border rounded-xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900">On this page</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-gray-700 hover:text-gray-900 hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div className="space-y-10">
          <Section id="controller" title="Data Controller Information">
            <p>
              Cervanna is the Data Controller for all personal data collected
              through the Platform unless otherwise indicated.
            </p>
          </Section>

          <Section
            id="categories"
            title="Categories of Personal Data We Collect"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Identification Data
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>ID or passport number</li>
              <li>Date of birth</li>
              <li>Gender</li>
              <li>Nationality</li>
              <li>
                Professional licenses and certificates (for nurses,
                physiotherapists, or caregivers)
              </li>
              <li>Police clearance or other vetting documents</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Contact Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Phone number</li>
              <li>Email address</li>
              <li>Physical address</li>
              <li>Emergency contacts</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Employment & Skills Data
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Work experience</li>
              <li>Education history</li>
              <li>Skills, competencies, and references</li>
              <li>Ratings and reviews (submitted on the Platform)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Medical-Related Data
            </h3>
            <p>Collected only where relevant and with consent:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Health permits and certifications</li>
              <li>Vaccination or professional training records</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Platform Usage Data
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account login information</li>
              <li>Device and browser details</li>
              <li>IP address</li>
              <li>Interaction logs, searches, and communications</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Payment Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Subscription payments (domestic workers, agencies)</li>
              <li>
                Commission-related payments (nurses, physiotherapists,
                institutions)
              </li>
              <li>Mobile money or bank account details</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Location Data
            </h3>
            <p>If location services are enabled for matching purposes.</p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Sensitive Personal Data
            </h3>
            <p>
              Only collected with explicit consent (health, biometric, or legal
              clearance data).
            </p>
          </Section>

          <Section id="collection" title="How We Collect Data">
            <ul className="list-disc pl-6 space-y-2">
              <li>Direct submission during registration or updates</li>
              <li>Automatic tracking (cookies, analytics, device metadata)</li>
              <li>
                Third-party service providers (software, payment processing,
                verification tools)
              </li>
              <li>Feedback, ratings, and reviews</li>
              <li>Consent-based verification or background checks</li>
            </ul>
          </Section>

          <Section
            id="legal-basis"
            title="Legal Basis for Processing Personal Data"
          >
            <p>Cervanna processes data based on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Performance of a contract (subscriptions, services)</li>
              <li>Compliance with legal obligations</li>
              <li>Consent from client</li>
              <li>
                Legitimate interests (fraud prevention, analytics, service
                improvement)
              </li>
              <li>Public interest (for regulated professions)</li>
            </ul>
          </Section>

          <Section id="use" title="How We Use Personal Data">
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manage accounts and subscriptions</li>
              <li>Verify identity, certifications, and qualifications</li>
              <li>Match Clients and Service Providers</li>
              <li>Facilitate communications and transactions</li>
              <li>Process subscription payments and commissions</li>
              <li>Improve platform functionality and security</li>
              <li>Conduct analytics and reporting</li>
              <li>Provide customer support</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Send notifications and updates</li>
            </ul>
            <p className="font-medium text-gray-900">
              We do not sell personal data.
            </p>
          </Section>

          <Section id="sharing" title="Sharing and Disclosure of Personal Data">
            <p>We may share data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Clients and Service Providers</strong> – relevant data
                for matching and engagement
              </li>
              <li>
                <strong>Third-Party Software Providers</strong> – hosting,
                analytics, payment processing, communications, verification
              </li>
              <li>
                <strong>Regulators or Law Enforcement</strong> – as required by
                Kenyan law
              </li>
              <li>
                <strong>Professional Bodies / Medical Councils</strong> – for
                verification and compliance
              </li>
              <li>
                <strong>Business Transfers</strong> – mergers, acquisitions, or
                restructuring
              </li>
            </ul>
            <p>
              All third-party partners are required to comply with equivalent
              data protection standards.
            </p>
          </Section>

          <Section id="security" title="Data Security">
            <p>
              We take the security of your personal data seriously and have
              implemented multiple safeguards, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Encrypted storage and secure servers to protect data from
                unauthorized access
              </li>
              <li>
                Access controls and authentication to ensure only authorized
                personnel can access sensitive information
              </li>
              <li>
                Regular security audits to identify and address vulnerabilities
              </li>
              <li>
                Staff confidentiality agreements to prevent unauthorized
                disclosure
              </li>
            </ul>
            <p>
              While we implement strong measures, no system can be guaranteed to
              be completely secure. client are encouraged to protect their own
              devices, accounts, and login credentials.
            </p>
          </Section>

          <Section id="transfers" title="International Data Transfers">
            <p>
              Some third-party service providers that support the Cervanna Care
              Platform may store or process personal data outside Kenya.
            </p>
            <p>Where such transfers occur, Cervanna ensures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Appropriate safeguards consistent with the Kenya Data Protection
                Act (2019)
              </li>
              <li>Data is processed only for Cervanna’s agreed purposes</li>
              <li>
                Providers are contractually obligated to maintain
                confidentiality and security of personal data
              </li>
            </ul>
            <p>
              By using the Platform, you consent to the transfer of personal
              data to countries outside Kenya for these purposes.
            </p>
          </Section>

          <Section id="retention" title="Data Retention">
            <p>
              Cervanna Care retains personal data only for as long as necessary
              to achieve the purposes for which it was collected, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provision of services through the Platform</li>
              <li>
                Compliance with legal, regulatory, or contractual obligations
              </li>
              <li>Resolution of disputes or claims</li>
              <li>Enforcement of agreements</li>
            </ul>
            <p>
              Once personal data is no longer required, it may be deleted or
              securely anonymized for analytics or research.
            </p>
            <p>
              Retention periods may vary depending on the type of data, legal
              requirements, or business needs.
            </p>
          </Section>

          <Section id="rights" title="User Rights">
            <p>
              client have the following rights regarding their personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> request and obtain copies of data we
                hold
              </li>
              <li>
                <strong>Correction:</strong> correct inaccurate or incomplete
                info
              </li>
              <li>
                <strong>Withdrawal of Consent:</strong> withdraw consent where
                applicable
              </li>
              <li>
                <strong>Objection:</strong> object to processing for specific
                purposes
              </li>
              <li>
                <strong>Deletion (“Right to be Forgotten”):</strong> request
                deletion subject to legal obligations
              </li>
              <li>
                <strong>Data Portability:</strong> request machine-readable
                copies
              </li>
              <li>
                <strong>Complaints:</strong> lodge complaints with the Office of
                the Data Protection Commissioner (ODPC)
              </li>
            </ul>

            <div className="mt-4 rounded-xl border bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                Contact for Data Requests or Complaints
              </p>
              <p className="mt-2">
                <span className="font-medium">Email:</span> ___________________
              </p>
            </div>
          </Section>

          <Section id="children" title="Children’s Data">
            <p>
              The Cervanna Care Platform is not intended for persons under the
              age of 18.
            </p>
            <p>
              We do not knowingly collect, use, or process personal data of
              minors without explicit consent of a parent or legal guardian.
            </p>
            <p>
              If we become aware that we have inadvertently collected data from
              a minor without consent, we will take steps to delete such data
              promptly.
            </p>
          </Section>

          <Section id="automated" title="Automated Decision-Making">
            <p>
              Some features may use automated systems to assist with matching,
              recommendations, or other platform functions.
            </p>
            <p>client have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Request a human review of any automated decision affecting them
              </li>
              <li>Receive an explanation of the logic and criteria used</li>
              <li>
                Request reconsideration if an outcome is incorrect or unfair
              </li>
            </ul>
          </Section>

          <Section id="changes" title="Changes to the Privacy Policy">
            <p>
              Cervanna Care may update this Privacy Policy from time to time.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Notification:</strong> material changes will be
                communicated via the Platform
              </li>
              <li>
                <strong>Acceptance:</strong> continued use after updates
                constitutes acceptance of the revised policy
              </li>
            </ul>
          </Section>

          {/* Footer */}
          <div className="pt-8 border-t text-sm text-gray-600">
            <p>
              If you have questions about this Privacy Policy, contact Cervanna
              Care using the details above or through the Platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
