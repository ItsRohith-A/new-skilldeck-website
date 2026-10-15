"use client";

import { useEffect, useState } from "react";

/** A category as /api/nav-categories returns it (see getCategories). */
export interface NavCategory {
    _id: string;
    name: string;
    slug: string;
    order?: number;
    courses: {
        slug: string;
        course_name: string;
        order?: number;
        courseCard?: { courseIcon?: { url?: string } };
    }[];
}

// One request per page load, shared by the desktop dropdown and the mobile menu.
let categoriesPromise: Promise<NavCategory[]> | null = null;

function loadNavCategories(): Promise<NavCategory[]> {
    if (!categoriesPromise) {
        categoriesPromise = fetch("/api/nav-categories")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => (Array.isArray(data) ? data : []))
            .catch(() => {
                categoriesPromise = null; // let the next mount retry
                return [];
            });
    }
    return categoriesPromise;
}

/**
 * The Courses menu data, fetched once the page is idle instead of being
 * serialised into every page's HTML. Empty until it arrives; the menus render
 * their categories as soon as it does.
 */
export function useNavCategories() {
    const [categories, setCategories] = useState<NavCategory[]>([]);

    useEffect(() => {
        let cancelled = false;
        const load = () => loadNavCategories().then((data) => {
            if (!cancelled) setCategories(data);
        });

        // Off the critical path: wait for idle so it never competes with LCP.
        const w = window as Window & {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
            cancelIdleCallback?: (id: number) => void;
        };
        if (w.requestIdleCallback) {
            const id = w.requestIdleCallback(load, { timeout: 3000 });
            return () => { cancelled = true; w.cancelIdleCallback?.(id); };
        }
        const timer = setTimeout(load, 1500);
        return () => { cancelled = true; clearTimeout(timer); };
    }, []);

    return categories;
}
