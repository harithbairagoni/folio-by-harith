import { lazy, Suspense, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { ArrowRight, Check, ClipboardList, FileSearch, Files, Flag, Landmark, MapPinned, MessageSquare, Plus, Truck, Users } from "lucide-react";
import samples from "../data/work-samples.json";
import "./experience-stories.css";

const PlantScene = lazy(() => import("./PlantScene"));
const ease = [0.22, 1, 0.36, 1] as const;
type Kind = "ethanol" | "land" | "research";
type Beat = { title: string; action: string; summary: string };
const beats: Record<Kind, Beat[]> = {
  ethanol: [
    { title: "Plan", action: "Sequence the work.", summary: "I connected civil, mechanical and clearance dependencies in the project plan." },
    { title: "Coordinate", action: "Keep the handoffs moving.", summary: "I coordinated site teams and vendors around equipment, readiness and open issues." },
    { title: "Review", action: "Bring readiness into view.", summary: "I tracked progress across workstreams to support commissioning readiness." },
  ],
  land: [
    { title: "Records", action: "Trace the evidence.", summary: "I organized the verification workflow around ownership records and supporting documents." },
    { title: "Cross-check", action: "Connect the specialists.", summary: "I coordinated field, GIS and legal work so documentary checks and site observations could be reviewed together." },
    { title: "Report", action: "Make the next action clear.", summary: "I brought the findings into a structured property report, including questions needing further review." },
  ],
  research: [
    { title: "Research", action: "Start with the constituency.", summary: "I researched 15 constituencies, bringing together field, policy and community perspectives." },
    { title: "Synthesize", action: "Find the briefing points.", summary: "I organized research into questions, evidence and implications for leadership." },
    { title: "Brief", action: "Turn research into preparation.", summary: "I prepared executive notes supporting debate preparation, media messaging and campaign narratives." },
  ],
};
const tracks = [
  { name: "Civil works", tasks: ["Site readiness", "Installation handoff", "Readiness review"], icon: MapPinned },
  { name: "Mechanical", tasks: ["Equipment sequence", "Vendor coordination", "Interface review"], icon: Truck },
  { name: "Clearances", tasks: ["Document requirements", "Follow-up & review", "Open requirements"], icon: ClipboardList },
];

function PaperLines() {
  return <div className="paper-lines" aria-hidden="true"><i /><i /><i /><i /></div>;
}

function PlantGraphic({ beat, selected, progress, still }: { beat: number; selected: number | null; progress: MotionValue<number>; still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "300px", once: true });
  return <div ref={ref} className="story-art plant-art" data-beat={beat} data-track={selected ?? "all"}>
    <div className="pm-workboard">
      <div className="coordination-owner"><Users size={18} /><span>My role<strong>Project coordination</strong></span></div>
      <div className="work-lanes">
        {tracks.map((track, i) => <div key={track.name} className={`work-lane ${selected === null || selected === i ? "is-selected" : "is-muted"}`}>
          <track.icon size={18} /><div><span>{track.name}</span><strong>{track.tasks[beat]}</strong>
            <div className="schedule-track"><motion.i initial={false} animate={{ scaleX: [.32, .64, .94][beat] }} transition={{ duration: still ? 0 : .32, ease }} /></div>
          </div><span className="lane-end">{beat === 2 ? <FileSearch size={16} /> : <ArrowRight size={16} />}</span>
        </div>)}
      </div>
      <div className="pm-handoff" key={`${beat}-${selected}`}>
        {beat === 0 ? <><ClipboardList /><span>Plan the dependency<strong>What needs to happen first?</strong></span></> : beat === 1 ? <><Truck /><span>Coordinate the handoff<strong>{selected === 2 ? "Document → review → follow-up" : selected === 0 ? "Site readiness → installation team" : "Vendor → site team → installation"}</strong></span></> : <><Flag /><span>Review readiness<strong>Evidence gathered · open items tracked</strong></span></>}
      </div>
    </div>
    <div className="coordination-link" aria-hidden="true"><span /><ArrowRight size={22} /></div>
    <div className="story-plant-model">
      <img className="story-plant-poster" src="/photos/plant-poster.webp" alt="Illustrative ethanol plant" width="730" height="560" loading="lazy" />
      {near && !still && <Suspense fallback={null}><PlantScene progress={progress} selected={selected} reduced={false} /></Suspense>}
      <div className="plant-model-label"><span>VIVEK BIO PRODUCTS</span><strong>{selected === null ? "One plant. Connected workstreams." : `${tracks[selected].name} · Selected workstream`}</strong></div>
    </div>
    <span className="art-note">Illustrative workflow, not a live schedule or engineering model.</span>
  </div>;
}

function Parcel({ beat }: { beat: number }) {
  return <svg className="parcel-drawing" viewBox="0 0 600 430" aria-hidden="true">
    <g fill="none" stroke="#bbc0a9" strokeWidth="1">
      {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${55 + i * 65} 90l160 230M70 ${120 + i * 35}l400 -50`} />)}
    </g>
    <path d="M70 290 330 370 535 244 280 169Z" fill="#c7ccb1" />
    <path d="M70 290v14l260 80v-14ZM330 370l205-126v14L330 384" fill="#a7b294" />
    <path d="M70 307 330 387 535 261" fill="none" stroke="#fff9e9" strokeWidth="10" />
    <path d="M127 258 255 186 456 239 341 326Z" fill="#dbe0c4" stroke="#42634e" strokeWidth="2" />
    <path d="M155 259 258 202 422 245 338 309Z" fill="none" stroke="#82987a" strokeWidth="1" strokeDasharray="6 6" />
    <g className="field-observation" style={{ opacity: beat > 0 ? 1 : 0, transform: `translateY(${beat > 0 ? 0 : 20}px)` }}>
      <path d="M127 258 255 186 479 241 363 333Z" fill="none" stroke="#ac5939" strokeWidth="3" strokeDasharray="8 6" />
      {[[127,258],[255,186],[479,241],[363,333]].map(([x,y], i) => <g key={i}><path d={`M${x} ${y}v-30`} stroke="#405c48" strokeWidth="4" /><circle cx={x} cy={y-30} r="5" fill="#df9b3b" /></g>)}
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
      {["Ownership chain", "Revenue records", "Encumbrance history"].map((label, i) => <div className="record-slip" key={label} style={{ "--slip": i } as CSSProperties}><Files size={17} /><span>{label}</span><span className="record-check">{beat > 0 ? <Check size={15} /> : <Plus size={15} />}</span></div>)}
      <div className="missing-record"><FileSearch size={15} /> Missing record? Follow up.</div>
    </div>
    <div className="land-field"><Parcel beat={beat} /><span className="field-label"><MapPinned size={15} /> Field &amp; GIS observations</span>
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
      {nomination ? <div className="dossier-outline"><Landmark size={54} /><span>Legislative Council</span><strong>Nomination portfolio</strong></div> : <><img src="/brand/telangana-map.webp" alt="Telangana geographic context; district boundaries, not constituency data" width="700" height="700" /><span className="map-label">TELANGANA</span><div className="scope-tally"><strong>15</strong><span>constituencies<br />researched</span></div><div className="scope-marks" aria-hidden="true">{Array.from({length:15},(_,i)=><i key={i}/>)}</div></>}
    </div>
    <div className="research-inputs">
      {inputs.map((label, i) => <div className="research-slip" key={label} style={{ "--slip": i } as CSSProperties}>
        {i === 0 ? <MessageSquare size={19} /> : i === 1 ? <FileSearch size={19} /> : <Files size={19} />}<span>{label}</span><PaperLines /><strong className="synthesis-label">{output[i]}</strong>
      </div>)}
    </div>
    <div className="research-connector"><span /><ArrowRight size={25} /></div>
    <div className="brief-document"><span className="brief-binding" /><span>{nomination ? "NOMINATION PORTFOLIO" : "LEADERSHIP BRIEF"}</span><h4>{nomination ? <>A record,<br />organized.</> : <>Ready for the<br />conversation.</>}</h4>
      {output.map((label,i)=><div className="brief-line" key={label}><span>{label}</span><i style={{transform:`scaleX(${[.85,.65,.75][i]})`}} /></div>)}
      <div className="brief-footer"><Files size={15} />{nomination ? "Prepared for formal proceedings" : "Research → synthesis → briefing"}</div>
    </div>
    <div className="research-owner"><Users size={16} /><span>My contribution<strong>{nomination ? "Organize & prepare the submission" : "Research, synthesize & brief"}</strong></span></div>
    <span className="art-note">{nomination ? "Recreated structure. Preparation does not imply nomination approval." : "Illustrative method. No voter data, targeting or campaign documents."}</span>
  </div>;
}

function Sequence({ kind, filter, render, overrideBeats }: { kind: Kind; filter?: ReactNode; render: (beat: number, progress: MotionValue<number>, still: boolean) => ReactNode; overrideBeats?: Beat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [beat, setBeat] = useState(0);
  const steps = overrideBeats ?? beats[kind];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100px", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", p => setBeat(Math.min(2, Math.floor(Math.max(0,p) * 3))));
  useEffect(() => {
    const media = matchMedia("(max-width: 760px), (max-height: 700px)");
    const update = () => setCompact(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const still = compact || Boolean(reduced);
  function go(index: number) {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + scrollY - 100;
    const travel = ref.current.offsetHeight - innerHeight + 100;
    window.scrollTo({ top: top + travel * [.06,.5,.94][index], behavior: "instant" });
    setBeat(index);
  }
  return <div ref={ref} className={`experience-sequence sequence-${kind} ${still ? "sequence-still" : ""}`} data-story={kind} data-beat={beat} data-sc-verify-state={`${kind}:${beat}`}>
    {still ? <><div className="story-filter">{filter}</div><div className="mobile-storyboard">{steps.map((step,i)=><figure key={step.title} id={`${kind}-beat-${i}`}>
      {render(i, scrollYProgress, true)}<figcaption><h4>{step.action}</h4><p>{step.summary}</p></figcaption>
    </figure>)}</div></> : <div className="sequence-sticky">
      <div className="story-stage-top"><div className="story-filter">{filter}</div><nav className="beat-nav" aria-label={`${kind === "land" ? "LandSafe" : kind === "research" ? "Political research" : "Ethanol"} stages`}>{steps.map((step,i)=><button key={step.title} aria-pressed={beat===i} onClick={()=>go(i)}><span />{step.title}</button>)}</nav></div>
      {render(beat, scrollYProgress, false)}
      <div className="beat-caption"><motion.h4 key={steps[beat].action} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.22,ease}}>{steps[beat].action}</motion.h4><p>{steps[beat].summary}</p></div>
      <div className="story-progress" aria-hidden="true"><motion.i style={{scaleX:scrollYProgress}} /></div>
    </div>}
  </div>;
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
  const [selected, setSelected] = useState<number | null>(null);
  const [nomination, setNomination] = useState(false);
  const nominationBeats = [
    {title:"Material",action:"Gather the public record.",summary:"I brought profile material, professional experience and supporting records together."},
    {title:"Structure",action:"Build a navigable document.",summary:"I organized the material into a coherent contents structure and thematic sections."},
    {title:"Portfolio",action:"Prepare the formal submission.",summary:"I prepared the portfolio sent to the Legislative Council for nomination and approval proceedings."},
  ];
  return <section id="experience" className="experience-section visual-experience">
    <div className="experience-preface section-pad"><p>Some problems live beyond a screen.</p><h2>The work between<br />the <span>workstreams.</span></h2><span>Three ways I turn complexity into action.</span></div>
    <article className="visual-chapter ethanol-chapter" id="ethanol">
      <header className="visual-chapter-heading"><div><span className="experience-company">Vivek Bio Products</span><h3>Keep the work<br /><em>moving together.</em></h3></div><div className="experience-role"><strong>Assistant Project Manager</strong><span>Jul 2024 – Jul 2025</span><p>I coordinated civil, mechanical and clearance workstreams for an ethanol facility.</p></div></header>
      <Sequence kind="ethanol" filter={<div className="workstream-picker" aria-label="Choose a workstream"><button aria-pressed={selected===null} onClick={()=>setSelected(null)}>Overview</button>{tracks.map((t,i)=><button key={t.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{t.name}</button>)}</div>} render={(beat,progress,still)=><PlantGraphic beat={beat} selected={selected} progress={progress} still={still} />} />
      <Detail id="ethanol-deliverable"><Metrics items={[["₹152 Cr","ethanol facility"],["20+","vendors coordinated"],["95%+","schedule adherence"]]} /><div className="detail-columns"><div><h4>Project coordination</h4><p>I worked across site readiness, installation sequencing, vendor coordination and clearance requirements, keeping dependencies and handoffs visible.</p></div><div><h4>Commissioning readiness</h4><p>My résumé reports a 20% improvement in commissioning readiness, a 30% reduction in bottlenecks and a 25% productivity improvement. The animation explains the kind of coordination involved; it does not simulate those results.</p></div></div></Detail>
    </article>
    <article className="visual-chapter landsafe-chapter" id="landsafe">
      <header className="visual-chapter-heading"><div><img className="landsafe-wordmark" src="/brand/landsafe-logo.webp" alt="LandSafe" width="336" height="192" /><h3>Many checks.<br /><em>One clearer picture.</em></h3></div><div className="experience-role"><strong>Director of Operations &amp; Co-Founder</strong><span>Aug 2025–present</span><p>I connected field, GIS and legal workstreams to deliver structured property reviews.</p></div></header>
      <Sequence kind="land" render={beat=><LandGraphic beat={beat}/>} />
      <Detail id="landsafe-deliverable"><Metrics items={[["40%","shorter verification turnaround"],["₹4 lakh","early-stage revenue"],["20+","properties verified"]]} /><div className="detail-columns"><div><h4>Connect the verification work</h4><p>I created a 30+ parameter property-risk framework, designed a property health report drawing on 74 years of legal precedents, and grew legal and surveying partnerships across Telangana.</p><p>{samples.land.method}</p></div><div><h4>A report with next actions</h4><p>{samples.land.deliverable}</p><p>{samples.land.note}</p></div></div><div className="service-path"><span>Enquiry</span><ArrowRight/><span>Scope</span><ArrowRight/><span>Coordinate specialists</span><ArrowRight/><span>Deliver report</span></div><p>I also led customer acquisition, sales and service delivery. Specialist legal and field checks remained distinct responsibilities.</p></Detail>
    </article>
    <article className="visual-chapter political-chapter" id="political-analysis">
      <header className="visual-chapter-heading"><div><span className="experience-company">Rajneethi Strategies (RASTRA)</span><h3>From the field<br /><em>to the briefing.</em></h3></div><div className="experience-role"><strong>Political Analyst</strong><span>Jun 2023 – Jul 2024</span><p>I synthesized constituency research for leadership and prepared a separate nomination portfolio.</p></div></header>
      <Sequence kind="research" overrideBeats={nomination ? nominationBeats : undefined} filter={<div className="research-picker" aria-label="Choose a political work sample"><button aria-pressed={!nomination} onClick={()=>setNomination(false)}>Research &amp; briefing</button><button aria-pressed={nomination} onClick={()=>setNomination(true)}>Nomination portfolio</button></div>} render={beat=><ResearchGraphic beat={beat} nomination={nomination}/>} />
      <Detail id="political-deliverable"><div className="detail-columns"><div><h4>Research, prioritize, brief</h4><p>I synthesized intelligence from 15 constituencies during the Telangana Assembly Elections 2023. My work included booth-level analysis, community partnerships, policy research and executive briefing notes for ministers and MLCs.</p><p>Briefing notes supported debate preparation, media messaging and campaign narratives. No electoral outcome is attributed to this work.</p></div><div><h4>Preparing a nomination portfolio</h4><p>I prepared the MLC portfolio sent to the Legislative Council for formal nomination and approval proceedings. I organized profile material, life-event documentation and supporting records into a structured submission.</p><p>My contribution was preparing the document. The subject’s achievements belong to the subject. The animation does not claim nomination approval.</p></div></div><p>Recreated process summaries. Names, personal histories, original pages, voter data and internal campaign material remain private.</p><a className="map-credit" href="/brand/experience-credits.txt" target="_blank" rel="noreferrer">Map: Arjunaraoc / Wikimedia Commons, adapted under CC BY-SA 4.0. Asset credits <ArrowRight size={14}/></a></Detail>
    </article>
  </section>;
}
