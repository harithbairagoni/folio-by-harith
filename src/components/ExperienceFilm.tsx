import { Fragment, useRef } from "react";
import { motion, useInView, useSpring, useTransform, type MotionValue } from "motion/react";
import portfolio from "../../portfolio.json";
import type { Kind } from "../data/experience-beats";
import "./experience-film.css";

type Shot = { source: number; alt: string; reveal: [number, number] };

const foundations = "Exploded concrete foundations and installation pads";
const equipment = "Steel tanks and a distillation column aligned above foundation pads";
const facility = "Connected ethanol equipment and illustrative clearance papers";

const stories: Record<Kind, { company: string; shots: Shot[]; zoom: number[]; focus: string[] }> = {
  ethanol: {
    company: "VIVEK BIO PRODUCTS PVT.LTD",
    shots: [
      { source: 2, alt: facility, reveal: [0, 0] },
      { source: 0, alt: foundations, reveal: [.13, .94] },
      { source: 1, alt: equipment, reveal: [1.13, 1.94] },
      { source: 2, alt: facility, reveal: [2.13, 2.94] },
    ],
    zoom: [1, 1.035, 1.055, 1.13, 1],
    focus: ["50% 50%", "50% 65%", "52% 48%", "29% 76%", "50% 50%"],
  },
  land: {
    company: "LANDSAFE REAL ESTATE TECHNOLOGY PVT.LTD",
    shots: [
      { source: 0, alt: "Fictional parcel with scattered paperwork and overlapping boundary lines", reveal: [0, 0] },
      { source: 1, alt: "Survey instrument projecting a scan over a fictional field boundary", reveal: [.13, .94] },
      { source: 2, alt: "Field evidence and report sheets layered above the parcel", reveal: [1.13, 1.94] },
    ],
    zoom: [1, 1.055, 1, 1.09],
    focus: ["50% 55%", "65% 59%", "50% 50%", "50% 24%"],
  },
  research: {
    company: "RAJNEETHI STRATEGIES (RASTRA)",
    shots: [
      { source: 0, alt: "Illustrated Telangana relief map with abstract markers", reveal: [0, 0] },
      { source: 1, alt: "Illustrative arcs connecting research inputs over the map", reveal: [.13, .94] },
      { source: 2, alt: "Sample briefing documents alongside the illustrated map", reveal: [1.13, 1.94] },
    ],
    zoom: [1, 1.05, 1, 1.075],
    focus: ["50% 57%", "50% 57%", "50% 50%", "67% 32%"],
  },
};

function FilmFrame({ file, shot, kind, phase, still, beat }: {
  file: string; shot: Shot; kind: Kind; phase: MotionValue<number>; still: boolean; beat: number;
}) {
  const [start, end] = shot.reveal;
  const amount = useTransform(phase, [start, end || 1], [0, 1], {
    ease: progress => progress * progress * (3 - 2 * progress),
  });
  const maskImage = useTransform(amount, progress => {
    if (progress >= .999) return "none";
    const edge = 115 * progress - 9;
    if (kind === "research") {
      return `radial-gradient(ellipse 80% 92% at 50% 55%, #000 ${edge}%, transparent ${edge + 17}%)`;
    }
    const angle = kind === "ethanol" ? 6 - 12 * progress : 103 - 17 * progress;
    return `linear-gradient(${angle}deg, #000 ${edge}%, transparent ${edge + 17}%)`;
  });
  const opacity = useTransform(amount, [0, .18, 1], [0, .85, 1]);
  const src = file.replace(/^public/, "");
  const first = start === end;
  return <motion.div className="film-frame" style={first ? undefined : {
    maskImage: still ? undefined : maskImage,
    opacity: still ? Number(beat >= (start + end) / 2) : opacity,
  }}>
    <motion.img
      src={src}
      srcSet={`${src.replace("-1664", "-768")} 768w, ${src} 1664w`}
      sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1650px) 62vw, 1030px"
      width={1664}
      height={929}
      loading={first ? "lazy" : "eager"}
      decoding="async"
      alt={shot.alt}
    />
  </motion.div>;
}

export default function ExperienceFilm({ kind, phase, still, beat }: {
  kind: Kind; phase: MotionValue<number>; still: boolean; beat: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const nearby = useInView(ref, { once: true, margin: "500px" });
  const { company, shots, zoom, focus } = stories[kind];
  const files = portfolio.experience.find(item => item.company === company)!.shots!;
  const playhead = useSpring(phase, { stiffness: 550, damping: 47, restDelta: .002 });
  const stops = zoom.map((_, index) => index);
  const scale = useTransform(playhead, stops, zoom);
  const transformOrigin = useTransform(playhead, stops, focus);
  const shotIndex = shots.reduce((index, shot, i) => beat >= (shot.reveal[0] + shot.reveal[1]) / 2 ? i : index, 0);
  return <figure ref={ref} className={`story-art experience-film film-${kind}`}>
    <div className="film-screen" role="img" aria-label={shots[shotIndex].alt}>
      <div className="film-crop" aria-hidden="true">
        <motion.div className="film-camera" style={still ? undefined : { scale, transformOrigin }}>
          {shots.map((shot, index) => (index === 0 || nearby) && <Fragment key={index}>
            <FilmFrame file={files[shot.source]} shot={shot} kind={kind} phase={playhead} still={still} beat={beat} />
          </Fragment>)}
        </motion.div>
      </div>
    </div>
  </figure>;
}
