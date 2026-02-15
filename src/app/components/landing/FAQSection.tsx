"use client";
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "How does StartLabX clarify my startup idea?",
        answer: "Our AI Co-pilot analyzes market trends, competitor landscapes, and user pain points to refine your raw idea into a viable business model with a clear value proposition."
    },
    {
        question: "Do I need technical skills to build an MVP?",
        answer: "Not necessarily. StartLabX provides low-code/no-code integration tools and connects you with pre-vetted fractional CTOs and developers from our talent marketplace."
    },
    {
        question: "Is the platform free to use?",
        answer: "We offer a generous free tier for early-stage validation. Professional features like advanced AI modeling, legal templates, and direct investor matching are available on our Pro plan."
    },
    {
        question: "How does the equity management work?",
        answer: "We use smart contracts to automate cap table management and vesting schedules, ensuring transparency and security for all stakeholders without expensive legal retainers."
    },
    {
        question: "Can I find co-founders here?",
        answer: "Absolutely. Our matching algorithm connects you with potential co-founders based on complementary skills, shared vision, and work style compatibility."
    }
];

export function FAQSection() {
    return (
        <section className="py-24 bg-zinc-950 text-white relative overflow-hidden" id="faq">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                        <HelpCircle className="h-4 w-4" />
                        <span>Common Queries</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Everything you need to know about building your future with StartLabX.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-2xl bg-white/5 px-6">
                            <AccordionTrigger className="text-lg font-medium hover:text-purple-400 transition-colors py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-300 text-base pb-6 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
