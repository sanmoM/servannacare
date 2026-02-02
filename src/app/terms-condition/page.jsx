import React from "react";

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
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "definitions", label: "Definitions" },
    { id: "nature", label: "Nature of the Platform" },
    { id: "eligibility", label: "Eligibility" },
    { id: "accounts", label: "User Accounts" },
    { id: "clients", label: "Responsibilities of Clients" },
    { id: "providers", label: "Responsibilities of Service Providers" },
    { id: "cervanna", label: "Cervanna Care’s Responsibilities" },
    { id: "third-party", label: "Third-Party Software & IP" },
    { id: "payments", label: "Payments, Subscription Fees & Commissions" },
    { id: "verification", label: "Verification & Background Checks" },
    { id: "reviews", label: "Ratings and Reviews" },
    { id: "prohibited", label: "Prohibited Activities" },
    { id: "liability", label: "Liability and Indemnity" },
    { id: "termination", label: "Termination" },
    { id: "data", label: "Data Protection" },
    { id: "ip", label: "Intellectual Property" },
    { id: "law", label: "Governing Law & Dispute Resolution" },
    { id: "amendments", label: "Amendments" },
  ];
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            CERVANNA CARE – TERMS & CONDITIONS
          </h1>
          <p className="mt-4 text-gray-700">
            Welcome to Cervanna Care (“Cervanna”, “we”, “us”, or “our”). These
            Terms and Conditions (“Terms”) govern your access to and use of the
            Cervanna platform, website, mobile application, and related services
            (collectively, the “Platform”).
          </p>
          <p className="mt-2 text-gray-700">
            By accessing, registering, or using the Platform, you agree to be
            bound by these Terms. If you do not agree, you must discontinue use
            of the Platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        {/* Table of contents */}
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

        {/* Terms body */}
        <div className="space-y-10">
          <Section id="definitions" title="Definitions">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Client</strong> – any individual, family, company,
                medical institution or other organization, bureau, agency that
                seeks to hire or engage Service Providers via the Platform.
              </li>
              <li>
                <strong>Service Provider</strong> – domestic workers, domestic
                worker agencies, nurses, nurse aides, physiotherapists, medical
                caregivers including special needs caregivers or any other
                caregiver or personnel registered on the Platform as such.
              </li>
              <li>
                <strong>Services</strong> – the matching, facilitation,
                communication, and administrative functionalities provided by
                Cervanna.
              </li>
              <li>
                <strong>Platform</strong> – our website, application, digital
                interfaces, and all associated features.
              </li>
              <li>
                <strong>Third-Party Providers</strong> – external companies
                providing software, hosting, analytics, communication tools, or
                other systems used by Cervanna. These providers own their
                respective intellectual property.
              </li>
            </ul>
          </Section>

          <Section id="nature" title="Nature of the Platform">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cervanna Care operates as a digital facilitator that connects
                Clients with Service Providers.
              </li>
              <li>
                Cervanna does not employ, supervise, manage, or control the
                Service Providers.
              </li>
              <li>
                Any service relationship, contract, or agreement formed between
                a Client and a Service Provider is independent of Cervanna.
              </li>
              <li>
                Cervanna does not guarantee the availability, performance,
                suitability, or conduct of any Service Provider.
              </li>
            </ul>
          </Section>

          <Section id="eligibility" title="Eligibility">
            <p>To use the Platform, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>be at least 18 years old;</li>
              <li>provide accurate and truthful registration information;</li>
              <li>
                comply with applicable Kenyan laws including the Data Protection
                Act (2019), Employment Act (2007), Labour Relations Act, and
                health-sector regulations (where applicable).
              </li>
            </ul>
          </Section>

          <Section id="accounts" title="User Accounts">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                client must maintain the confidentiality of their login
                credentials.
              </li>
              <li>
                All activities under an account are the responsibility of that
                account holder.
              </li>
              <li>
                Cervanna may suspend or terminate accounts suspected of fraud,
                misuse, or breach of these Terms.
              </li>
            </ul>
          </Section>

          <Section id="clients" title="Responsibilities of Clients">
            <p>Clients agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                provide accurate job details, working conditions, and
                expectations;
              </li>
              <li>
                comply with labour, employment, OH&amp;S, and sector-specific
                laws;
              </li>
              <li>provide a safe environment for Service Providers;</li>
              <li>conduct interviews and due diligence before engagement;</li>
              <li>
                pay Service Providers promptly and comply with statutory
                obligations (where applicable);
              </li>
              <li>not request illegal, hazardous, or unethical services.</li>
            </ul>
            <p className="text-gray-700">
              Cervanna is not responsible for disputes arising from a Client’s
              failure to meet these obligations.
            </p>
          </Section>

          <Section id="providers" title="Responsibilities of Service Providers">
            <p>Service Providers agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                provide accurate information, documents, and qualifications;
              </li>
              <li>
                perform their work professionally, ethically, and honestly;
              </li>
              <li>
                comply with all applicable laws and professional standards;
              </li>
              <li>maintain confidentiality and respect property of Clients;</li>
              <li>not engage in illegal, harmful, or unethical conduct.</li>
            </ul>
            <p>
              Cervanna may verify documents but does not guarantee full
              authenticity unless expressly stated.
            </p>
          </Section>

          <Section id="cervanna" title="Cervanna Care’s Responsibilities">
            <p>Cervanna shall:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                operate the Platform and facilitate connections between Clients
                and Service Providers;
              </li>
              <li>
                maintain reasonable uptime subject to technical limitations;
              </li>
              <li>verify identification or certifications where possible;</li>
              <li>provide customer support for Platform-related enquiries;</li>
              <li>
                process personal data in accordance with the Kenya Data
                Protection Act (2019).
              </li>
            </ul>
            <p>
              Cervanna does not supervise Service Providers, manage work, or
              guarantee outcomes.
            </p>
          </Section>

          <Section
            id="third-party"
            title="Third-Party Software and Intellectual Property"
          >
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The Platform uses software, systems, and applications sourced
                from Third-Party Providers, who retain all intellectual property
                rights.
              </li>
              <li>Cervanna does not own the underlying software IP.</li>
              <li>
                client acknowledge that interruptions or limitations may occur
                due to third-party systems.
              </li>
              <li>
                Cervanna is not liable for losses resulting from downtime,
                errors, outages, or actions by Third-Party Providers.
              </li>
            </ul>
          </Section>

          <Section
            id="payments"
            title="Payments, Subscription Fees & Commissions"
          >
            <h3 className="text-lg font-semibold text-gray-900 mt-2">
              Domestic Workers (Individual Workers)
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Domestic workers shall pay a monthly subscription fee, the
                amount of which shall be displayed on the Platform, as a
                condition for accessing and using the Platform.
              </li>
              <li>
                The subscription enables access to job opportunities, profile
                visibility, communication tools, and available Platform
                resources.
              </li>
              <li>
                Fees are payable in advance, are non-refundable, and non-payment
                may lead to account suspension.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Domestic Worker Agencies
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Agencies shall pay tiered subscription fees, depending on their
                chosen package.
              </li>
              <li>
                Each tier grants varying levels of access, visibility, and
                support.
              </li>
              <li>Fees are payable in advance and are non-refundable.</li>
              <li>
                Non-payment may result in reduced access or account suspension.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Nurses, Nurse Aides & Physiotherapists
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                These Service Providers shall be charged a 15% commission on the
                gross amount received for any engagement facilitated via the
                Platform.
              </li>
              <li>
                Cervanna may deduct the commission prior to payout or invoice
                separately.
              </li>
              <li>
                Circumvention of the Platform to avoid commissions is
                prohibited.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Medical Institutions
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Medical institutions receiving caregivers, referrals, or
                placements through Cervanna shall pay a 15% commission on fees
                paid to assigned Service Providers or revenue derived from such
                placements.
              </li>
              <li>
                Reports or confirmations may be required for reconciliation.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">Taxes</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All fees and commissions are exclusive of applicable taxes.
              </li>
              <li>
                client are responsible for PAYE, NHIF, NSSF, VAT, or any
                statutory taxes related to their engagements.
              </li>
              <li>
                Cervanna is not responsible for a Client’s or Service Provider’s
                non-compliance with tax laws.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Adjustments to Fees
            </h3>
            <p>
              Cervanna may revise fees or commissions upon notice. Continued use
              of the Platform constitutes acceptance of the updated charges.
            </p>
          </Section>

          <Section id="verification" title="Verification and Background Checks">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cervanna may conduct identity checks, certificate reviews, or
                police clearance verification where applicable.
              </li>
              <li>
                Cervanna does not guarantee the full authenticity of documents
                submitted unless explicitly stated.
              </li>
              <li>Clients must still carry out their own due diligence.</li>
            </ul>
          </Section>

          <Section id="reviews" title="Ratings and Reviews">
            <p>
              client may submit ratings and reviews provided they are truthful,
              non-defamatory, professional, and based on actual experience.
            </p>
            <p>
              Cervanna may remove reviews that violate these Terms or any Kenyan
              laws.
            </p>
          </Section>

          <Section id="prohibited" title="Prohibited Activities">
            <p>client may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>provide false or misleading information;</li>
              <li>misuse or attempt to hack the Platform;</li>
              <li>harass, exploit, or harm others;</li>
              <li>human trafficking;</li>
              <li>
                violate Kenyan employment, labour, or sector-specific laws;
              </li>
              <li>circumvent commissions or subscription fees;</li>
              <li>
                reverse-engineer or copy Platform software or third-party
                systems.
              </li>
            </ul>
          </Section>

          <Section id="liability" title="Liability and Indemnity">
            <p>
              The Platform is provided on an “as-is” and “as-available” basis.
            </p>
            <p>Cervanna is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                misconduct, negligence, or omissions of Service Providers;
              </li>
              <li>disputes between Clients and Service Providers;</li>
              <li>
                property damage, personal loss, or injury arising from
                engagements;
              </li>
              <li>interruptions caused by Third-Party Providers;</li>
              <li>inaccurate information provided by client.</li>
            </ul>

            <p className="mt-4">
              client shall indemnify and hold Cervanna harmless from any claims,
              losses, damages, costs, or liabilities arising from breach of
              these Terms, illegal conduct or negligence, incorrect information
              submitted, or misuse of the Platform.
            </p>

            <p>
              Medical personnel are personally responsible for the decisions
              they make and the care they provide while performing their duties.
            </p>
          </Section>

          <Section id="termination" title="Termination">
            <p>Cervanna may suspend or terminate accounts for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>breach of these Terms,</li>
              <li>fraudulent activity,</li>
              <li>failure to pay fees or commissions, or</li>
              <li>legal requirements.</li>
            </ul>
            <p>client may close their accounts at any time.</p>
          </Section>

          <Section id="data" title="Data Protection">
            <p>
              Personal data shall be processed in accordance with the Kenya Data
              Protection Act (2019) and the Cervanna Privacy Policy.
            </p>
            <p>
              By using the Platform, you expressly consent to the collection,
              storage, and processing of your personal data as described in the
              Privacy Policy.
            </p>
            <p>
              You have the right to withdraw your consent at any time, subject
              to the legal basis for processing and any obligations that require
              continued processing under law or to fulfil contractual
              obligations.
            </p>
            <p>
              client acknowledge that continued use of the Platform constitutes
              ongoing consent to the processing of personal data in accordance
              with these Terms and the Privacy Policy.
            </p>
          </Section>

          <Section id="ip" title="Intellectual Property">
            <p>
              All trademarks, logos, branding, content, text, graphics, and
              materials created by Cervanna are the property of Cervanna Care
              and are protected under applicable intellectual property and
              copyright laws.
            </p>
            <p>
              No reproduction, modification, distribution, or use of such
              materials is permitted without prior written consent from Cervanna
              Care.
            </p>
          </Section>

          <Section id="law" title="Governing Law and Dispute Resolution">
            <p>These Terms are governed by the laws of Kenya.</p>
            <p>Disputes shall be resolved in the following order:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Negotiation;</li>
              <li>Mediation (if negotiation fails);</li>
              <li>Referral to the courts of Kenya.</li>
            </ol>
          </Section>

          <Section id="amendments" title="Amendments">
            <p>
              Cervanna may update these Terms from time to time. client will be
              notified of material changes, and continued use constitutes
              acceptance.
            </p>
          </Section>

          {/* Footer note */}
          <div className="pt-8 border-t text-sm text-gray-600">
            <p>
              If you have any questions regarding these Terms, please contact
              Cervanna Care support through the Platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
