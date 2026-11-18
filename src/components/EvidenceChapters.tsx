import { lazy, Suspense, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowRight, FileText } from "lucide-react";
import samples from "../data/work-samples.json";
import "./evidence-chapters.css";

const ArtifactScene = lazy(() => import("./ArtifactScene"));
const landStages = [
  {
    label: "Records",
    title: "Trace the ownership record.",
    body: "Organize the title chain, transaction records, and encumbrance history before bringing the checks together.",
  },
  {
    label: "Field verification",
    title: "Compare the records with the site.",
    body: "Review boundary observations, access, and usable extent alongside the documentary evidence. The offset outline illustrates a question to review.",
  },
  {
    label: "Review report",
    title: "Bring the findings into one report.",
    body: "Separate compliance checks, physical observations, and recommendations, with a supporting-record index for further review.",
  },
];
const researchStages = [
  {
    label: "Research",
    title: "Start with the constituency.",
    body: "Constituency research, booth-level voter analysis, policy research, and conversations with community leaders informed the work.",
  },
  {
    label: "Synthesize",
    title: "Turn research into a briefing point.",
    body: "Bring the question, evidence, and implication into a clear structure. This is an illustrative workflow, not an internal campaign briefing.",
  },
  {
    label: "Brief",
    title: "Prepare leadership for the conversation.",
    body: "Develop executive briefing notes for ministers and MLCs, supporting debate preparation, media messaging, and campaign narratives.",
  },
];

function Fallback({
  kind,
  state,
}: {
  kind: "land" | "research";
  state: number;
}) {
  return (
    <svg className="artifact-fallback" viewBox="0 0 640 480" aria-hidden="true">
      <g transform="translate(320 245) rotate(-12) skewX(22) scale(1 .72)">
        <rect
          x="-235"
          y="-150"
          width="470"
          height="310"
          rx="15"
          fill="#c8cbb3"
          stroke="#a6b39a"
          strokeWidth="4"
        />
        {kind === "land" ? (
          <>
            <path
              d="M-170 -90 -45 -115 110 -40 75 85 -130 100Z"
              fill="#8ba37b"
              stroke="#365345"
              strokeWidth="3"
            />
            <path d="M-220 125 220 125" stroke="#fff6df" strokeWidth="20" />
            {state === 1 && (
              <path
                d="M-170 -90 -45 -115 145 -40 110 95 -130 100Z"
                fill="none"
                stroke="#a75a37"
                strokeWidth="4"
                strokeDasharray="9 7"
              />
            )}
          </>
        ) : (
          <rect
            x="40"
            y="-110"
            width="155"
            height="230"
            rx="6"
            fill="#365345"
          />
        )}
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            transform={`translate(${kind === "land" ? 150 - (state === 2 ? i * 70 : i * 4) : -140 + i * (state === 0 ? 60 : 8)} ${-70 + i * (state === 0 ? 42 : 8)})`}
          >
            <rect
              x="-50"
              y="-70"
              width="100"
              height="135"
              rx="2"
              fill="#fff6df"
              stroke="#cbbd9d"
            />
            <path
              d="M-35 -45h45M-35 -20h70M-35 0h70M-35 20h50"
              stroke="#94a483"
              strokeWidth="4"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Study({ kind }: { kind: "land" | "research" }) {
  const [state, setState] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "350px", once: true });
  const reduced = useReducedMotion();
  const stages = kind === "land" ? landStages : researchStages;
  const prefix = kind === "land" ? "land" : "research";
  return (
    <div className={`spatial-study ${prefix}-study`} ref={ref}>
      <div className="study-topline">
        <span>
          {kind === "land"
            ? "RECORDS / FIELD / REPORT"
            : "RESEARCH / SYNTHESIS / BRIEFING"}
        </span>
        <span>0{state + 1} / 03</span>
      </div>
      <div
        className="artifact-stage"
        role="img"
        aria-label={`${kind === "land" ? "Fictional parcel and document layers" : "Illustrative research desk"}: ${stages[state].title}`}
      >
        <Fallback kind={kind} state={state} />
        {near && (
          <Suspense fallback={null}>
            <ArtifactScene
              kind={kind}
              state={state}
              reduced={Boolean(reduced)}
            />
          </Suspense>
        )}
        <div className="scene-caption-tag">
          <span />
          {stages[state].label}
        </div>
      </div>
      <div
        className="study-controls"
        aria-label={
          kind === "land" ? "Property review stages" : "Research stages"
        }
      >
        {stages.map((stage, i) => (
          <button
            key={stage.label}
            aria-pressed={state === i}
            aria-controls={`${prefix}-explanation`}
            onClick={() => setState(i)}
          >
            <span>0{i + 1}</span>
            {stage.label}
          </button>
        ))}
      </div>
      <div
        className="study-explanation"
        id={`${prefix}-explanation`}
        aria-live="polite"
      >
        <h4>{stages[state].title}</h4>
        <p>{stages[state].body}</p>
      </div>
      <p className="study-disclaimer">
        {kind === "land"
          ? "Fictional parcel. Recreated report structure; no client records."
          : "Illustrative workflow. No campaign documents or voter data."}
      </p>
    </div>
  );
}

export default function EvidenceChapters() {
  return (
    <div className="evidence-chapters">
      <article className="evidence-chapter landsafe-chapter" id="landsafe">
        <div className="chapter-heading">
          <span>02 / OPERATIONS &amp; DUE DILIGENCE</span>
          <a href="#landsafe-deliverable">
            Read the work <ArrowDownRight size={16} />
          </a>
        </div>
        <div className="chapter-grid">
          <div className="chapter-copy">
            <p className="section-kicker">LANDSAFE</p>
            <h3>
              Many records.
              <br />
              <span>One clearer picture.</span>
            </h3>
            <p className="chapter-role">
              Director of Operations &amp; Co-Founder
              <br />
              Aug 2025–present
            </p>
            <p className="chapter-lead">
              I coordinated field, GIS, and legal workstreams to bring property
              evidence into a structured review. I also led customer
              acquisition, sales, and service delivery.
            </p>
            <dl className="chapter-metrics">
              <div>
                <dt>40%</dt>
                <dd>shorter verification turnaround</dd>
              </div>
              <div>
                <dt>₹4 lakh</dt>
                <dd>early-stage revenue</dd>
              </div>
              <div>
                <dt>20+</dt>
                <dd>properties verified</dd>
              </div>
            </dl>
            <p className="metrics-context">
              Results across my LandSafe work, as reported in my résumé.
            </p>
          </div>
          <Study kind="land" />
        </div>
        <div className="chapter-case-strip" id="landsafe-deliverable">
          <div>
            <span>THE PROBLEM</span>
            <h4>Evidence spread across records and teams.</h4>
            <p>
              A property review needs documentary checks and physical
              observations to be considered together.
            </p>
          </div>
          <div>
            <span>MY CONTRIBUTION</span>
            <h4>Connect the verification work.</h4>
            <p>
              I created a 30+ parameter property-risk framework, designed a
              property health report drawing on 74 years of legal precedents,
              and grew legal and surveying partnerships across Telangana.
            </p>
          </div>
          <div>
            <span>THE DELIVERABLE</span>
            <h4>A report with the next actions in view.</h4>
            <p>{samples.land.deliverable}</p>
          </div>
        </div>
        <div className="chapter-footnote">
          <FileText size={16} />
          <p>
            The supplied work includes document-sourcing, escalation, review,
            and delivery workflows. This presentation recreates the method;
            original client details and findings are withheld.
          </p>
        </div>
      </article>
      <article
        className="evidence-chapter political-chapter"
        id="political-analysis"
      >
        <div className="chapter-heading">
          <span>03 / STRATEGY &amp; RESEARCH</span>
          <a href="#political-deliverable">
            Read the work <ArrowDownRight size={16} />
          </a>
        </div>
        <div className="chapter-grid">
          <Study kind="research" />
          <div className="chapter-copy">
            <p className="section-kicker">TELANGANA ELECTION RESEARCH</p>
            <h3>
              From field notes
              <br />
              <span>to a briefing.</span>
            </h3>
            <p className="chapter-role">
              Political Analyst · Rajneethi Strategies (RASTRA)
              <br />
              Jun 2023–Jul 2024
            </p>
            <p className="chapter-lead">
              I synthesized intelligence from 15 constituencies into insights
              for campaign strategy and prepared briefing notes for ministers
              and MLCs.
            </p>
            <dl className="chapter-metrics">
              <div>
                <dt>15</dt>
                <dd>constituencies researched</dd>
              </div>
              <div>
                <dt>Field → briefing</dt>
                <dd>research, analysis, and synthesis</dd>
              </div>
            </dl>
            <p className="metrics-context">
              Telangana Assembly Elections 2023 · Research scope
            </p>
          </div>
        </div>
        <div className="chapter-case-strip" id="political-deliverable">
          <div>
            <span>THE QUESTION</span>
            <h4>What does leadership need to understand?</h4>
            <p>
              The work covered constituency intelligence, booth-level voter
              analysis, policy issues, and community engagement.
            </p>
          </div>
          <div>
            <span>MY CONTRIBUTION</span>
            <h4>Research, prioritize, and brief.</h4>
            <p>
              I analyzed booth-level data to inform constituency prioritization
              and resource planning, built community partnerships, and
              researched political and policy issues.
            </p>
          </div>
          <div>
            <span>THE DELIVERABLE</span>
            <h4>Briefing notes for leadership.</h4>
            <p>
              Executive notes supported debate preparation, media messaging, and
              campaign narratives. The scene illustrates the method without
              reproducing internal material.
            </p>
          </div>
        </div>
        <div className="nomination-feature">
          <div className="nomination-object" aria-hidden="true">
            <div className="nomination-book">
              <span>
                PROFILE
                <br />
                &amp; RECORD
              </span>
              <i />
              <i />
              <i />
            </div>
            <div className="nomination-tabs">
              <span>Profile material</span>
              <span>Professional record</span>
              <span>Supporting records</span>
            </div>
          </div>
          <div>
            <p className="section-kicker">A SECOND DELIVERABLE</p>
            <h4>Preparing a nomination portfolio.</h4>
            <p>
              I prepared the MLC portfolio sent to the Legislative Council for
              formal nomination and approval proceedings. I organized profile
              material, life-event documentation, and supporting records into a
              structured submission.
            </p>
            <p className="nomination-note">
              My contribution was preparing the document. The subject’s
              achievements belong to the subject.
            </p>
          </div>
        </div>
        <div className="chapter-footnote">
          <FileText size={16} />
          <p>
            Recreated summaries. Names, photographs, personal histories,
            property details, and internal campaign material remain private.
          </p>
          <a href="#about">
            The person behind the work <ArrowRight size={15} />
          </a>
        </div>
      </article>
    </div>
  );
}
