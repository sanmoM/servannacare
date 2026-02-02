import React from "react";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "principles", label: "General Principles" },
  { id: "domestic-workers", label: "Domestic Workers (Individual Workers)" },
  { id: "agencies", label: "Domestic Worker Agencies" },
  {
    id: "nurses-physio-institutions",
    label: "Nurses, Nurse Aides, Physiotherapists & Medical Institutions",
  },
  { id: "client-cancellations", label: "Client Cancellations" },
  { id: "exceptions", label: "Exceptions" },
  { id: "how-to-cancel", label: "How to Cancel" },
  { id: "changes", label: "Changes to This Policy" },
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
            CERVANNA CARE – CANCELLATION & REFUND POLICY
          </h1>

          {/* <p className="mt-2 text-gray-600">
            <span className="font-medium">Last Updated:</span> {LAST_UPDATED}
          </p> */}

          <p className="mt-4 text-gray-700">
            This Cancellation and Refund Policy (“Policy”) applies to all client
            of the Cervanna Care Platform, including Clients, Service Providers,
            domestic workers, domestic worker agencies, nurses, nurse aides,
            physiotherapists, and medical institutions.
          </p>

          <p className="mt-2 text-gray-700">
            By using the Platform, you agree to this Policy.
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
          <Section id="principles" title="General Principles">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cervanna Care facilitates connections between Clients and
                Service Providers but does not employ, supervise, or control
                Service Providers.
              </li>
              <li>
                All payments, including subscription fees and commissions, are
                collected for access to the Platform or for services rendered
                through the Platform.
              </li>
              <li>
                Fees paid are generally non-refundable, except as expressly
                provided in this Policy.
              </li>
            </ul>
          </Section>

          <Section
            id="domestic-workers"
            title="Domestic Workers (Individual Workers)"
          >
            <p className="font-medium text-gray-900">
              Subscription fees for domestic workers are Kshs. 500 per month.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              Subscription cancellations
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Domestic workers may cancel their subscription at any time via
                their account settings.
              </li>
              <li>
                Cancellation will take effect at the end of the current billing
                cycle.
              </li>
              <li>Subscription fees already paid are non-refundable.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Refunds are not provided for
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Partial use of the subscription period.</li>
              <li>Failure to secure work through the Platform.</li>
            </ul>
          </Section>

          <Section id="agencies" title="Domestic Worker Agencies">
            <p>
              Agencies pay tiered subscription fees for access to listings and
              additional platform features.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              Subscription cancellations
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Agencies may cancel their subscription at any time.</li>
              <li>
                Cancellation takes effect at the end of the active subscription
                period.
              </li>
              <li>
                Paid fees are non-refundable, including fees for partially used
                periods.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Refunds are not provided for
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Downgrading subscription tiers mid-cycle.</li>
              <li>Non-usage of platform features.</li>
              <li>Failure to secure clients or placements.</li>
            </ul>
          </Section>

          <Section
            id="nurses-physio-institutions"
            title="Nurses, Nurse Aides, Physiotherapists, and Medical Institutions"
          >
            <p>
              These Service Providers and Institutions do not pay subscription
              fees but are subject to a <strong>15% commission</strong> of fees
              paid to them via the Platform.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Commission payments are final and non-refundable once deducted
                or invoiced.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Refunds are not provided for
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service Provider non-availability.</li>
              <li>Client cancellations (unless separately agreed).</li>
              <li>Any disputes between Clients and Service Providers.</li>
            </ul>
          </Section>

          <Section id="client-cancellations" title="Client Cancellations">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Clients who book a Service Provider via the Platform may cancel
                engagements in accordance with any agreements with the Service
                Provider.
              </li>
              <li>
                Cervanna Care is not responsible for refunds arising from
                Client-Service Provider disputes.
              </li>
              <li>
                Any agreed refunds between Clients and Service Providers must be
                handled directly, unless Cervanna explicitly facilitates
                payments.
              </li>
            </ul>
          </Section>

          <Section id="exceptions" title="Exceptions">
            <p>
              In exceptional circumstances, Cervanna may consider refunds or fee
              adjustments at its sole discretion, such as:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Platform errors or technical failures preventing access</li>
              <li>Duplicate charges or billing errors</li>
            </ul>

            <p className="mt-4">
              Requests for refunds must be submitted within{" "}
              <strong>14 days</strong> of the relevant charge via email 
            </p>

          </Section>

          <Section id="how-to-cancel" title="How to Cancel">
            <p>client may cancel their subscription via:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account settings on the Platform, or</li>
              <li>Written notice to Cervanna Care via email</li>
            </ul>

            <p>
              Cancellations take effect at the end of the current billing cycle.
              client remain liable for fees and commissions accrued prior to the
              cancellation effective date.
            </p>
          </Section>

          <Section id="changes" title="Changes to This Policy">
            <p>Cervanna may update this Policy from time to time.</p>
            <p>
              Material changes will be communicated through the Platform.
              Continued use constitutes acceptance of the updated Policy.
            </p>
          </Section>

          {/* Footer */}
          <div className="pt-8 border-t text-sm text-gray-600">
            <p>
              If you have questions about cancellations or refunds, contact
              Cervanna Care support through the Platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
