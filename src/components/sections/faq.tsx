'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ_DATA } from '@/consts';

export default function FAQ() {
  return (
    <section className="section-padding container flex flex-col gap-8 md:flex-row md:gap-16">
      <div className="flex max-w-md flex-col gap-6 md:gap-16">
        <h2 className="text-3xl">Frequently Asked Questions</h2>
        <h3 className="text-2xl leading-8 md:text-4xl md:leading-14 lg:text-5xl">
          Everything You Need to Know About Handcrafted Miniature Furniture
        </h3>
      </div>

      <Accordion defaultValue="item-0" type="single" className="space-y-8">
        {FAQ_DATA.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="px-4">
            <AccordionTrigger data-speakable="faq-question" className="cursor-pointer text-xl font-normal hover:no-underline md:pb-6 md:text-3xl">
              {item.question}
            </AccordionTrigger>
            <AccordionContent data-speakable="faq-answer" className="text-base md:pb-6">
              <span
                className="[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
