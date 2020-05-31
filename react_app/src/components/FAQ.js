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
  <div className="my-6 sm:my-8 leading-snug">
    <p className="mb-1 text-lg">
      <strong className="mr-1">Q:</strong>
      {question}
    </p>
    <p>
      <strong className="mr-1">A:</strong>
      {answer}
    </p>
  </div>
);

const FAQ = () => (
  <div>
    <h2
      id="faq"
      className="px-1 pt-2 my-2 sm:my-3 text-2xl border-b border-gray-600"
    >
      FAQ
    </h2>
    <QuestionAndAnswer
      question="What do I do if something doesn't work or there is an incorrect word?"
      answer={
        <span>
          You can report it using the feedback{' '}
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeFnUw8-oYluUpsaORb1krYowiq_JGeTuu_ibFhiIkKl5HJig/viewform?usp=sf_link">
            Google Form
          </Link>
          .
        </span>
      }
    />
    <QuestionAndAnswer
      question="Why don't I see my series of Gregg Shorthand?"
      answer={
        <span>
          Currently only simplified is supported. I will add more series if
          people find it useful.{' '}
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSe7Dhv-7SiZavvGoYE0Fy-n9n7OCmUQjhUCIw0hMjePtQZntA/viewform?usp=sf_link">
            Vote here
          </Link>{' '}
          for your Gregg series.
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
    <QuestionAndAnswer
      question="I have another question!"
      answer={
        <span>
          Ask your questions using the{' '}
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeFnUw8-oYluUpsaORb1krYowiq_JGeTuu_ibFhiIkKl5HJig/viewform?usp=sf_link">
            feedback form
          </Link>
        </span>
      }
    />
  </div>
);

export default FAQ;
