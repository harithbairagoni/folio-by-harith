import { Fragment, useRef } from "react";
import { motion, useInView, useTransform, type MotionValue } from "motion/react";
import portfolio from "../../portfolio.json";
import type { Kind } from "../data/experience-beats";
import "./experience-film.css";

type Shot = { alt: string; reveal: [number, number] };

const stories: Record<Kind, { company: string; shots: Shot[] }> = {
  ethanol: {
    company: "VIVEK BIO PRODUCTS PVT.LTD",
    shots: [
      { alt: "Exploded concrete foundations and installation pads on an illustrative site grid", reveal: [0, 0] },
      { alt: "Steel tanks and a distillation column aligned above the foundation pads", reveal: [1.18, 1.94] },
      { alt: "Connected ethanol equipment and a tray of illustrative clearance papers", reveal: [2.23, 2.94] },
    ],
  },
  land: {
    company: "LANDSAFE REAL ESTATE TECHNOLOGY PVT.LTD",
    shots: [
      { alt: "Fictional parcel with scattered paperwork and overlapping boundary lines", reveal: [0, 0] },
      { alt: "Survey instrument projecting a scan over a fictional field boundary", reveal: [.12, .94] },
      { alt: "Layers of field evidence and report sheets above the parcel", reveal: [1.86, 2.94] },
    ],
  },
  research: {
    company: "RAJNEETHI STRATEGIES (RASTRA)",
    shots: [
      { alt: "Illustrated Telangana relief map with abstract markers", reveal: [0, 0] },
      { alt: "Illustrative arcs connecting research inputs over the map", reveal: [.16, .96] },
      { alt: "Stacks of sample briefing documents alongside the illustrated map", reveal: [2.06, 2.94] },
    ],
  },
};

function FilmFrame({ file, shot, kind, phase, still, beat }: {
  file: string; shot: Shot; kind: Kind; phase: MotionValue<number>; still: boolean; beat: number;
}) {
  const [start, end] = shot.reveal;
  const amount = useTransform(phase, [start, end || 1], [0, 1]);
  const clipPath = useTransform(amount, progress => {
    if (progress >= .999) return "inset(0)";
    if (progress <= .001) return "inset(0 0 100% 0)";
    if (kind === "research") return `ellipse(${progress * 79}% ${progress * 89}% at 50% 54%)`;
    const edge = 110 * (1 - progress);
    if (kind === "ethanol") return `polygon(0 ${edge - 10}%, 100% ${edge}%, 100% 100%, 0 100%)`;
    return `polygon(0 0, ${110 - edge}% 0, ${100 - edge}% 100%, 0 100%)`;
  });
  const opacity = useTransform(amount, [0, .12, 1], [0, .92, 1]);
  const edge = useTransform(amount, [0, 1], kind === "ethanol" ? ["112%", "-12%"] : ["-12%", "112%"]);
  const beamOpacity = useTransform(amount, [0, .12, .84, 1], [0, .83, .83, 0]);
  const src = file.replace(/^public/, "");
  const first = start === end;
  return <div className="film-frame">
    <motion.img
      src={src}
      srcSet={`${src.replace("-1664", "-768")} 768w, ${src} 1664w`}
      sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1650px) 62vw, 1030px"
      width={1664}
      height={929}
      loading={first ? "lazy" : "eager"}
      decoding="async"
      alt={shot.alt}
      style={first ? undefined : {
        clipPath: still ? (beat >= (start + end) / 2 ? "inset(0)" : "inset(0 0 100% 0)") : clipPath,
        opacity: still ? undefined : opacity,
      }}
    />
    {!first && !still && kind !== "research" && <motion.i
      className="film-scan"
      style={kind === "land" ? { x: edge, opacity: beamOpacity } : { y: edge, opacity: beamOpacity }}
    />}
  </div>;
}

export default function ExperienceFilm({ kind, phase, still, beat }: {
  kind: Kind; phase: MotionValue<number>; still: boolean; beat: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const nearby = useInView(ref, { once: true, margin: "500px" });
  const { company, shots } = stories[kind];
  const files = portfolio.experience.find(item => item.company === company)!.shots!;
  const scale = useTransform(phase, [0, 1, 2, 3, 4], [1, 1.055, 1.009, 1.043, 1.015]);
  const shotIndex = shots.reduce((index, shot, i) => beat >= (shot.reveal[0] + shot.reveal[1]) / 2 ? i : index, 0);
  return <figure ref={ref} className={`story-art experience-film film-${kind}`}>
    <div className="film-screen" role="img" aria-label={shots[shotIndex].alt}>
      <motion.div className="film-camera" aria-hidden="true" style={{ scale: still ? 1 : scale }}>
        {shots.map((shot, index) => (index === 0 || nearby) && <Fragment key={files[index]}><FilmFrame file={files[index]} shot={shot} kind={kind} phase={phase} still={still} beat={beat} /></Fragment>)}
      </motion.div>
    </div>
  </figure>;
}
