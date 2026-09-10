"use client";

import { useState } from 'react';
import { AccordionItem } from '@/types';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
    items: AccordionItem[];
    className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!items || items.length === 0) return null;

    return (
        <section className={`py-8 bg-transparent ${className}`}>
            <div className="container mx-auto px-6 w-full">
                <div className="max-w-4xl mx-auto space-y-4">
                    {items.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl overflow-hidden transition-all duration-300 border bg-white ${isOpen
                                    ? 'shadow-lg border-purple-500/20 shadow-purple-500/5'
                                    : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                                    }`}
                            >
                                <button
                                    onClick={() => toggle(index)}
                                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer group"
                                    aria-expanded={isOpen}
                                    aria-controls={`accordion-content-${index}`}
                                    aria-label="Toggle Accordion"
                                >
                                    <span className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-purple-600' : 'text-slate-800 group-hover:text-purple-600'
                                        }`}>
                                        {item.title}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                                        ? 'bg-purple-600 text-white rotate-180'
                                        : 'bg-slate-50 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600'
                                        }`}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>

                                <div
                                    id={`accordion-content-${index}`}
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6">
                                        <div
                                            className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4 prose prose-sm max-w-none skilldeck-content text-sm"
                                            dangerouslySetInnerHTML={{ __html: item.value }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
