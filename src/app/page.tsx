import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/Home";
import { fetchPlans } from "@/lib/plans";
import { getPartnerLogos } from "@/lib/partners";
import { getAllServices } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "World's 1st Fully Automated Plug & Play Platform For Training Institutes",
    description: "Automate your marketing, sales, operations and various other functional departments at 5X times lesser cost and Skyrocket your leads and sales. 4X times faster growth & 6X higher conversions.",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "https://skilldeck.net/",
    },
    openGraph: {
        type: "website",
        url: "https://skilldeck.net/",
        title: "World's 1st Fully Automated Plug & Play Platform For Training Institutes",
        description: "Automate your marketing, sales, operations and various other functional departments at 5X times lesser cost and Skyrocket your leads and sales. 4X times faster growth & 6X higher conversions.",
        images: ["https://skilldeck.net/og-image.png"],
    },
};

export const revalidate = false; // Pure On-Demand ISR: cached permanently until webhook tag/path purge

export default async function Page() {
    const [plans, partnerLogos, services] = await Promise.all([
        fetchPlans("INR"),
        getPartnerLogos(),
        getAllServices(),
    ]);

    const HOME_FAQS = [
        {
            title: "Why are training Institutes moving to SkillDeck?",
            value: "Training Institutes are moving to SkillDeck because it is not just another LMS or website builder — it is a complete Operating System for Training Institutes. SkillDeck combines LMS, CRM, industry-specific CMS, class management, event management, marketing automation, quizzes, SEO automation, lead management, websites, analytics, and 100+ other business-critical features into a single plug-and-play platform.<br/><br/>Most training Institutes today struggle with managing multiple tools, high software costs, technical complexity, poor website performance, and lack of automation. SkillDeck eliminates these problems by providing enterprise-grade infrastructure that is usually available only to multi-million-dollar training Institutes. With SkillDeck, even small and medium training institutes can access world-class technology, high-performing websites, automation systems, and scalable operations at an affordable cost."
        },
        {
            title: "Which SkillDeck plan is best for a small training company?",
            value: "For small and growing training Institutes, the SkillDeck Start Plan is usually the best option. It is designed to provide access to all the essential features required to launch and scale a modern training business without making a heavy investment in technology or operations.<br/><br/>Unlike many platforms that restrict features based on pricing tiers, SkillDeck focuses on helping businesses grow from day one. The Start Plan includes access to LMS, CRM, website management, class scheduling, event management, automation tools, marketing features, and much more. As your business scales, you can easily upgrade or switch plans anytime based on your requirements, usage, and business goals without any disruption."
        },
        {
            title: "Can I get lifetime access to the SkillDeck platform?",
            value: "Yes, SkillDeck offers lifetime access options for businesses that prefer long-term ownership and deployment flexibility. You can also choose to deploy the platform on your own server infrastructure depending on your business requirements and scalability needs.<br/><br/>This option is especially useful for large training Institutes, enterprises, institutions, or businesses looking for complete infrastructure ownership, higher customization control, and long-term operational stability. To know more about lifetime access pricing, deployment options, and infrastructure support, you can connect with the SkillDeck business team for a customized proposal."
        },
        {
            title: "Can I customize my website with SkillDeck?",
            value: "Yes, SkillDeck is built with flexibility and scalability in mind. The platform acts as a powerful backend operating system and infrastructure layer that exposes APIs and configurable modules, allowing you to build and customize your website exactly the way you want.<br/><br/>Whether you need a simple training website, a high-converting landing page ecosystem, a custom UI/UX experience, or a fully branded enterprise training portal, SkillDeck provides the foundation to support it. Businesses can use SkillDeck’s built-in website capabilities or integrate custom frontend designs while still leveraging all backend features such as LMS, CRM, automation, payments, events, analytics, and lead management."
        },
        {
            title: "Can I integrate SkillDeck with my existing website?",
            value: "Yes, SkillDeck is designed as a plug-and-play platform and can be integrated with your existing website. You can generate external API keys and connect various SkillDeck modules such as LMS, CRM, class management, events, quizzes, payments, automation, and marketing systems to your current website infrastructure.<br/><br/>This flexibility allows training Institutes to continue using their existing website design and branding while benefiting from SkillDeck’s powerful backend ecosystem. It is an ideal solution for businesses that do not want to rebuild their websites from scratch but still want access to enterprise-level training business infrastructure."
        },
        {
            title: "Does SkillDeck provide documentation, tutorials, or a knowledge base?",
            value: "Yes, SkillDeck provides a dedicated knowledge base and support documentation portal to help users understand and utilize the platform effectively. You can access the complete documentation at knowledge.skilldeck.net.<br/><br/>The knowledge base includes step-by-step guides, onboarding tutorials, feature explanations, setup instructions, module configurations, best practices, and operational workflows. Whether you are setting up your platform for the first time or exploring advanced automation features, the documentation is designed to make the onboarding and usage experience smooth for both technical and non-technical users."
        },
        {
            title: "Is the SkillDeck Marketplace really useful for training Institutes?",
            value: "Yes, the SkillDeck Marketplace is one of the platform’s most valuable features for training Institutes and coaching businesses. Unlike generic advertising platforms, the SkillDeck Marketplace is built exclusively for training institutes, trainers, academies, and educational businesses.<br/><br/>This means the audience visiting the marketplace is already searching for courses, training programs, certifications, and learning opportunities. Many businesses have found SkillDeck Marketplace leads to be significantly more targeted and conversion-focused compared to traditional digital advertising channels. Training Institutes can list programs, increase visibility, feature their institute, promote specific courses, and attract high-intent learners through an industry-focused ecosystem."
        },
        {
            title: "The course I want to promote is not listed on SkillDeck. What should I do?",
            value: "If the course or category you want to promote is not currently available on SkillDeck, you can easily request it through the platform support system. Simply raise a support ticket through the website or send an email to hello@skilldeck.net with the details of the course or training category you want to list.<br/><br/>The SkillDeck team continuously expands its marketplace and training categories based on industry demand and user requests. In most cases, new categories or course listings are reviewed and made available within 1–2 working days to ensure training Institutes can start promoting their programs quickly."
        },
        {
            title: "How is SkillDeck different from a traditional LMS platform?",
            value: "Traditional LMS platforms mainly focus on course delivery and learning management. SkillDeck goes far beyond that by functioning as a complete Operating System for Training Institutes.<br/><br/>In addition to LMS capabilities, SkillDeck includes CRM, lead management, SEO automation, event management, websites, analytics, marketing automation, payment workflows, student management, marketplace visibility, quizzes, certifications, and operational tools required to run and scale an entire training business. Instead of managing multiple disconnected software tools, SkillDeck centralizes everything into one unified ecosystem."
        },
        {
            title: "Can SkillDeck support global training businesses?",
            value: "Yes, SkillDeck is built to support global training Institutes and international learners. The platform supports multiple currencies, global event management, online and offline classes, timezone-based scheduling, scalable infrastructure, and digital-first training operations.<br/><br/>Whether you are targeting learners locally or globally, SkillDeck helps businesses manage enrollments, classes, marketing, operations, and websites efficiently for audiences across different regions and countries."
        },
        {
            title: "Does SkillDeck help with SEO and digital marketing?",
            value: "Yes, SkillDeck includes built-in SEO automation and digital marketing capabilities designed specifically for training businesses. Most training Institutes struggle to generate organic traffic because their websites are not optimized for search engines or lead generation.<br/><br/>SkillDeck helps solve this problem by offering SEO-friendly architecture, automated optimization features, landing page capabilities, marketing automation workflows, and conversion-focused infrastructure. This helps training Institutes improve online visibility, attract organic leads, and reduce dependency on expensive paid advertising channels."
        },
        {
            title: "Is SkillDeck suitable for individual trainers and coaches?",
            value: "Absolutely. SkillDeck is suitable for individual trainers, freelancers, coaches, academies, and enterprise-level training Institutes. Even solo trainers can access enterprise-grade technology infrastructure without needing a large technical team or expensive development resources.<br/><br/>The platform allows trainers to launch professional websites, manage students, schedule classes, deliver courses, automate operations, collect payments, and market their programs efficiently — all from a single platform."
        },
        {
            title: "Can SkillDeck reduce operational costs for training Institutes?",
            value: "Yes, one of SkillDeck’s biggest advantages is cost optimization. Most training Institutes spend heavily on multiple tools for LMS, CRM, websites, marketing automation, analytics, event management, and operations.<br/><br/>SkillDeck consolidates these systems into one unified platform, significantly reducing software expenses, integration challenges, maintenance costs, and operational complexity. Businesses can operate more efficiently while achieving enterprise-level capabilities at a fraction of the traditional cost."
        }
    ];

    const validPrices = plans
        .map(p => Number(p.discountedPrice ?? p.price ?? 0))
        .filter(price => price > 0);
    const lowPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": "https://skilldeck.net/#software",
        "name": "SkillDeck",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "url": "https://skilldeck.net/",
        "image": "https://skilldeck.net/logos/mainlogo.svg",
        "description": "World's 1st Fully Automated Plug & Play Platform For Training Institutes. Automate your marketing, sales, operations, LMS, CRM, websites, and business functional departments.",
        "publisher": {
            "@id": "https://skilldeck.net/#organization"
        },
        ...(lowPrice > 0 && {
            "offers": {
                "@type": "Offer",
                "price": lowPrice,
                "priceCurrency": "INR",
                "url": "https://skilldeck.net/pricing"
            }
        })
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": "https://skilldeck.net/#faq",
        "mainEntity": HOME_FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.title,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.value.replace(/<br\s*[\/]?>/gi, " ").replace(/<[^>]+>/g, "").trim()
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <MainNav />

            <main>
                <HeroSection plans={plans} faqs={HOME_FAQS} partnerLogos={partnerLogos} services={services} />
            </main>

            <Footer />
        </>
    );
}
