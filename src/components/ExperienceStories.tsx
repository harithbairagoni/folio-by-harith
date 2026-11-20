import { Fragment, lazy, Suspense, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Check, ClipboardList, FileSearch, Files, Flag, Landmark, MapPinned, MessageSquare, Plus, Truck, Users } from "lucide-react";
import { beats, nominationBeats, type Beat, type Kind } from "../data/experience-beats";
import ExperienceFilm from "./ExperienceFilm";
import samples from "../data/work-samples.json";
import "./experience-stories.css";

const PlantScene = lazy(() => import("./PlantScene"));
const routes: Record<Kind, string[]> = {
  ethanol: [
    "M19 78 C19 65 29 65 35 55",
    "M50 78 C50 68 57 64 56 50",
    "M81 78 C81 66 77 61 75 55",
  ],
  land: [
    "M28 31 C34 31 36 41 44 45",
    "M19 76 C35 76 37 61 54 61",
    "M54 61 C60 61 61 51 67 51",
  ],
  research: [
    "M34 32 C42 32 43 25 51 25",
    "M34 56 C42 56 43 46 51 46",
    "M43 64 C54 64 55 57 64 57",
  ],
};

function StoryMotion({ kind, phase, entry, children }: {
  kind: Kind; phase: MotionValue<number>; entry: MotionValue<number>; children: ReactNode;
}) {
  const first = useTransform(phase, [0.06, 0.92], [0, 1]);
  const second = useTransform(phase, [1.06, 1.92], [0, 1]);
  const third = useTransform(phase, [2.06, 2.92], [0, 1]);
  const finish = useTransform(phase, [3.06, 3.92], [0, 1]);
  return <motion.div className="story-motion" style={{
    "--entry": entry, "--first": first, "--second": second, "--third": third, "--finish": finish, "--nomination-output": second,
  }}>
    {children}
    <svg className="story-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {routes[kind].map((route, index) => <motion.path key={route} d={route} pathLength={[first, second, third][index]} initial={false} />)}
    </svg>
  </motion.div>;
}

function PaperLines() {
  return <div className="paper-lines" aria-hidden="true"><i /><i /><i /><i /></div>;
}

const workstreams = [
  { name: "Civil works", icon: MapPinned, items: ["Site readiness", "Foundations", "Installation handoff"] },
  { name: "Mechanical", icon: Truck, items: ["Vendor coordination", "Equipment sequencing", "Installation"] },
  { name: "Clearances", icon: ClipboardList, items: ["Requirements", "Document review", "Follow-up"] },
];

function PlantGraphic({ beat, phase, still }: { beat: number; phase: MotionValue<number>; still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "300px", once: true });
  return <div ref={ref} className="story-art plant-art" data-beat={beat} data-track={beat > 0 && beat < 4 ? beat - 1 : "all"}>
    <div className="story-plant-model">
      <img className="story-plant-poster" src="/photos/plant-poster.webp" alt="Illustrative ethanol plant" width="730" height="560" loading="lazy" />
      {near && !still && <Suspense fallback={null}><PlantScene phase={phase} /></Suspense>}
    </div>
    <div className="work-lanes">
      {workstreams.map(({ name, icon: Icon, items }, index) => <div key={name} className="work-lane" data-lane={index + 1}>
        <Icon size={17} /><div><strong>{name}</strong><span>{items.join(" · ")}</span></div>
      </div>)}
    </div>
    <div className="clearance-review" aria-hidden={beat !== 3}>
      <ClipboardList size={15} />
      <div><strong>Clearance dependencies</strong><span>Requirements → review → follow-up</span></div>
    </div>
    <div className="plant-readiness"><Flag size={14} /> Readiness review · Open items tracked</div>
    <span className="art-note">Illustrative sequence. Plant geometry and progress are conceptual.</span>
  </div>;
}

function Parcel() {
  return <svg className="parcel-drawing" viewBox="0 0 600 430" aria-hidden="true">
    <g className="survey-grid" fill="none" stroke="#bbc0a9" strokeWidth="1">
      {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${55 + i * 65} 90l160 230M70 ${120 + i * 35}l400 -50`} />)}
    </g>
    <path d="M70 290 330 370 535 244 280 169Z" fill="#c7ccb1" />
    <path d="M70 290v14l260 80v-14ZM330 370l205-126v14L330 384" fill="#a7b294" />
    <path d="M70 307 330 387 535 261" fill="none" stroke="#fff9e9" strokeWidth="10" />
    <path d="M127 258 255 186 456 239 341 326Z" fill="#dbe0c4" stroke="#42634e" strokeWidth="2" />
    <path d="M155 259 258 202 422 245 338 309Z" fill="none" stroke="#82987a" strokeWidth="1" strokeDasharray="6 6" />
    <g className="field-observation">
      <path className="survey-boundary" d="M127 258 255 186 479 241 363 333Z" fill="none" stroke="#ac5939" strokeWidth="3" pathLength="1" />
      {[[127,258],[255,186],[479,241],[363,333]].map(([x,y], i) => <g key={i} className="survey-point" style={{ "--point": i } as CSSProperties}><path d={`M${x} ${y}v-30`} stroke="#405c48" strokeWidth="4" /><circle cx={x} cy={y-30} r="5" fill="#df9b3b" /></g>)}
      <path d="M479 235l25-57h42" fill="none" stroke="#ac5939" strokeWidth="1.5" /><circle cx="479" cy="235" r="7" fill="#ac5939" />
    </g>
    <g transform="translate(165 180)" stroke="#405846" strokeWidth="4" strokeLinejoin="round">
      <path d="M0 0l-28 90M0 0l27 90M0 0l0 75" fill="none" />
      <rect x="-14" y="-30" width="28" height="35" rx="3" fill="#d6a647" />
      <rect x="-24" y="-24" width="48" height="14" rx="3" fill="#46694f" />
      <circle cx="19" cy="-17" r="8" fill="#f9f4e4" />
    </g>
  </svg>;
}

function LandGraphic({ beat }: { beat: number }) {
  return <div className="story-art land-art" data-beat={beat}>
    <div className="land-evidence">
      <span className="object-label">Records to review</span>
      {["Ownership chain", "Revenue records", "Encumbrance history"].map((label, i) => <div className="record-slip" key={label} style={{ "--slip": i } as CSSProperties}><Files size={17} /><span>{label}</span><span className="record-check">{beat >= 2 ? <Check size={15} /> : <FileSearch size={15} />}</span></div>)}
      <div className="missing-record"><FileSearch size={15} /> Missing record? Follow up.</div>
    </div>
    <div className="land-field"><Parcel /><span className="field-label"><MapPinned size={15} /> Field &amp; GIS observations</span>
      <span className="boundary-question"><Flag size={13} /> Boundary question retained for review</span>
    </div>
    <div className="legal-lane"><Landmark size={20} /><span>Legal review<strong>Separate specialist checks</strong></span><ArrowRight size={18} /></div>
    <div className="land-report">
      <img src="/brand/landsafe-logo.webp" alt="LandSafe" width="336" height="192" />
      <span>PROPERTY REVIEW</span><h4>One report.<br />Clear next steps.</h4><PaperLines />
      <div className="report-entry"><Check size={14} /> Evidence organized</div>
      <div className="report-entry"><Check size={14} /> Checks brought together</div>
      <div className="report-entry report-question"><Flag size={14} /> Further review</div>
      <div className="report-tabs"><span>Records</span><span>Observations</span><span>Next actions</span></div>
    </div>
    <div className="land-owner"><Users size={17} /><span>My role<strong>Connect the verification work</strong></span></div>
    <span className="art-note">Fictional parcel and recreated records. A report is not a title guarantee.</span>
  </div>;
}

function ResearchGraphic({ beat, nomination = false }: { beat: number; nomination?: boolean }) {
  const inputs = nomination ? ["Profile material", "Professional record", "Supporting records"] : ["Field & community", "Constituency research", "Policy & media"];
  const output = nomination ? ["Profile", "Public service", "Supporting material"] : ["Question", "Evidence", "Implication"];
  return <div className={`story-art research-art ${nomination ? "is-nomination" : ""}`} data-beat={beat}>
    <div className="research-context">
      {nomination ? <div className="dossier-outline"><Landmark size={54} /><span>Legislative Council</span><strong>Nomination portfolio</strong></div> : <><img src="/brand/telangana-map.webp" alt="Telangana geographic context; district boundaries, not constituency data" width="700" height="700" /><span className="map-label">TELANGANA</span><div className="scope-tally"><strong>15</strong><span>constituencies<br />researched</span></div><div className="scope-marks" aria-hidden="true">{Array.from({length:15},(_,i)=><i key={i} style={{ "--mark": i } as CSSProperties} />)}</div></>}
    </div>
    <div className="research-inputs">
      {inputs.map((label, i) => <div className="research-slip" key={label} style={{ "--slip": i } as CSSProperties}>
        {i === 0 ? <MessageSquare size={19} /> : i === 1 ? <FileSearch size={19} /> : <Files size={19} />}<span>{label}</span><PaperLines /><strong className="synthesis-label">{output[i]}</strong>
      </div>)}
    </div>
    <div className="brief-document"><span className="brief-binding" /><span>{nomination ? "NOMINATION PORTFOLIO" : "LEADERSHIP BRIEF"}</span><h4>{nomination ? <>A record,<br />organized.</> : <>Ready for the<br />conversation.</>}</h4>
      {output.map((label,i)=><div className="brief-line" key={label} style={{ "--row": i } as CSSProperties}><span>{label}</span><i style={{transform:`scaleX(${[.85,.65,.75][i]})`}} /></div>)}
      <div className="brief-footer"><Files size={15} />{nomination ? "Prepared for formal proceedings" : "Research → synthesis → briefing"}</div>
    </div>
    <div className="research-owner"><Users size={16} /><span>My contribution<strong>{nomination ? "Organize & prepare the submission" : "Research, synthesize & brief"}</strong></span></div>
    <span className="art-note">{nomination ? "Recreated structure. Preparation does not imply nomination approval." : "Illustrative method. No voter data, targeting or campaign documents."}</span>
  </div>;
}

const stageNames: Record<Kind, string> = {
  ethanol: "Ethanol facility", land: "LandSafe", research: "Political research",
};

const stageEdge = 0.035;

function BeatCopy({ step, index, phase, active }: {
  step: Beat; index: number; phase: MotionValue<number>; active: boolean;
}) {
  // Fade through a readable pose, keeping only one caption visible at a time.
  const opacity = useTransform(phase, [index - .5, index - .29, index + .29, index + .5], [.72, 1, 1, .72]);
  const y = useTransform(phase, [index - .5, index - .29, index + .29, index + .5], [8, 0, 0, -8]);
  return <motion.div className="beat-copy" aria-hidden={!active} style={{ opacity, y }}>
    <h4>{step.action}</h4><p>{step.summary}</p>
  </motion.div>;
}

function Sequence({ kind, filter, render, overrideBeats }: {
  kind: Kind; filter?: ReactNode; render: (beat: number, phase: MotionValue<number>, still: boolean) => ReactNode; overrideBeats?: Beat[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shortViewport, setShortViewport] = useState(false);
  const [beat, setBeat] = useState(0);
  const [manualBeat, setManualBeat] = useState(0);
  const [diagram, setDiagram] = useState(false);
  const manual = Boolean(reduced) || shortViewport;
  const steps = overrideBeats ?? beats[kind];
  const end = steps.length - 1;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const phase = useTransform(scrollYProgress, [0, stageEdge, 1 - stageEdge, 1], [0, 0, end, end]);
  const entry = useTransform(scrollYProgress, [0, .13], [.45, 1]);
  const manualPhase = useMotionValue(0);
  const fullEntry = useMotionValue(1);
  const active = manual ? Math.min(manualBeat, end) : Math.min(beat, end);
  useMotionValueEvent(phase, "change", value => setBeat(previous => {
    const next = Math.round(value);
    return previous === next ? previous : next;
  }));
  useEffect(() => {
    const media = matchMedia("(max-height: 730px), (max-width: 540px) and (max-height: 779px)");
    const update = () => setShortViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (manual) manualPhase.set(active);
  }, [active, manual, manualPhase]);

  function go(index: number) {
    if (manual) {
      setManualBeat(index);
      return;
    }
    const element = ref.current;
    if (!element) return;
    const start = element.getBoundingClientRect().top + window.scrollY;
    const distance = element.clientHeight - window.innerHeight;
    const position = stageEdge + (index / end) * (1 - 2 * stageEdge);
    window.scrollTo({ top: start + distance * position, behavior: "smooth" });
  }

  return <div ref={ref} className={`experience-sequence sequence-${kind}${manual ? " sequence-still" : ""}`} data-story={kind} data-beat={active} data-sc-verify-state={`${kind}:${active}`}>
    <div className="sequence-sticky">
      <div className="story-stage-top">{filter && <div className="story-filter">{filter}</div>}
        <nav className="beat-nav" aria-label={`${stageNames[kind]} stages`}>
          {steps.map((step, i) => <button key={i} type="button" aria-pressed={active === i} onClick={() => go(i)}>{step.title}</button>)}
        </nav>
      </div>
      <div className="story-split">
        <div className="story-narration">
          <span className="stage-context">{stageNames[kind]}</span>
          <div className="beat-caption" id={`${kind}-narration`}>
            {manual
              ? <div className="beat-copy" aria-live="polite"><h4>{steps[active].action}</h4><p>{steps[active].summary}</p></div>
              : steps.map((step, i) => <Fragment key={i}><BeatCopy step={step} index={i} phase={phase} active={i === active} /></Fragment>)}
          </div>
          <div className="story-progress" aria-hidden="true">
            <motion.i style={{ scaleX: manual ? (active + 1) / steps.length : scrollYProgress }} />
          </div>
        </div>
        <div className="experience-visual">
          {diagram || overrideBeats
            ? <StoryMotion kind={kind} phase={manual ? manualPhase : phase} entry={manual ? fullEntry : entry}>
                {render(active, manual ? manualPhase : phase, manual)}
              </StoryMotion>
            : <ExperienceFilm kind={kind} phase={manual ? manualPhase : phase} still={manual} beat={active} />}
          {!overrideBeats && <div className={`film-caption film-caption-${kind}`}>
            <span>{diagram ? "Workflow diagram" : "Generated illustration"}</span>
            <button type="button" aria-pressed={diagram} onClick={() => setDiagram(value => !value)}>
              {diagram ? "View illustrations" : "View workflow diagram"}
            </button>
          </div>}
        </div>
      </div>
    </div>
  </div>;
}

function ChapterBridge({ kind }: { kind: "land" | "research" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 30%"] });
  const draw = useTransform(scrollYProgress, [.1, .94], [0, 1]);
  const angle = useTransform(scrollYProgress, [0, 1], kind === "land" ? [0, -13] : [-13, 0]);
  const plane = useTransform(scrollYProgress, [0, 1], kind === "land" ? [15, -12] : [-12, 8]);
  return <div ref={ref} className={`chapter-bridge bridge-${kind}`} aria-hidden="true">
    <motion.svg viewBox="0 0 680 120" fill="none" style={{ rotate: reduced ? 0 : angle, y: reduced ? 0 : plane }}>
      <path d="M0 30H680 M0 60H680 M0 90H680 M50 0V120 M122 0V120 M194 0V120 M266 0V120 M338 0V120 M410 0V120 M482 0V120 M554 0V120 M626 0V120" className="bridge-grid" />
      <motion.path d={kind === "land" ? "M0 60H194L266 30H410L482 90H680" : "M0 90H194L266 30H410L482 60H680"} pathLength={reduced ? 1 : draw} className="bridge-line" />
    </motion.svg>
  </div>;
}

function ChapterHeading({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 54%"] });
  const y = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [.72, 1]);
  return <motion.header ref={ref} className="visual-chapter-heading" style={reduced ? undefined : { y, opacity }}>
    {children}
  </motion.header>;
}

function Detail({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const openHash = () => {
      if (location.hash === `#${id}` && ref.current) {
        ref.current.open = true;
        requestAnimationFrame(() => ref.current?.scrollIntoView({block:"start"}));
      }
    };
    openHash(); addEventListener("hashchange",openHash);
    return () => removeEventListener("hashchange",openHash);
  },[id]);
  return <details ref={ref} className="experience-detail" id={id}><summary>Explore my work <Plus size={18} /></summary><div className="experience-detail-body">{children}</div></details>;
}

function Metrics({ items }: { items: [string,string][] }) {
  return <><dl className="experience-metrics">{items.map(([value,label])=><div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl><p className="metric-source">Aggregate results as reported in my résumé, separate from these illustrative workflows.</p></>;
}

export default function ExperienceStories() {
  const [nomination, setNomination] = useState(false);
  return <section id="experience" className="experience-section visual-experience">
    <div className="experience-preface section-pad"><p>Some problems live beyond a screen.</p><h2>The work between<br />the <span>workstreams.</span></h2><span>Three ways I turn complexity into action.</span></div>
    <article className="visual-chapter ethanol-chapter" id="ethanol">
      <ChapterHeading><div><span className="experience-company">Vivek Bio Products</span><h3>Keep the work<br /><em>moving together.</em></h3></div><div className="experience-role"><strong>Assistant Project Manager</strong><span>Jul 2024 – Jul 2025</span><p>I coordinated civil, mechanical and clearance workstreams for an ethanol facility.</p></div></ChapterHeading>
      <Sequence kind="ethanol" render={(beat, phase, still) => <PlantGraphic beat={beat} phase={phase} still={still} />} />
      <Detail id="ethanol-deliverable"><Metrics items={[["₹152 Cr","ethanol facility"],["20+","vendors coordinated"],["95%+","schedule adherence"]]} /><div className="detail-columns"><div><h4>Project coordination</h4><p>I worked across site readiness, installation sequencing, vendor coordination and clearance requirements, keeping dependencies and handoffs visible.</p></div><div><h4>Commissioning readiness</h4><p>My résumé reports a 20% improvement in commissioning readiness, a 30% reduction in bottlenecks and a 25% productivity improvement. The animation explains the kind of coordination involved; it does not simulate those results.</p></div></div></Detail>
    </article>
    <ChapterBridge kind="land" />
    <article className="visual-chapter landsafe-chapter" id="landsafe">
      <ChapterHeading><div><img className="landsafe-wordmark" src="/brand/landsafe-logo.webp" alt="LandSafe" width="336" height="192" /><h3>Many checks.<br /><em>One clearer picture.</em></h3></div><div className="experience-role"><strong>Director of Operations &amp; Co-Founder</strong><span>Aug 2025–present</span><p>I connected field, GIS and legal workstreams to deliver structured property reviews.</p></div></ChapterHeading>
      <Sequence kind="land" render={beat=><LandGraphic beat={beat}/>} />
      <Detail id="landsafe-deliverable"><Metrics items={[["40%","shorter verification turnaround"],["₹4 lakh","early-stage revenue"],["20+","properties verified"]]} /><div className="detail-columns"><div><h4>Connect the verification work</h4><p>I created a 30+ parameter property-risk framework, designed a property health report drawing on 74 years of legal precedents, and grew legal and surveying partnerships across Telangana.</p><p>{samples.land.method}</p></div><div><h4>A report with next actions</h4><p>{samples.land.deliverable}</p><p>{samples.land.note}</p></div></div><div className="service-path"><span>Enquiry</span><ArrowRight/><span>Scope</span><ArrowRight/><span>Coordinate specialists</span><ArrowRight/><span>Deliver report</span></div><p>I also led customer acquisition, sales and service delivery. Specialist legal and field checks remained distinct responsibilities.</p></Detail>
    </article>
    <ChapterBridge kind="research" />
    <article className="visual-chapter political-chapter" id="political-analysis">
      <ChapterHeading><div><span className="experience-company">Rajneethi Strategies (RASTRA)</span><h3>From the field<br /><em>to the briefing.</em></h3></div><div className="experience-role"><strong>Political Analyst</strong><span>Jun 2023 – Jul 2024</span><p>I synthesized constituency research for leadership and prepared a separate nomination portfolio.</p></div></ChapterHeading>
      <Sequence kind="research" overrideBeats={nomination ? nominationBeats : undefined} filter={<div className="research-picker" aria-label="Choose a political work sample"><button aria-pressed={!nomination} onClick={()=>setNomination(false)}>Research &amp; briefing</button><button aria-pressed={nomination} onClick={()=>setNomination(true)}>Nomination portfolio</button></div>} render={beat=><ResearchGraphic beat={beat} nomination={nomination}/>} />
      <Detail id="political-deliverable"><div className="detail-columns"><div><h4>Research, prioritize, brief</h4><p>I synthesized intelligence from 15 constituencies during the Telangana Assembly Elections 2023. My work included booth-level analysis, community partnerships, policy research and executive briefing notes for ministers and MLCs.</p><p>Briefing notes supported debate preparation, media messaging and campaign narratives. No electoral outcome is attributed to this work.</p></div><div><h4>Preparing a nomination portfolio</h4><p>I prepared the MLC portfolio sent to the Legislative Council for formal nomination and approval proceedings. I organized profile material, life-event documentation and supporting records into a structured submission.</p><p>My contribution was preparing the document. The subject’s achievements belong to the subject. The animation does not claim nomination approval.</p></div></div><p>Recreated process summaries. Names, personal histories, original pages, voter data and internal campaign material remain private.</p><a className="map-credit" href="/brand/experience-credits.txt" target="_blank" rel="noreferrer">Map: Arjunaraoc / Wikimedia Commons, adapted under CC BY-SA 4.0. Asset credits <ArrowRight size={14}/></a></Detail>
    </article>
  </section>;
}
