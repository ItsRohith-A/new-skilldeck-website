"use client";
import BlogSticky from '@/components/Utils/BlogSticky';
import BlogCategory from '../CategoryAndBlogsListing/elements/BlogCategory';
import SkillDeckIntro from '../CategoryAndBlogsListing/elements/SkillDeckInfo';
import Body from './elements/Body';

interface ArticleBodyProps {
    categories: any;
    blogs: any;
    selectedCategory: string;
    singleArticle: any;
}

const ArticleBody = ({ categories, blogs, selectedCategory, singleArticle }: any) => {
    return (
        <div className="relative blog-padding mt-20 lg:mt-24">
            <div className="container mx-auto px-4 lg:px-0">
                <div className="lg:grid grid-cols-12 justify-center gap-8 h-full">
                    {/* Left main content column */}
                    <div className="lg:col-span-9 px-2 lg:px-0">
                        <Body singleArticle={singleArticle} selectedCategory={selectedCategory} />
                    </div>

                    {/* Right Sticky Section */}
                    <div className="lg:col-span-3 px-4 md:px-0">
                        <BlogSticky />
                    </div>
                </div>

                <SkillDeckIntro />

                <div className="md:mt-10">
                    <BlogCategory
                        categories={categories}
                        initialBlogs={blogs}
                        initialCategory={selectedCategory}
                        desktopCols={3}
                    />
                </div>
            </div>
        </div>
    )
}

export default ArticleBody;