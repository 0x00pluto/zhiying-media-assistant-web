import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import {
  FAQ_ITEMS,
  HELP_COPY,
} from "@/app/(marketing)/_config/marketing-content";

export function FaqSection() {
  return (
    <section id="faq" className="border-t bg-muted/20 py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">
            有什么不解？
          </h2>
          <p className="text-3xl font-black text-foreground sm:text-4xl">
            常见问题解答
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <Card key={item.question} className="overflow-hidden py-0">
              <AccordionItem value={`item-${index}`} className="border-0 px-0">
                <AccordionTrigger className="px-5 py-5 hover:bg-accent/50 hover:no-underline">
                  <span className="text-sm font-bold text-foreground">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="border-t bg-muted/10 px-5 pb-5 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <Link
            href={HELP_COPY.viewAllHref}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {HELP_COPY.viewAllLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
