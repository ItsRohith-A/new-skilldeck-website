/**
 * Stock photography for the /service-demo concept.
 *
 * Every entry below was opened and checked against the slot it fills — no
 * picking by filename. Rejected along the way: an empty classroom, a stacked-
 * hands teamwork cliché, a café conversation and a phone screenshot, none of
 * which say anything about running a training business.
 *
 * Central map so the whole page swaps to licensed or owned photography by
 * editing one file. `w` and `q` are set per slot to the largest size that slot
 * renders, so the CDN resizes before `next/image` does.
 *
 * Placeholder imagery only: replace before this direction ships.
 */
function unsplash(id: string, width: number, quality = 70) {
    return `https://images.unsplash.com/${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export const demoImages = {
    /** Three learners working through a course together on laptops. */
    heroCourse: {
        src: unsplash("photo-1522202176988-66273c2fd55f", 640),
        alt: "Learners working through a course together on laptops",
    },
    /** Instructor portrait, standing in for the live-session feed. */
    heroMentor: {
        src: unsplash("photo-1573497019940-1c28c88b4f3e", 560),
        alt: "Instructor hosting a live online session",
    },
    /** Mentor and learner building something on screen together. */
    builder: {
        src: unsplash("photo-1531482615713-2afd69097998", 900),
        alt: "Two colleagues designing a programme structure on screen",
    },
    /** Counsellor and colleague closing an enrolment at the desk. */
    admissions: {
        src: unsplash("photo-1600880292203-757bb62b4baf", 900),
        alt: "Admissions team celebrating a confirmed enrolment",
    },
    /** Instructor presenting to a seated cohort with slides running. */
    classroom: {
        src: unsplash("photo-1524178232363-1fb2b075b655", 900),
        alt: "Instructor delivering a session to a seated cohort",
    },
    /** Team reviewing results together in a working session. */
    outcomes: {
        src: unsplash("photo-1552581234-26160f608093", 900),
        alt: "Team reviewing cohort performance in a working session",
    },
    /** An actual analytics dashboard on screen. */
    intelligence: {
        src: unsplash("photo-1551288049-bebda4e38f71", 900),
        alt: "Analytics dashboard showing trends and cohort metrics",
    },
    /** Engineer walking a server aisle with a tablet. */
    security: {
        src: unsplash("photo-1573164713988-8665fc963095", 800),
        alt: "Engineer reviewing infrastructure in a data centre",
    },
    /** Team planning their next cohort around a shared table. */
    cta: {
        src: unsplash("photo-1521737711867-e3b97375f902", 1000),
        alt: "Training team planning their next cohort together",
    },
    useCases: {
        /** Students at desks in a coaching-institute classroom. */
        institutes: {
            src: unsplash("photo-1571260899304-425eee4c7efc", 800),
            alt: "Students at desks in a coaching institute classroom",
        },
        /** Professionals taking notes through a workshop. */
        corporate: {
            src: unsplash("photo-1517048676732-d65bc937f952", 800),
            alt: "Professionals taking notes during a corporate workshop",
        },
        /** University building and lawn. */
        universities: {
            src: unsplash("photo-1562774053-701939374585", 800),
            alt: "University campus building",
        },
        /** Independent educator working to camera at a laptop. */
        creators: {
            src: unsplash("photo-1541178735493-479c1a27ed24", 800),
            alt: "Independent educator recording a lesson at a laptop",
        },
    },
    /** Checked headshots, used for avatar rows and the pipeline's lead cards. */
    avatars: [
        { src: unsplash("photo-1494790108377-be9c29b29330", 96, 60), alt: "" },
        { src: unsplash("photo-1507003211169-0a1dd7228f2d", 96, 60), alt: "" },
        { src: unsplash("photo-1438761681033-6461ffad8d80", 96, 60), alt: "" },
        { src: unsplash("photo-1560250097-0b93528c311a", 96, 60), alt: "" },
        { src: unsplash("photo-1544005313-94ddf0286df2", 96, 60), alt: "" },
        { src: unsplash("photo-1633332755192-727a05c4013d", 96, 60), alt: "" },
        { src: unsplash("photo-1580489944761-15a19d654956", 96, 60), alt: "" },
    ],
} as const;
