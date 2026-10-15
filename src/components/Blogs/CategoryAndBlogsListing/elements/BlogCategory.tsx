import BlogLoadMoreSkeleton from '@/components/Utils/BlogLoadMoreSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { Suspense, useState } from 'react';

import BlogCard from './BlogCard';
import FeaturedBlogCard from './FeaturedBlogCard';

import { IBlogs } from '@/types/interface-lib';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Define strict types for props
export interface Category {
    _id?: string;
    id?: string;
    name: string | { name: string; title?: string };
}

export interface BlogCategoryProps {
    categories: Category[];
    initialBlogs: IBlogs[];
    initialMeta?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    initialCategory?: string;
    partnerBlogs?: any[];
    desktopCols?: 2 | 3;
}

interface BlogCategoryViewProps extends BlogCategoryProps {
    /** The ?category= value, or the initial category before the URL is read. */
    selectedCategoryFromUrl: string;
    /** The current query string, kept intact when the category changes. */
    searchString: string;
}

const BlogCategoryView = ({ categories, initialBlogs, initialMeta, initialCategory, partnerBlogs, desktopCols = 2, selectedCategoryFromUrl, searchString }: BlogCategoryViewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileIndex, setMobileIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // State for the current category and its blogs
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
    const [blogs, setBlogs] = useState<IBlogs[]>(initialBlogs || []);
    const [extraBlogs, setExtraBlogs] = useState<IBlogs[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(initialMeta?.page || 1);
    const [totalPages, setTotalPages] = useState(initialMeta?.pages || 1);
    const [totalBlogs, setTotalBlogs] = useState(initialMeta?.total || 0);
    const [loadingMore, setLoadingMore] = useState(false);

    // Helper to fetch blogs for a category
    const fetchBlogsForCategory = async (category: string) => {
        setLoading(true);
        setSelectedCategory(category);
        setExtraBlogs([]);
        setMobileIndex(0);

        try {
            const res = await fetch(`/api/blogs?category=${encodeURIComponent(category)}&page=1&limit=12&sortBy=createdAt&order=desc`);
            if (res.ok) {
                const responseData = await res.json();
                setBlogs(responseData.data || []);
                if (responseData.meta) {
                    setCurrentPage(responseData.meta.page);
                    setTotalPages(responseData.meta.pages);
                    setTotalBlogs(responseData.meta.total);
                }
            }
        } catch (error) {
            console.error("Error fetching blogs for category:", error);
        } finally {
            setLoading(false);
        }
    };

    // Sync state with URL changes (when user clicks back/forward or category button)
    React.useEffect(() => {
        if (selectedCategoryFromUrl !== selectedCategory) {
            fetchBlogsForCategory(selectedCategoryFromUrl);
        }
    }, [selectedCategoryFromUrl]);

    // Combine "All" with fetched categories
    const displayCategories = React.useMemo(() => {
        const allOption = { id: 'all-categories', _id: 'all-categories', name: 'All' };
        const apiCats = (categories || []).map((c: any) => {
            if (!c || !c.name) return null;
            const nameValue = typeof c.name === 'object' ? c.name?.name : c.name;
            if (nameValue && typeof nameValue === 'string' && nameValue.trim() !== '' && nameValue !== 'All') {
                return { ...c, name: nameValue };
            }
            return null;
        }).filter((item): item is any => item !== null);

        return [allOption, ...apiCats];
    }, [categories]);

    // Combine server-side blogs with client-loaded extra blogs
    const currentCourses = React.useMemo(() => {
        return [...(blogs || []), ...extraBlogs];
    }, [blogs, extraBlogs]);

    const hasMore = totalBlogs > 0 ? currentCourses.length < totalBlogs : currentCourses.length > 0;

    const handleCategoryClick = (name: string) => {
        if (name === selectedCategory) return;

        const params = new URLSearchParams(searchString);
        if (name && name !== 'All') {
            params.set('category', name);
        } else {
            params.delete('category');
        }
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const LoadMore = async () => {
        if (loadingMore || !hasMore) return false;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const res = await fetch(`/api/blogs?category=${encodeURIComponent(selectedCategory)}&page=${nextPage}&limit=12&sortBy=createdAt&order=desc`);
            if (res.ok) {
                const responseData = await res.json();
                const newBlogs = responseData.data || [];

                setExtraBlogs(prev => [...prev, ...newBlogs]);

                if (responseData.meta) {
                    setCurrentPage(responseData.meta.page);
                    setTotalPages(responseData.meta.pages);
                    setTotalBlogs(responseData.meta.total);
                }
                return true;
            }
        } catch (error) {
            console.error("Error loading more blogs", error);
        } finally {
            setLoadingMore(false);
        }
        return false;
    };

    const scrollCategories = () => {
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
            categoryList.scrollLeft += 150;
        }
    };

    return (
        <div className="container mx-auto px-4 lg:px-0 mb-6 lg:mb-20">
            <div className="md:py-6">
                {/* Partner Blogs Section */}
                {partnerBlogs && partnerBlogs.length > 0 && (
                    <div className="mb-16 border-b border-gray-100 pb-16">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-1 w-12 bg-blue-600 rounded-full" />
                                <div className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">Partner Highlights</div>
                            </div>
                            <h3 className="font-extrabold text-2xl xl:text-4xl text-gray-900 tracking-tight">Featured Training Partner Insights</h3>
                            <p className="text-gray-500 text-sm md:text-base mt-2 font-medium italic">Expert perspectives and essential updates from our trusted global training ecosystem.</p>
                        </div>

                        <div className="mb-10">
                            <FeaturedBlogCard blog={partnerBlogs[0]} />
                        </div>

                        {partnerBlogs.length > 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                                {partnerBlogs.slice(1).map((blog, idx) => (
                                    <BlogCard key={blog?._id || `partner-blog-${idx}`} blog={blog} priority={false} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-slate-100 pb-4 mb-2">
                    <div className="flex-shrink-0">
                        <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Categories</div>
                        <h2 className="font-extrabold text-xl md:text-2xl lg:text-3xl bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] bg-clip-text text-transparent mt-1">Explore Articles</h2>
                    </div>

                    <div className="flex items-center gap-3 relative max-w-full md:max-w-[70%]">
                        <div id="category-list" className="flex justify-start items-center gap-2 py-1 overflow-x-auto scroll-bar cursor-pointer no-scrollbar transition-all scroll-smooth w-full">
                            {displayCategories.map((item: any, index: number) => {
                                if (!item) return null;
                                const categoryName = typeof item.title === 'object' && item.name !== null ? (item.name.name || item.name.title || 'Unknown') : (item.name || item.title || 'Unknown');
                                return (
                                    <button
                                        key={item.id || item._id || `cat-${index}`}
                                        className={`flex text-nowrap items-center gap-x-2 px-4.5 py-2 text-xs md:text-sm capitalize rounded-xl transition-all duration-300 cursor-pointer ${selectedCategory === categoryName
                                            ? 'bg-[linear-gradient(125deg,rgba(92,63,250,1)_0%,rgba(203,59,149,1)_48%,rgba(254,106,27,1)_100%)] text-white font-black shadow-md shadow-indigo-600/15'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold border border-slate-100/85'
                                            }`}
                                        onClick={() => handleCategoryClick(categoryName)}
                                    >
                                        {categoryName}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="flex lg:hidden gap-1.5 flex-shrink-0">
                            <button
                                aria-label="Scroll categories left"
                                onClick={() => {
                                    const el = document.getElementById('category-list');
                                    if (el) el.scrollLeft -= 150;
                                }}
                                className="border border-slate-200 p-2 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center justify-center cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                                aria-label="Scroll categories right"
                                onClick={scrollCategories}
                                className="border border-slate-200 p-2 rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center justify-center cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {loading ? (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 ${desktopCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={i > 0 ? "hidden sm:block" : ""}><BlogLoadMoreSkeleton /></div>
                            ))}
                        </div>
                    ) : currentCourses.length === 0 ? (
                        <div className="flex justify-center text-center items-center h-60 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500">
                                No Blogs available for <span className="font-bold text-gray-900">{selectedCategory}</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="block sm:hidden">
                                {Array.isArray(currentCourses) && currentCourses.length > 0 && (
                                    <>
                                        <div className="mb-4">
                                            <BlogCard blog={currentCourses[mobileIndex]} priority={true} />
                                        </div>
                                        <div className="flex justify-center gap-4">
                                            <button
                                                aria-label="Previous article"
                                                className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                onClick={() => setMobileIndex(prev => Math.max(0, prev - 1))}
                                                disabled={mobileIndex === 0}
                                            >
                                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                                            </button>
                                            <button
                                                aria-label="Next article"
                                                className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                onClick={async () => {
                                                    if (mobileIndex < currentCourses.length - 1) {
                                                        setMobileIndex(prev => prev + 1);
                                                    } else if (hasMore && !loadingMore) {
                                                        const success = await LoadMore();
                                                        if (success) {
                                                            setMobileIndex(prev => prev + 1);
                                                        }
                                                    }
                                                }}
                                                disabled={mobileIndex === currentCourses.length - 1 && !hasMore}
                                            >
                                                <ChevronRight className={`w-5 h-5 text-gray-700 ${loadingMore ? 'animate-pulse' : ''}`} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={`hidden sm:grid grid-cols-1 sm:grid-cols-2 ${desktopCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
                                {(Array.isArray(currentCourses) ? currentCourses : []).map((blog, idx) => (
                                    <BlogCard key={blog?._id || `blog-${idx}`} blog={blog} priority={idx < 2} />
                                ))}
                            </div>
                        </>
                    )}

                    {hasMore && (
                        <div className="hidden sm:flex justify-center items-center mt-12">
                            <button
                                onClick={LoadMore}
                                disabled={loadingMore}
                                className="flex items-center text-xs 2xl:text-sm gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition-all duration-300 disabled:opacity-70"
                            >
                                {loadingMore ? 'Loading Articles...' : 'Load More Articles'}
                                {loadingMore && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function BlogCategoryWithParams(props: BlogCategoryProps) {
    const searchParams = useSearchParams();
    return (
        <BlogCategoryView
            {...props}
            selectedCategoryFromUrl={searchParams.get('category') || 'All'}
            searchString={searchParams.toString()}
        />
    );
}

/**
 * useSearchParams has no value during prerender, so on its own it made the
 * whole blog listing bail out to client-side rendering: the static HTML of
 * /blog carried a skeleton and no articles or H1. The fallback renders the
 * listing for the initial category, which is exactly what the prerender should
 * contain; the URL-aware version takes over once the client hydrates.
 */
const BlogCategory = (props: BlogCategoryProps) => (
    <Suspense
        fallback={
            <BlogCategoryView
                {...props}
                selectedCategoryFromUrl={props.initialCategory || 'All'}
                searchString=""
            />
        }
    >
        <BlogCategoryWithParams {...props} />
    </Suspense>
);

export default BlogCategory;