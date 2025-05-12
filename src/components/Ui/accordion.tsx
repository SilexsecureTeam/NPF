import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

// Define the types for the accordion items
interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionBodyProps {
  items: AccordionItem[];
}

// Define the AccordionBody component
export const accordionItems = [
  {
    title: "Is Aspox suitable for my type of business?",
    content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est magni dolores eos qui ratione"
  },
  {
    title: "Can I get a customized solution for my business?",
    content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est magni dolores eos qui ratione"
  },
  {
    title: "How secure is Aspox for payment processing?",
    content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est magni dolores eos qui ratione"
  },
  {
    title: "How do I contact Aspox for more information?",
    content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est magni dolores eos qui ratione"
  }
];

export function AccordionBody({ items }: AccordionBodyProps) {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionPanel key={index}>
          <AccordionTitle>{item.title}</AccordionTitle>
          <AccordionContent>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              {item.content}
            </p>
          </AccordionContent>
        </AccordionPanel>
      ))}
    </Accordion>
  );
}
