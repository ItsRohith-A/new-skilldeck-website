import CourseAccordionSection from '@/components/category/courses/overview/CourseAccordionSection';
import CourseRelatedLinks from '@/components/category/courses/overview/CourseRelatedLinks';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import parse, { Element, HTMLReactParserOptions, Text } from 'html-react-parser';
import DOMPurify from "@/lib/dompurify";
import { Calendar, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import defaultImg from '../../../../../public/blogs/defaultProfile.png';
import BlogScheduleTable from './BlogRegistry/BlogScheduleTable';
import CompactCourseGrid from './BlogRegistry/CompactCourseGrid';

const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
    'course-cards': CompactCourseGrid,
    'schedule-section': BlogScheduleTable
};

/** SkilldeckEditor output carries its wrapper class or its own <style>; legacy Jodit HTML has neither. */
const EDITOR_HTML_RE = /skilldeck-rich-text|<style[\s>]/i;

/** Removes <script> tags, inline event handlers and javascript: hrefs; keeps <style> so editor CSS applies. */
function sanitizeEditorHtml(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
        .replace(/href\s*=\s*["']\s*javascript:[^"']*/gi, 'href="#"');
}

function getTextContent(node: Element): string {
    return (node.children || [])
        .map((child: any) => {
            if (child.type === 'text') return (child as Text).data;
            if (child.type === 'tag') return getTextContent(child as Element);
            return '';
        })
        .join('');
}

const getAuthorInfo = (author: any) => {
    if (!author || typeof author === 'string') {
        return { name: 'Unknown Author', photo: defaultImg };
    }

    let photoUrl: any = defaultImg;
    if (author.photo) {
        if (typeof author.photo === 'string' && author.photo.trim() !== "") {
            photoUrl = author.photo;
        } else if (typeof author.photo === 'object') {
            const photoObj = author.photo as any;
            photoUrl = photoObj.url || photoObj.thumbnail || defaultImg;
        }
    }

    return {
        name: author.name || 'Unknown Author',
        photo: photoUrl
    };
};

const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Recently';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return 'Recently';
    }
};

const Body = ({ singleArticle }: any) => {
    const article = singleArticle;
    const author = getAuthorInfo(article?.author);

    const category = article?.category || article?.marketplaceCategory;
    const categoryTitle = category ? (category.title || category.name || '') : '';

    const breadcrumbItems = [
        { label: 'Blog', href: '/blog' },
        ...(categoryTitle
            ? [{ label: categoryTitle, href: `/blog?category=${categoryTitle}` }]
            : []),
        { label: article?.slug || 'Article' }
    ];

    const options: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            let content = '';
            let isMatchCandidate = false;

            if (domNode.type === 'tag' || domNode instanceof Element) {
                content = getTextContent(domNode).replace(/\u00a0/g, ' ').trim();
                isMatchCandidate = content.includes('{{') && content.includes('}}');
            } else if (domNode.type === 'text') {
                content = domNode.data.replace(/\u00a0/g, ' ').trim();
                isMatchCandidate = content.includes('{{') && content.includes('}}');
            }

            if (isMatchCandidate) {
                const match = content.match(/^\{\{\s*([\w-]+)\s*\}\}$/);

                if (match) {
                    const key = match[1];
                    const Component = COMPONENT_REGISTRY[key];

                    if (Component) {
                        return <Component blog={article} courses={article.marketCourses} />;
                    }
                }
            }
        }
    };

    return (
        <div className='space-y-5'>
            {/* Header Card Banner (Left Half top) */}
            <div className="relative w-full bg-[linear-gradient(135deg,#f5f3ff_0%,#eef2ff_50%,#e0e7ff_100%)] border border-slate-100 rounded-3xl overflow-hidden p-6 md:p-10">
                {/* Decorative mesh vector details */}
                <div className="absolute top-0 right-0 w-[25rem] h-[25rem] bg-indigo-200/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[15rem] h-[15rem] bg-purple-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                    {/* Breadcrumbs at the top of the banner */}
                    <div className="flex justify-start">
                        <Breadcrumb items={breadcrumbItems} className="text-slate-500 font-semibold" />
                    </div>

                    {/* Main Title */}
                    <h1 className="text-lg md:text-2xl xl:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                        {article?.title}
                    </h1>

                    {/* Short Description subtitle */}
                    {article?.smallDescription && (
                        <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                            {article.smallDescription}
                        </p>
                    )}

                    {/* Horizontal Metadata Row inside banner at the bottom */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white flex-shrink-0">
                                <Image
                                    src={typeof author.photo === 'string' ? author.photo : author.photo.src || defaultImg}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                    alt={author.name}
                                />
                            </div>
                            <div>
                                <span className="text-xs font-extrabold text-slate-800 block leading-tight">{author.name}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Author</span>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-slate-200/60 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-tight">Published</span>
                                <span className="text-xs font-bold text-slate-600 block">{formatDate(article?.createdAt)}</span>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-slate-200/60 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-tight">Read Time</span>
                                <span className="text-xs font-bold text-slate-600 block">{article?.readTime || '5 mins'}</span>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-slate-200/60 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-indigo-500" />
                            <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-tight">Views</span>
                                <span className="text-xs font-bold text-slate-600 block">{article?.views || '0'}+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body HTML Content */}
            <div className='blog-body overflow-hidden pt-4'>
                {EDITOR_HTML_RE.test(article?.body || '') ? (
                    // SkilldeckEditor HTML + CSS: styled by the shared rich-text stylesheet (app/layout.tsx),
                    // not the legacy .skilldeck-content typography, which would fight the editor's rules.
                    <div className="skilldeck-rich-text max-w-none">
                        {parse(sanitizeEditorHtml(article.body), options)}
                    </div>
                ) : (
                    <div className="skilldeck-content font-inter text-slate-700 leading-relaxed max-w-none text-sm md:text-base">
                        {parse(DOMPurify.sanitize(article?.body || ''), options)}
                    </div>
                )}
            </div>

            {/* Bottom Section (Accordion) */}
            {article?.bottomSection?.value && (
                <div className="mt-6">
                    <CourseAccordionSection
                        title={article.bottomSection.title}
                        value={article.bottomSection.value}
                    />
                </div>
            )}

            {/* Internal Section (Related Links) */}
            {article?.internalSection?.value && (
                <div className="mt-4">
                    <CourseRelatedLinks
                        title={article.internalSection.title}
                        value={article.internalSection.value}
                    />
                </div>
            )}
        </div>
    );
};

export default Body;
