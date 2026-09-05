import { fetchFromBackend } from "./apiProxy";
import { cache } from "react";

export const getCategories = cache(async () => {
  try {
    const catRes = await fetchFromBackend("/categories", {
      queryParams: new URLSearchParams({
        select: "_id,name,slug,order",
        sort: "order",
        limit: "100",
      }),
      cache: "force-cache",
      next: { tags: ['categories', 'courses'] },
    });

    if (!catRes.ok) return [];
    const catData = await catRes.json();
    const categories = (catData.data || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const courseFields = "slug,course_name,order,category_slug,courseCard.courseIcon,category";
    const limit = 100;

    const firstPageRes = await fetchFromBackend("/courses", {
      queryParams: new URLSearchParams({ limit: limit.toString(), page: "1", select: courseFields }),
      cache: "force-cache",
      next: { tags: ['categories', 'courses'] },
    });

    if (!firstPageRes.ok) return [];
    const firstPageData = await firstPageRes.json();
    let allCoursesGlobal = [...(firstPageData.data || [])];
    const totalCourses = firstPageData.meta?.total || allCoursesGlobal.length;

    if (totalCourses > limit) {
      const totalPages = Math.ceil(totalCourses / limit);
      const otherPagesPromises = [];

      for (let p = 2; p <= totalPages; p++) {
        otherPagesPromises.push(
          fetchFromBackend("/courses", {
            queryParams: new URLSearchParams({ limit: limit.toString(), page: p.toString(), select: courseFields }),
            cache: "force-cache",
            next: { tags: ['categories', 'courses'] },
          }).then((res) => (res.ok ? res.json() : { data: [] }))
        );
      }

      const otherPagesData = await Promise.all(otherPagesPromises);
      otherPagesData.forEach((pData) => {
        allCoursesGlobal = [...allCoursesGlobal, ...(pData.data || [])];
      });
    }

    const categoriesWithCourses = categories.map((cat: any) => {
      const courses = allCoursesGlobal
        .filter((course: any) => course.category_slug === cat.slug || course.category?.slug === cat.slug)
        .map((course: any) => ({
          slug: course.slug,
          course_name: course.course_name,
          order: course.order,
          courseCard: {
            courseIcon: course.courseCard?.courseIcon,
          },
        }))
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      return {
        ...cat,
        courses,
      };
    });

    return categoriesWithCourses;
  } catch (error) {
    console.error("Error fetching categories and courses:", error);
    return [];
  }
});

export const getCategoryPageCourses = cache(async (categorySlug: string) => {
    try {
        const courseFields = 'slug,course_title,course_name,order,category_slug,courseCard,category';
        const limit = 100;

        const firstPageRes = await fetchFromBackend('/courses', {
            queryParams: new URLSearchParams({ limit: limit.toString(), page: '1', select: courseFields }),
            cache: 'force-cache',
            next: { tags: ['categories', 'courses'] }
        });

        if (!firstPageRes.ok) return { data: [], meta: { total: 0, page: 1, limit: 6, pages: 0 } };
        const firstPageData = await firstPageRes.json();
        let allCourses = [...(firstPageData.data || [])];
        const total = firstPageData.meta?.total || allCourses.length;

        if (total > limit) {
            const totalPages = Math.ceil(total / limit);
            const otherPagesPromises = [];
            for (let p = 2; p <= totalPages; p++) {
                otherPagesPromises.push(
                    fetchFromBackend('/courses', {
                        queryParams: new URLSearchParams({ limit: limit.toString(), page: p.toString(), select: courseFields }),
                        cache: 'force-cache',
                        next: { tags: ['categories', 'courses'] }
                    }).then(res => res.ok ? res.json() : { data: [] })
                );
            }
            const results = await Promise.all(otherPagesPromises);
            results.forEach(r => allCourses = [...allCourses, ...(r.data || [])]);
        }

        const filtered = allCourses
            .filter((c: any) => c.category_slug === categorySlug || c.category?.slug === categorySlug)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        return {
            data: filtered,
            meta: {
                total: filtered.length,
                page: 1,
                limit: filtered.length,
                pages: 1
            }
        };

    } catch (error) {
        console.error('Error fetching category page courses:', error);
        return { 
            data: [], 
            meta: { 
                total: 0,
                page: 1,
                limit: 10,
                pages: 1
            } 
        };
    }
});
