const FAQS = [
  {
    question: "What is Silo?",
    answer:
      "Silo is a private file sharing app. Every file you upload stays private by default, visible only to you, until you choose to share it.",
  },
  {
    question: "How do I share a file with just one person instead of a public link?",
    answer:
      "Open the file's share panel and add the person's email. They get direct access to that file without it becoming publicly linkable, and you can revoke their access at any time.",
  },
  {
    question: "How do I make a file public?",
    answer:
      "Toggle a file's visibility to public from the share panel to generate an unguessable link. Anyone with the link can view it; switch it back to private to disable the link instantly.",
  },
  {
    question: "Can I organize my files into folders?",
    answer: "Yes — create folders, nest them, and move files between them from the dashboard.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-void-plum py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-[32px] sm:text-[42px] leading-[1.12] font-medium tracking-[-0.04em] text-paper-white">
          Frequently asked questions
        </h2>
        <dl className="mt-12 flex flex-col gap-8">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-[16px] font-semibold text-paper-white">{faq.question}</dt>
              <dd className="mt-2 text-[14px] leading-[1.6] text-silver-smoke">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
    </section>
  )
}
