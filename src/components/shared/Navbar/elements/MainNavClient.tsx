"use client";

import { Button } from "@/components/ui/Button";
import { HoveredLink, MenuItem, Menu as NavMenu } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import mainLogo from "../../../../../public/logos/mainlogo.svg";
import { MobileMenu } from "./MobileMenu";
import NavCategoriesDropdown from "./NavCategoriesDropdown";
import NavServicesDropdown from "./NavServicesDropdown";
import { useNavCategories } from "@/hooks/useNavCategories";

interface Props {
    isHidden?: boolean;
    servicesCategories?: any[];
}

function MainNav({ isHidden, servicesCategories = [] }: Props) {
    const pathname = usePathname();
    const categories = useNavCategories();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const [isCompaniesLoading, setIsCompaniesLoading] = useState(false);

    const handleCompaniesClick = () => {
        if (pathname !== "/companies") {
            setIsCompaniesLoading(true);
        }
    };

    const sortedCategories = [...categories]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(cat => ({
            ...cat,
            courses: [...(cat.courses || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
        }));

    const sortedServicesCategories = [...servicesCategories]
        .filter(cat => cat.services && cat.services.length > 0)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(cat => ({
            ...cat,
            services: [...(cat.services || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
        }));

    const isHomePage = pathname === "/";

    const isBusinessPage = pathname.startsWith("/blog") ||
        pathname.startsWith("/companies") ||
        (pathname !== "/" && !["/about-us", "/contact-us", "/register", "/careers", "/web-templates", "/services"].some(p => pathname.startsWith(p)));

    const ctaText = isBusinessPage ? "List your Institute" : "Try for free";

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navHeight = 100;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navHeight,
                behavior: "smooth"
            });
        }
    };

    const handleNavClick = (e: React.MouseEvent, sectionId: string | null) => {
        if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                e.preventDefault();
                scrollToSection(sectionId);
            }
        }
        closeMenu();
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
        if (typeof document !== "undefined") {
            document.body.style.overflow = "auto";
        }
    };

    const openMenu = () => {
        setIsMenuOpen(true);
        if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden";
        }
    };

    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchStartX - touchEndX; // positive for right-to-left
            const diffY = Math.abs(touchStartY - touchEndY);

            // Swipe from right edge to left (Open Menu)
            if (
                diffX > 50 &&
                diffY < 60 &&
                touchStartX > window.innerWidth * 0.8 &&
                !isMenuOpen
            ) {
                openMenu();
            }

            // Swipe from left to right (Close Menu)
            if (
                diffX < -50 &&
                diffY < 60 &&
                isMenuOpen
            ) {
                closeMenu();
            }
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isMenuOpen]);

    useEffect(() => {
        closeMenu();
        setIsCompaniesLoading(false);
    }, [pathname]);

    return (
        <>
            {/* Main Navbar */}
            <header
                id="main-navbar"
                className={cn(
                    "fixed -top-4 md:-top-4 left-0 right-0 z-50 px-2 py-4 transition-all duration-500 ease-in-out",
                    isHidden ? "-translate-y-full opacity-0 invisible pointer-events-none" : "translate-y-0 opacity-100 visible pointer-events-auto"
                )}
            >
                <nav className="container mx-auto pt-2 ">
                    <div className={cn(
                        "bg-white/95 backdrop-blur-md rounded-full px-4 py-1 md:py-0 md:px-6 shadow-lg border border-gray-100 flex items-center justify-between transition-all duration-300",
                        isScrolled && "shadow-xl"
                    )}>
                        <Link href="/" className="flex items-center gap-2 shrink-0" data-no-loader="true">
                            <Image src={mainLogo} alt="Logo" width={128} height={32} className="w-28 md:w-44 h-auto" priority style={{ height: 'auto' }} />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center">
                            <NavMenu setActive={setActive}>
                                {isBusinessPage && (
                                    <NavCategoriesDropdown
                                        initialCategories={sortedCategories}
                                        active={active}
                                        setActive={setActive}
                                    />
                                )}

                                <NavServicesDropdown
                                    initialCategories={sortedServicesCategories}
                                    active={active}
                                    setActive={setActive}
                                />
                                <HoveredLink
                                    href="/companies"
                                    onClick={handleCompaniesClick}
                                >
                                    <span className="relative inline-block py-1">
                                        Institutes
                                    </span>
                                </HoveredLink>

                                <HoveredLink href={isHomePage ? "#features" : "/#features"} data-no-loader="true" onClick={(e: React.MouseEvent) => handleNavClick(e, "features")}>
                                    Features
                                </HoveredLink>

                                <HoveredLink
                                    href={(isHomePage || pathname.startsWith("/services/")) ? (isHomePage ? "#plans" : "#plans") : "/pricing"}
                                    data-no-loader={(isHomePage || pathname.startsWith("/services/")) ? "true" : undefined}
                                    onClick={(e: React.MouseEvent) => handleNavClick(e, "plans")}
                                >
                                    Plans
                                </HoveredLink>

                                <HoveredLink href={isHomePage ? "#platform" : "/#platform"} data-no-loader="true" onClick={(e: React.MouseEvent) => handleNavClick(e, "platform")}>
                                    Platform
                                </HoveredLink>

                                <MenuItem setActive={setActive} active={active} item="About">
                                    <div className="flex flex-col space-y-3 min-w-45 bg-white p-3 shadow-lg rounded-md border border-slate-100">
                                        <HoveredLink href="/web-templates">Website Templates</HoveredLink>
                                        <HoveredLink href="/about-us">About Us</HoveredLink>
                                        <HoveredLink href="/contact-us">Contact Us</HoveredLink>
                                        <HoveredLink href="/blog">Blog</HoveredLink>
                                        <HoveredLink href="/careers">Careers</HoveredLink>
                                    </div>
                                </MenuItem>

                                {!isBusinessPage && (
                                    <NavCategoriesDropdown
                                        initialCategories={sortedCategories}
                                        active={active}
                                        setActive={setActive}
                                    />
                                )}


                            </NavMenu>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <div className="hidden lg:flex items-center">
                                <Button
                                    as={Link}
                                    href="https://knowledge.skilldeck.net/"
                                    target="_blank"
                                    rel="nofollow"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                >
                                    SaaS Guide
                                </Button>
                            </div>
                            <div className="hidden lg:flex items-center">
                                <Button
                                    as={Link}
                                    href="/register"
                                    rel="nofollow"
                                    variant="primary"
                                    size="sm"
                                    className="flex items-center gap-2 rounded-full"
                                >
                                    {ctaText}
                                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            data-no-loader="true"
                            onClick={openMenu}
                            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Slide-in Drawer */}
            <MobileMenu
                isMenuOpen={isMenuOpen}
                closeMenu={closeMenu}
                ctaText={ctaText}
                categories={categories}
                servicesCategories={servicesCategories}
                isHomePage={isHomePage}
                isCompaniesLoading={isCompaniesLoading}
                handleCompaniesClick={handleCompaniesClick}
                handleNavClick={handleNavClick}
            />
        </>
    );
}

export default MainNav;
