import { fetchFromBackend } from "./apiProxy";

export interface BlogCategory {
    _id: string;
    name: string;
}

export const fetchCategories = async (pageUrl?: string): Promise<BlogCategory[]> => {
    try {
        // endpoint changed to /blogs/categories because fetchFromBackend prepends API_BASE_URL
        const response = await fetchFromBackend('/blogs/categories', {
            next: { tags: ['blogs'] }
        });

        if (!response.ok) {
            console.error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
            return [];
        }

        // Check if API returned cache miss and pageUrl is provided to purge Cloudflare page cache
        const cacheStatus = response.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("./cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in fetchCategories:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare in fetchCategories:", err);
            });
        }

        const data = await response.json();
        return Array.isArray(data) ? data : (data.categories || []);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

interface BlogQueryParams {
    page?: number | string;
    limit?: number | string;
    sortBy?: string;
    order?: 'asc' | 'desc' | string;
}

export const fetchBlogs = async (category: string = 'All', queryParams: BlogQueryParams = {}, pageUrl?: string): Promise<{ data: any[], meta?: any }> => {
    try {
        const params = new URLSearchParams();

        if (category && category !== 'All') {
            params.append('category', category);
        }

        const { page = 1, limit = 6, sortBy = 'createdAt', order = 'desc' } = queryParams;

        params.append('page', String(page));
        params.append('limit', String(limit));
        params.append('sortBy', sortBy);
        params.append('order', order);

        // endpoint changed to /blogs because fetchFromBackend prepends API_BASE_URL
        const response = await fetchFromBackend('/blogs', {
            queryParams: params,
            next: { tags: ['blogs'] }
        });

        if (!response.ok) {
            console.error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
            return { data: [], meta: {} };
        }

        // Check if API returned cache miss and pageUrl is provided to purge Cloudflare page cache
        const cacheStatus = response.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("./cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in fetchBlogs:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare in fetchBlogs:", err);
            });
        }

        const responseData = await response.json();

        const blogsData = Array.isArray(responseData) ? responseData : (responseData.blogs || responseData.data || []);
        const metaData = responseData.meta || {};

        return { data: blogsData, meta: metaData };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return { data: [], meta: {} };
    }
};

/**
 * Fetches aggregated blogs from all active tenants.
 * This endpoint is different from the regular blog endpoint.
 */
export const fetchAggregatedBlogs = async (queryParams: BlogQueryParams = {}, pageUrl?: string): Promise<{ data: any[], meta?: any }> => {
    try {
        const { env } = await import("./env");
        const API_URL = env.SERVER_URL;
        const params = new URLSearchParams();

        const { page = 1, limit = 10 } = queryParams;

        params.append('page', String(page));
        params.append('limit', String(limit));

        // Fetch from the aggregated blogs endpoint
        const res = await fetch(`${API_URL}/api/v1/skilldeck/blogs?${params.toString()}`, {
            headers: {
                'x-api-key': env.API_KEY,
            },
            next: { tags: ['blogs'] }
        });

        if (!res.ok) {
            console.error(`Failed to fetch aggregated blogs: ${res.status} ${res.statusText}`);
            return { data: [], meta: {} };
        }

        // Check if API returned cache miss and pageUrl is provided to purge Cloudflare page cache
        const cacheStatus = res.headers.get('x-cache');
        if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
            import("./cloudflare").then(({ purgeCloudflareCache }) => {
                purgeCloudflareCache([pageUrl]).catch(err => {
                    console.error("[Cloudflare Purge Error] in fetchAggregatedBlogs:", err);
                });
            }).catch(err => {
                console.error("[Import Error] cloudflare in fetchAggregatedBlogs:", err);
            });
        }

        const responseData = await res.json();
        const blogsData = Array.isArray(responseData.data) ? responseData.data : (responseData.blogs || []);

        const metaData = {
            page: responseData.page,
            limit: responseData.limit,
            total: responseData.total,
            pages: responseData.totalPages
        };

        // Sort blogs as requested: Featured at top (Rank 1 first), then by rank ascending.
        const sortedBlogs = blogsData.sort((a: any, b: any) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;

            if (a.isFeatured && b.isFeatured) {
                if (a.rank === 1 && b.rank !== 1) return -1;
                if (a.rank !== 1 && b.rank === 1) return 1;
                const rankA = a.rank ?? Infinity;
                const rankB = b.rank ?? Infinity;
                return rankA - rankB;
            }
            return 0;
        });

        return { data: sortedBlogs, meta: metaData };
    } catch (error) {
        console.error('Error fetching aggregated blogs:', error);
        return { data: [], meta: {} };
    }
};

export const fetchBlogBySlug = async (slug: string, blogId?: string, pageUrl?: string): Promise<any | null> => {
    try {
        const { env } = await import("./env");
        const API_URL = env.SERVER_URL;

        // Construct query parameters
        const params = new URLSearchParams();
        if (blogId) {
            params.append('blogId', blogId);
        } else {
            params.append('slug', slug);
        }
        params.append('fields', 'body');

        const res = await fetch(`${API_URL}/api/v1/skilldeck/blogs?${params.toString()}`, {
            headers: {
                'x-api-key': env.API_KEY,
            },
            next: { tags: [`blog-${slug}`, 'blogs'] }
        });

        if (res.ok) {
            // Check if API returned cache miss and pageUrl is provided to purge Cloudflare page cache
            const cacheStatus = res.headers.get('x-cache');
            if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
                import("./cloudflare").then(({ purgeCloudflareCache }) => {
                    purgeCloudflareCache([pageUrl]).catch(err => {
                        console.error("[Cloudflare Purge Error] in fetchBlogBySlug (aggregated):", err);
                    });
                }).catch(err => {
                    console.error("[Import Error] cloudflare in fetchBlogBySlug:", err);
                });
            }
            const responseData = await res.json();
            const blogs = responseData.data || [];
            if (blogs.length > 0) {
                return blogs[0];
            }
        }

        // Fallback to the original tenant-specific blog fetch if not found in aggregated
        const response = await fetchFromBackend(`/blogs/${slug}`, {
            next: { tags: [`blog-${slug}`, 'blogs'] }
        });

        if (response.ok) {
            // Check if API returned cache miss and pageUrl is provided to purge Cloudflare page cache
            const cacheStatus = response.headers.get('x-cache');
            if (cacheStatus && cacheStatus.toUpperCase().includes('MISS') && pageUrl) {
                import("./cloudflare").then(({ purgeCloudflareCache }) => {
                    purgeCloudflareCache([pageUrl]).catch(err => {
                        console.error("[Cloudflare Purge Error] in fetchBlogBySlug (fallback):", err);
                    });
                }).catch(err => {
                    console.error("[Import Error] cloudflare in fetchBlogBySlug:", err);
                });
            }
            const data = await response.json();
            return data.blog || data.data || data;
        }

        return null;
    } catch (error) {
        console.error('Error fetching blog by slug:', error);
        return null;
    }
};
