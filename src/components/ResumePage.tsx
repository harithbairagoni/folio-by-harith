import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  FileText,
  Printer,
  RotateCcw,
  X,
} from "lucide-react";
import resume from "../data/resume.json";
import "./resume-page.css";

type Entry = {
  title: string;
  role?: string;
  date?: string;
  location?: string;
  description?: string;
  bullets?: string[];
};
type Section = {
  title: string;
  paragraph?: string;
  entries?: Entry[];
  bullets?: string[];
};
const sections = resume.sections as Section[];
const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Bullets({ items }: { items?: string[] }) {
  return items ? (
    <ul>
      {items.map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  ) : null;
}

function ResumeDocument({ preview = false }: { preview?: boolean }) {
  return (
    <article
      className={`resume-document ${preview ? "document-preview" : ""}`}
      aria-label={preview ? undefined : "Founder’s Office résumé"}
    >
      <header className="document-header">
        <h1>{resume.name}</h1>
        <p>
          {preview ? (
            <>
              {resume.email} | {resume.phone} | {resume.linkedin}
            </>
          ) : (
            <>
              <a href={`mailto:${resume.email}`}>{resume.email}</a>
              <span> | </span>
              <a href={`tel:${resume.phone.replace(/\s/g, "")}`}>
                {resume.phone}
              </a>
              <span> | </span>
              <a href={resume.linkedin} target="_blank" rel="noreferrer">
                {resume.linkedin}
              </a>
            </>
          )}
        </p>
      </header>
      {sections.map((section) => (
        <section
          key={section.title}
          id={preview ? undefined : `cv-${slug(section.title)}`}
          className="resume-section"
        >
          <h2>
            <span>{section.title}</span>
          </h2>
          <div className="resume-section-content">
            {section.paragraph && (
              <p className="document-summary">{section.paragraph}</p>
            )}
            {section.entries?.map((entry) => (
              <div key={entry.title} className="resume-entry">
                <div className="entry-title">
                  <h3>{entry.title}</h3>
                  {entry.date && <span>{entry.date}</span>}
                </div>
                {(entry.role || entry.location) && (
                  <div className="entry-role">
                    {entry.role && <strong>{entry.role}</strong>}
                    {entry.location && <span>{entry.location}</span>}
                  </div>
                )}
                {entry.description && <p>{entry.description}</p>}
                <Bullets items={entry.bullets} />
              </div>
            ))}
            <Bullets items={section.bullets} />
          </div>
        </section>
      ))}
    </article>
  );
}

function PrinterBody() {
  return (
    <svg
      className="printer-body"
      viewBox="0 0 800 430"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="printer-top"
          x1="400"
          y1="115"
          x2="400"
          y2="310"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f4e8d1" />
          <stop offset="1" stopColor="#cbb994" />
        </linearGradient>
        <linearGradient
          id="printer-front"
          x1="400"
          y1="265"
          x2="400"
          y2="415"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e3d3b4" />
          <stop offset="1" stopColor="#af9979" />
        </linearGradient>
        <linearGradient id="printer-side" x1="650" y1="160" x2="750" y2="360">
          <stop stopColor="#aa9270" />
          <stop offset="1" stopColor="#816b51" />
        </linearGradient>
        <linearGradient id="printer-tray" x1="400" y1="5" x2="400" y2="150">
          <stop stopColor="#fffdf6" />
          <stop offset="1" stopColor="#e7dcc6" />
        </linearGradient>
        <filter
          id="printer-shadow"
          x="0"
          y="0"
          width="800"
          height="460"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="14"
            floodColor="#3a1d10"
            floodOpacity=".22"
          />
        </filter>
      </defs>
      <g filter="url(#printer-shadow)">
        <path d="M247 12h306l15 148H232Z" fill="#a99370" />
        <path
          d="M257 2h286l13 152H244Z"
          fill="url(#printer-tray)"
          stroke="#fff8e9"
          strokeWidth="2"
        />
        <path d="M265 28h270M266 40h268" stroke="#c8bca3" />
        <path
          d="M152 148 645 142 713 270 89 274Z"
          fill="url(#printer-top)"
          stroke="#f9eed7"
          strokeWidth="2"
        />
        <path d="m645 142 68 128v130l-65 17V271Z" fill="url(#printer-side)" />
        <path
          d="M88 270h627v120q0 27-27 27H115q-27 0-27-27Z"
          fill="url(#printer-front)"
          stroke="#d8c39c"
        />
        <path d="M105 275h591" stroke="#fff7df" strokeOpacity=".8" />
        <path d="m163 159-42 99h547l-44-99Z" stroke="#9c8766" />
        <g stroke="#756447" strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 34 }, (_, i) => (
            <path
              key={i}
              d={`M${213 + i * 10.5} 179l-4 18 M${208 + i * 10.7} 209l-4 18`}
            />
          ))}
        </g>
        <rect x="560" y="227" width="77" height="28" rx="3" fill="#867d52" />
        <rect x="564" y="231" width="69" height="20" rx="2" fill="#b9cb91" />
        <path d="M110 322h580" stroke="#9c8869" />
        <rect
          x="282"
          y="287"
          width="235"
          height="28"
          rx="4"
          fill="#bcaa88"
          stroke="#e7d9bc"
        />
        <circle cx="309" cy="301" r="6" fill="#6c725a" stroke="#8b8e72" />
        <circle cx="331" cy="301" r="6" fill="#cbbd9e" stroke="#8c7b5e" />
        <circle cx="489" cy="300" r="3" fill="#435b37" />
        <rect x="175" y="344" width="453" height="40" rx="4" fill="#806c50" />
        <rect x="183" y="349" width="437" height="27" rx="2" fill="#302d21" />
        <rect x="191" y="355" width="421" height="8" rx="2" fill="#191f17" />
        <path d="M113 407h574" stroke="#7e694e" />
        <path
          d="M132 417v7h32v-7M638 417v7h32v-7"
          stroke="#65543e"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}

export default function ResumePage() {
  const reduced = useReducedMotion();
  const [printing, setPrinting] = useState(!reduced);
  const [readerOpen, setReaderOpen] = useState(false);
  const [ats, setAts] = useState(false);
  const [scale, setScale] = useState(0.46);
  const dialog = useRef<HTMLDialogElement>(null);
  const outlet = useRef<HTMLDivElement>(null);
  const feed = useMotionValue(reduced ? 1 : 0);
  const sheetY = useTransform(feed, [0, 1], ["-100%", "0%"]);
  const percent = useTransform(feed, (value) => `${Math.round(value * 100)}%`);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const printSheet = () => {
    if (reduced) {
      feed.set(1);
      setPrinting(false);
      return;
    }
    animation.current?.stop();
    feed.set(0);
    setPrinting(true);
    animation.current = animate(feed, 1, {
      duration: 3.2,
      ease: [0.2, 0.65, 0.3, 1],
      onComplete: () => setPrinting(false),
    });
  };
  useEffect(() => {
    printSheet();
    return () => animation.current?.stop();
  }, [reduced]);
  useEffect(() => {
    if (!outlet.current) return;
    const observer = new ResizeObserver((entries) =>
      setScale(entries[0].contentRect.width / 794),
    );
    observer.observe(outlet.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!readerOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [readerOpen]);
  const openReader = (section?: string) => {
    dialog.current?.showModal();
    setReaderOpen(true);
    if (section)
      requestAnimationFrame(() =>
        dialog.current
          ?.querySelector(`#cv-${slug(section)}`)
          ?.scrollIntoView({ block: "start" }),
      );
  };
  return (
    <div className="resume-experience">
      <a className="resume-skip" href="#resume-actions">
        Skip animation and get résumé
      </a>
      <header className="resume-navigation">
        <a href="/" className="resume-brand">
          harith<span>.</span>
        </a>
        <a href="/" className="return-link">
          <ArrowLeft size={15} /> Back to portfolio
        </a>
        <a href={`mailto:${resume.email}`} className="resume-contact">
          Email Harith <ArrowUpRight size={14} />
        </a>
      </header>
      <main>
        <motion.div
          className="resume-introduction"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p>THE WORK. ON PAPER.</p>
          <h1>
            The work,
            <br />
            <span>on paper.</span>
          </h1>
          <p>
            From plant operations to building products.
            <br />
            Read it here, print a copy, or take it with you.
          </p>
        </motion.div>
        <section className="resume-scene" aria-label="Animated résumé printer">
          <div className="scene-light" aria-hidden="true" />
          <div className="printer-view">
            <PrinterBody />
            <div className="printer-screen" aria-hidden="true">
              <span>{printing ? "PRINTING" : "READY"}</span>
              <motion.span>{percent}</motion.span>
            </div>
            <div className="printer-badge" aria-hidden="true">
              HARITH / FIELD NOTES
            </div>
          </div>
          <div ref={outlet} className="paper-output" aria-hidden="true">
            <motion.div className="printed-paper" style={{ y: sheetY }}>
              <div
                className="preview-scale"
                style={{ transform: `scale(${scale})` }}
              >
                <ResumeDocument preview />
              </div>
            </motion.div>
          </div>
          <div className="paper-action">
            <button onClick={() => openReader()}>
              <BookOpen size={15} /> Open the page <ArrowUpRight size={14} />
            </button>
          </div>
        </section>
        <section
          id="resume-actions"
          className="resume-actions"
          aria-label="Résumé actions"
        >
          <button
            className="resume-action secondary"
            onClick={printSheet}
            aria-label="Replay the printing animation"
          >
            <RotateCcw size={17} />
            {printing ? "Printing the page…" : "Replay scene"}
          </button>
          <button className="resume-action paper" onClick={() => openReader()}>
            <BookOpen size={18} /> Read résumé
          </button>
          <a
            className="resume-action primary"
            href="/resume/harith-focos-ats.pdf"
            download="Bairagoni-Harith-Resume-ATS.pdf"
          >
            <ArrowDownToLine size={18} /> Download ATS PDF
          </a>
        </section>
        <p className="resume-state" aria-live="polite">
          {printing
            ? "Your page is on its way. Reading and downloads are available now."
            : "Ready when you are. All the details, in your preferred format."}
        </p>
        <div className="resume-formats">
          <a
            href="/resume/harith-focos-original.pdf"
            download="Bairagoni-Harith-Original-CV.pdf"
          >
            <FileText size={15} /> Original one-page CV{" "}
            <ArrowUpRight size={13} />
          </a>
          <a
            href="/resume/harith-focos-ats.txt"
            download="Bairagoni-Harith-Resume.txt"
          >
            Plain text <ArrowDownToLine size={14} />
          </a>
          <button onClick={() => window.print()}>
            Print résumé <Printer size={14} />
          </button>
        </div>
        <section className="resume-contents">
          <div>
            <span>INSIDE THE PAGE</span>
            <h2>
              A few chapters <br />
              of figuring it out.
            </h2>
            <p>
              Harith Bairagoni · Founder’s Office
              <br />
              Explore the experience behind the portfolio.
            </p>
          </div>
          <nav aria-label="Résumé sections">
            {sections.map((section) => (
              <button
                key={section.title}
                onClick={() => openReader(section.title)}
              >
                {section.title}
                <ArrowUpRight size={15} />
              </button>
            ))}
          </nav>
        </section>
      </main>
      <footer className="resume-footer">
        <a href={`mailto:${resume.email}`}>
          Have something worth solving? Email Harith <ArrowUpRight size={15} />
        </a>
        <span>Products · Operations · Strategy &amp; Growth</span>
      </footer>
      <dialog
        ref={dialog}
        className={`resume-reader ${ats ? "ats-reading" : ""}`}
        aria-labelledby="reader-title"
        onClose={() => setReaderOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom
            )
              event.currentTarget.close();
          }
        }}
      >
        <div className="reader-toolbar">
          <span id="reader-title">The résumé</span>
          <div className="reader-layout" aria-label="Reading layout">
            <button onClick={() => setAts(false)} aria-pressed={!ats}>
              Original layout
            </button>
            <button onClick={() => setAts(true)} aria-pressed={ats}>
              ATS reading
            </button>
          </div>
          <div className="reader-tools">
            <a
              href="/resume/harith-focos-ats.pdf"
              download="Bairagoni-Harith-Resume-ATS.pdf"
              aria-label="Download ATS PDF"
            >
              <ArrowDownToLine size={18} />
              <span>ATS PDF</span>
            </a>
            <button onClick={() => window.print()} aria-label="Print résumé">
              <Printer size={18} />
            </button>
            <button
              onClick={() => dialog.current?.close()}
              aria-label="Close résumé"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <ResumeDocument />
      </dialog>
    </div>
  );
}
