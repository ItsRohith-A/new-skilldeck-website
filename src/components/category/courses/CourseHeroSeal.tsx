import Image from "next/image";

/** Trust seals in `public/course`, converted to webp for weight. */
const SEALS = [
    { src: "/course/seal1.webp", alt: "Lowest price from top training institutes" },
    { src: "/course/seal2.webp", alt: "Verified training institutes" },
    { src: "/course/seal3.webp", alt: "Trusted training marketplace" },
    { src: "/course/seal4.webp", alt: "Compare before you enrol" },
];

/**
 * Stable per course rather than `Math.random()`: the server and the client must
 * pick the same seal or React reports a hydration mismatch, and a badge that
 * changes on every re-render reads as a glitch.
 */
function sealFor(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    return SEALS[Math.abs(hash) % SEALS.length];
}

interface CourseHeroSealProps {
    /** Course slug, so one course always shows the same seal. */
    seed: string;
    className?: string;
}

export default function CourseHeroSeal({ seed, className = "" }: CourseHeroSealProps) {
    const seal = sealFor(seed);

    return (
        <Image
            src={seal.src}
            alt={seal.alt}
            width={256}
            height={256}
            unoptimized={true}
            className={`w-20 h-20 md:w-28 md:h-28 2xl:w-32 2xl:h-32 drop-shadow-lg select-none pointer-events-none  ${className}`}
            priority={false}
        />
    );
}
