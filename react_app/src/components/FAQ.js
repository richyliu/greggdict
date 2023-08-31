import React from 'react';

const Link = ({ href, children }) => (
  <a
    href={href}
    className="font-bold border-b border-transparent hover:border-current"
  >
    {children}
  </a>
);

const QuestionAndAnswer = ({ question, answer }) => (
  <div className="my-8 sm:my-10 leading-snug">
    <h3 className="mb-2 text-xl">{question}</h3>
    <p className="">{answer}</p>
  </div>
);

const FAQ = () => (
  <div>
    <h2
      id="faq"
      className="px-1 pt-2 my-2 sm:my-3 text-3xl border-b border-gray-600 font-light"
    >
      FAQ
    </h2>
    <QuestionAndAnswer
      question="How do I search for words that end in a certain suffix?"
      answer={
        <span>
          UNIX style search syntax is supported. White space acts as an AND
          operator, while a single pipe (|) character acts as an OR operator.
          Use "<code>ify$</code>" to search for words that end in "ify", like
          "certify" and "classify". For full search syntax, see{' '}
          <a
            href="https://github.com/krisk/Fuse/blob/master/docs/examples.md#extended-search"
            className="font-bold border-b border-transparent hover:border-current"
          >
            this reference
          </a>
          .
        </span>
      }
    />
    <QuestionAndAnswer
      question="Why are some common words missing?"
      answer={
        <span>
          This dictionary tool uses scanned PDFs of dictionaries, which were
          printed in the 20th century. Words that are common now may not have
          been common enough to be put into the dictionary back then. For
          example, the usage of the word "hello" has risen tremendously in the
          last 50 years (
          <Link href="https://books.google.com/ngrams/graph?content=hello&case_insensitive=on&year_start=1800&year_end=2008&corpus=15&smoothing=7">
            see graph
          </Link>
          ).
        </span>
      }
    />
    <QuestionAndAnswer
      question="How was this made?"
      answer={
        <span>
          I used OCR to do text detection on the dictionary images, and then
          built a web application with React to make it searchable. The code is{' '}
          <Link href="https://github.com/richyliu/greggdict">open source</Link>
        </span>
      }
    />
);

export default FAQ;
