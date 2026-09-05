"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Motion primitives for the /service-demo concept, built on `framer-motion`
 * (already a project dependency) rather than pulled from the Framer marketplace
 * — those are Framer-project modules and cannot be imported into a Next app.
 *
 * Every primitive here honours `prefers-reduced-motion` by rendering its final
 * state immediately, so the page is fully usable with animation switched off.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
    children: React.ReactNode;
    /** Seconds of stagger, for items revealed as a group. */
    delay?: number;
    /** Direction the element travels from. */
    from?: "bottom" | "left" | "right" | "scale";
    className?: string;
}

const OFFSETS = {
    bottom: { y: 24, x: 0, scale: 1 },
    left: { y: 0, x: -28, scale: 1 },
    right: { y: 0, x: 28, scale: 1 },
    scale: { y: 12, x: 0, scale: 0.97 },
};

/** Fade-and-rise on first scroll into view. Fires once. */
export function Reveal({ children, delay = 0, from = "bottom", className = "" }: RevealProps) {
    const reduced = useReducedMotion();
    const offset = OFFSETS[from];

    if (reduced) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.6, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Counts a metric up when it scrolls into view.
 *
 * Values arrive already formatted ("12M+", "99.95%", "<15 min"), so the numeric
 * run is isolated, animated, and re-inserted between whatever prefix and suffix
 * it came with — decimal places preserved from the source string.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
    const reduced = useReducedMotion();

    // Parsed from the string once per value. Deriving these inline meant the
    // regex match — a fresh array every render — sat in an effect's dependency
    // list, so the effect re-ran on every render the animation itself caused and
    // reset the counter to zero forever.
    const parsed = useMemo(() => {
        const match = value.match(/^(\D*?)([\d.,]+)(.*)$/);
        if (!match) return null;

        const [, prefix, rawNumber, suffix] = match;
        const target = Number(rawNumber.replace(/,/g, ""));
        if (Number.isNaN(target)) return null;

        return {
            prefix,
            suffix,
            rawNumber,
            target,
            decimals: rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0,
            grouped: rawNumber.includes(","),
        };
    }, [value]);

    // Server-renders the real figure: a no-JS reader (and a crawler) should see
    // "12M+", not "0M+". The client drops it to zero on mount so the count still
    // starts from nothing.
    const [display, setDisplay] = useState(() => parsed?.rawNumber ?? value);

    useEffect(() => {
        if (!parsed || reduced) return;

        const { target, decimals, grouped } = parsed;
        const format = (n: number) => {
            const fixed = n.toFixed(decimals);
            return grouped ? Number(fixed).toLocaleString("en-US") : fixed;
        };

        // Every dependency here is a primitive or a memoised object, so this runs
        // on mount and again when the element scrolls in — never on its own updates.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDisplay(format(0));
        if (!inView) return;

        const controls = animate(0, target, {
            duration: 1.4,
            ease: EASE,
            onUpdate: (latest) => setDisplay(format(latest)),
        });

        return () => controls.stop();
    }, [inView, parsed, reduced]);

    if (!parsed) return <span className={className}>{value}</span>;

    return (
        <span ref={ref} className={className}>
            {parsed.prefix}
            {display}
            {parsed.suffix}
        </span>
    );
}

/**
 * Pointer parallax: children drift a few pixels against the cursor.
 *
 * Applied to a container, so it composes with the CSS float animation on the
 * cards inside instead of competing for the same `transform`.
 */
export function ParallaxLayer({
    children,
    strength = 12,
    className = "",
}: {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}) {
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 60, damping: 18, mass: 0.6 });
    const springY = useSpring(y, { stiffness: 60, damping: 18, mass: 0.6 });

    if (reduced) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            style={{ x: springX, y: springY }}
            onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const relX = (event.clientX - rect.left) / rect.width - 0.5;
                const relY = (event.clientY - rect.top) / rect.height - 0.5;
                x.set(-relX * strength);
                y.set(-relY * strength);
            }}
            onPointerLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            {children}
        </motion.div>
    );
}

/** Shared transition for the use-case panel swap. */
export const panelTransition = { duration: 0.35, ease: EASE };
export { motion as demoMotion };
