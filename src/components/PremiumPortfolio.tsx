import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  FileSpreadsheet,
  GitBranch,
  Layers3,
  Mail,
  Menu,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import "./premium-portfolio.css";
import portfolio from "../../portfolio.json";
import ExperienceStories from "./ExperienceStories";

const spring = { type: "spring" as const, bounce: 0, duration: 0.4 };

function TidyLogo() {
  return (
    <span className="tidy-logo">
      <img src="/brand/tidyrow-icon.svg" width="42" height="42" alt="" />
      <span>
        Tidy<span>Row</span>
      </span>
    </span>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pointer = useMotionValue(0);
  const pointerSpring = useSpring(pointer, { stiffness: 110, damping: 28 });
  const rearX = useTransform(pointerSpring, [-1, 1], [8, -8]);
  const subjectX = useTransform(pointerSpring, [-1, 1], [-6, 6]);
  const foregroundX = useTransform(pointerSpring, [-1, 1], [-11, 11]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const lightY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const noteY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  return (
    <section
      ref={ref}
      className="premium-hero"
      id="top"
      data-sc-act="flow"
      onPointerMove={(event) => {
        if (
          reduced ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
      }}
      onPointerLeave={() => pointer.set(0)}
    >
      <motion.div
        aria-hidden="true"
        className="hero-orbit"
        style={reduced ? {} : { y: lightY, x: rearX }}
      />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-intro">
          <span /> Harith Bairagoni
        </p>
        <h1>
          I like problems
          <br />
          without an
          <br />
          <span>instruction manual.</span>
        </h1>
        <p className="hero-description">
          From plant operations to products, I turn unfamiliar problems into a
          useful next step.
        </p>
        <div className="hero-actions">
          <a className="premium-button light" href="#work">
            Explore my work <ArrowUpRight size={18} />
          </a>
          <a className="hero-text-link" href="#about">
            A little about me <ArrowRight size={16} />
          </a>
        </div>
        <p className="original-hook">Strategy, products &amp; execution.</p>
      </div>
      <motion.div
        className="hero-portrait"
        style={reduced ? {} : { y: portraitY, x: subjectX }}
      >
        <img
          src="/photos/harith-cutout.webp"
          alt="Harith, hand on his chin, thinking through a problem"
          width="1088"
          height="1445"
          fetchPriority="high"
        />
      </motion.div>
      <motion.div
        className="hero-note"
        style={reduced ? {} : { y: noteY, x: foregroundX }}
      >
        <GitBranch size={20} />
        <p>
          Different worlds.
          <br />
          <strong>The same curiosity.</strong>
        </p>
        <span>Engineering · Research · Building</span>
      </motion.div>
      <div className="hero-floor" aria-hidden="true" />
      <div className="hero-bottom">
        <span>Open to meaningful problems</span>
      </div>
    </section>
  );
}

type SampleRow = { name: string; city: string; amount: string };
const originalRows: SampleRow[] = [
  { name: "  Ravi ", city: "hyd", amount: "50,000" },
  { name: "sneha", city: "Hyderabad", amount: "₹ 8,500" },
  { name: "RAVI", city: "HYD", amount: "50000" },
  { name: "  Arjun", city: "hyderabad ", amount: "12,000" },
];
function cleanSample(rows: SampleRow[]) {
  const normalized = rows.map((row) => ({
    name: row.name
      .trim()
      .toLowerCase()
      .replace(/^./, (c) => c.toUpperCase()),
    city: /^hyd(erabad)?$/i.test(row.city.trim())
      ? "Hyderabad"
      : row.city.trim(),
    amount: String(Number(row.amount.replace(/[^\d.]/g, ""))),
  }));
  return normalized.filter(
    (row, index, all) =>
      all.findIndex(
        (other) => JSON.stringify(other) === JSON.stringify(row),
      ) === index,
  );
}

function TidyExample() {
  const [cleaned, setCleaned] = useState(false);
  const rows = cleaned ? cleanSample(originalRows) : originalRows;
  return (
    <div className="csv-artifact" id="tidyrow-example" tabIndex={-1}>
      <div className="artifact-toolbar">
        <span>
          <FileSpreadsheet size={16} /> contacts.csv
        </span>
        <span className="sample-tag">Interactive sample</span>
      </div>
      <div className="csv-heading">
        <div>
          <span className="micro-label">A LITTLE LESS MESS</span>
          <h4>
            {cleaned
              ? "A clearer starting point."
              : "Familiar spreadsheet chaos."}
          </h4>
        </div>
        <span className={cleaned ? "csv-status is-clean" : "csv-status"}>
          {cleaned ? <CheckCheck size={18} /> : <Layers3 size={18} />}
          {cleaned ? "Cleaned" : "Original"}
        </span>
      </div>
      <div className="csv-table-wrap">
        <table>
          <caption className="sr-only">
            {cleaned
              ? "Cleaned fictional contact data"
              : "Original fictional contact data"}
          </caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">City</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${cleaned}-${index}`}>
                <td>
                  <span className="row-number">{index + 1}</span>
                  <span
                    className={!cleaned && index % 2 === 0 ? "messy-cell" : ""}
                  >
                    {row.name}
                  </span>
                </td>
                <td>{row.city}</td>
                <td>{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="csv-rules">
        <span>
          <Check size={13} /> Trim &amp; standardize
        </span>
        <span>
          <Check size={13} /> Normalize values
        </span>
        <span>
          <Check size={13} /> Remove duplicates
        </span>
      </div>
      <div className="csv-footer">
        <span aria-live="polite">
          {cleaned
            ? "3 rows. One duplicate removed."
            : "4 rows. A few things to untangle."}
        </span>
        <button
          className="premium-button green small"
          onClick={() => setCleaned(!cleaned)}
          aria-pressed={cleaned}
        >
          {cleaned ? <RotateCcw size={15} /> : <Plus size={15} />}
          {cleaned ? "Reset sample" : "Clean this sample"}
        </button>
      </div>
      <p className="artifact-disclaimer">
        A local illustration of cleanup rules, using fictional data.
      </p>
    </div>
  );
}

const conversationSteps = [
  {
    name: "Prepare",
    label: "Find a better opening.",
    title: "Go beyond the profile.",
    prompt: "What is the conversation really for?",
    body: "Maya is a fictional product mentor. The goal: understand how she decides which customer problems are worth solving.",
    note: "“What changed your mind about a problem you initially thought was important?”",
    tag: "A question with somewhere to go",
  },
  {
    name: "Rehearse",
    label: "Make your intent clear.",
    title: "A short, human introduction.",
    prompt: "Say why you reached out.",
    body: "“I’m Harith. I’ve worked in plant execution and field research, and I’m now building products. I’d love to learn how you choose what to build next.”",
    note: "Lead with context. Give one example. Make a specific ask.",
    tag: "Sample rehearsal guidance",
  },
  {
    name: "Follow through",
    label: "Remember what mattered.",
    title: "Leave with a next step.",
    prompt: "Turn a conversation into continuity.",
    body: "Meeting note: Maya suggested talking to people who stopped using the product, not only the people who stayed.",
    note: "Next step: interview three former users and share what changed in the problem definition.",
    tag: "A fictional follow-up commitment",
  },
];

function ColdExample() {
  const [step, setStep] = useState(0);
  const current = conversationSteps[step];
  return (
    <div className="cold-artifact" id="coldconnect-example" tabIndex={-1}>
      <div className="cold-window-header">
        <span className="cold-wordmark">ColdConnect</span>
        <span className="sample-tag">Fictional scenario</span>
      </div>
      <div
        className="cold-tabs"
        role="tablist"
        aria-label="Conversation stages"
      >
        {conversationSteps.map((s, i) => (
          <button
            key={s.name}
            id={`cold-tab-${i}`}
            aria-controls="cold-panel"
            aria-selected={step === i}
            role="tab"
            tabIndex={step === i ? 0 : -1}
            onClick={() => setStep(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = (step + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                setStep(next);
                document.getElementById(`cold-tab-${next}`)?.focus();
              }
            }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s.name}
            {step === i && <motion.i layoutId="cold-tab" transition={spring} />}
          </button>
        ))}
      </div>
      <div
        id="cold-panel"
        role="tabpanel"
        aria-labelledby={`cold-tab-${step}`}
        className="cold-panel"
        tabIndex={0}
      >
        <div className="contact-avatar">
          M<span />
        </div>
        <div className="fictional-contact">
          <strong>Maya Rao</strong>
          <span>Product mentor · Sample contact</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <p className="micro-label">{current.prompt}</p>
            <h4>{current.title}</h4>
            <p>{current.body}</p>
            <div className="conversation-note">
              <span>{current.tag}</span>
              <p>{current.note}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="cold-bottom">
        <span>{current.label}</span>
        <button
          aria-label="Next conversation stage"
          onClick={() => setStep((step + 1) % 3)}
        >
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}

function SelectedWork() {
  return (
    <section id="work" className="selected-work section-pad">
      <div className="work-introduction">
        <p className="section-kicker">SELECTED WORK</p>
        <h2>
          A useful idea
          <br />
          deserves to be <span>built.</span>
        </h2>
        <p>
          Two products. Different problems.
          <br />
          The same instinct to make the next step simpler.
        </p>
        <a className="underlined-link" href="#experience">See my experience in motion <ArrowDownRight size={17} /></a>
      </div>
      <article className="project-spread tidy-spread" data-sc-act="flow">
        <div className="project-copy">
          <TidyLogo />
          <h3>
            Messy spreadsheets.
            <br />
            Clearer decisions.
          </h3>
          <p>
            I built TidyRow solo to turn messy spreadsheets into structured data,
            with one-click formatting for HubSpot and Salesforce. Designed for
            less technical analysts, it was tested with real company sales and
            performance files and includes a demo file to try.
          </p>
          <div className="project-meta">
            <span>Product thinking</span>
            <span>Workflow design</span>
          </div>
          <a className="underlined-link" href="#tidyrow-example">
            Try the cleanup example <ArrowUpRight size={17} />
          </a>
        </div>
        <TidyExample />
      </article>
      <article className="project-spread cold-spread" data-sc-act="flow">
        <ColdExample />
        <div className="project-copy">
          <span className="cold-wordmark">ColdConnect</span>
          <h3>
            Good conversations
            <br />
            start before
            <br />
            the introduction.
          </h3>
          <p>
            I built ColdConnect solo to keep track of professional connections:
            prepare relevant questions, plan LinkedIn and Gmail follow-ups, and
            organize the next meeting. Built from a personal need and self-tested.
          </p>
          <div className="project-meta">
            <span>AI &amp; product</span>
            <span>Conversation design</span>
          </div>
          <a className="underlined-link" href="#coldconnect-example">
            Explore the conversation <ArrowUpRight size={17} />
          </a>
        </div>
      </article>
    </section>
  );
}

const books = [
  {
    title: "Zero to One",
    author: "Peter Thiel with Blake Masters",
    cover: "/books/zero-to-one.webp",
    source: "https://www.penguinrandomhouse.com/books/234730/zero-to-one-by-peter-thiel-with-blake-masters/",
    color: "sand",
    thought:
      "What do you notice about a problem that other people might be overlooking?",
    lend: "Someone starting with a question rather than an answer.",
  },
  {
    title: "Positioning",
    author: "Al Ries & Jack Trout",
    cover: "/books/positioning.webp",
    source: "https://books.google.com/books/about/Positioning_The_Battle_for_Your_Mind.html?id=QupddZiRKkUC",
    color: "rust",
    thought:
      "If someone remembers only one thing about your product, what should it be?",
    lend: "Someone trying to make a good idea easier to explain.",
  },
  {
    title: "Dopamine Detox",
    author: "Thibaut Meurisse",
    cover: "/books/dopamine-detox.webp",
    source: "https://books.google.com/books/about/Dopamine_Detox.html?id=0rlmzwEACAAJ",
    color: "forest",
    thought:
      "Notice what repeatedly pulls your attention away from the work you chose.",
    lend: "Someone looking for a little more room to focus.",
  },
  {
    title: "The Power of Your Subconscious Mind",
    author: "Joseph Murphy",
    cover: "/books/subconscious-mind.webp",
    source: "https://www.penguinrandomhouse.com/books/549149/the-power-of-your-subconscious-mind-by-joseph-murphy-phd-dd/",
    color: "cream",
    thought:
      "The things we tell ourselves can shape what we are willing to attempt.",
    lend: "Someone standing at the edge of an unfamiliar beginning.",
  },
];
function About() {
  const [book, setBook] = useState(0);
  return (
    <section
      id="about"
      className="about-section section-pad"
      data-sc-act="flow"
    >
      <div className="about-story">
        <div className="about-photo">
          <img
            src="/photos/harith-about-headshot.webp"
            alt="Harith in a navy blazer"
            width="1600"
            height="2400"
            loading="lazy"
          />
          <span>A little more human.</span>
        </div>
        <div>
          <p className="section-kicker">THE PERSON BEHIND THE WORK</p>
          <h2>
            Curiosity has been
            <br />
            the common thread.
          </h2>
          <p>
            {portfolio.me.bio60}
          </p>
          <a href={`mailto:${portfolio.contact.email}`} className="underlined-link">
            Email Harith <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="bookshelf">
        <div className="shelf-heading">
          <h3>Books I’d lend a friend.</h3>
          <p>A small shelf. A few ideas worth keeping close.</p>
        </div>
        <div className="book-row" aria-label="Select a book">
          {books.map((b, i) => (
            <motion.button
              key={b.title}
              className={`book cover-book ${book === i ? "selected" : ""}`}
              onClick={() => setBook(i)}
              aria-pressed={book === i}
              aria-label={`${b.title} by ${b.author}`}
              animate={{
                y: book === i ? -14 : 0,
                rotateY: book === i ? -8 : 0,
              }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            >
              <img src={b.cover} alt={`${b.title} published book cover`} width="300" height="450" loading="lazy" />
            </motion.button>
          ))}
        </div>
        <div className="book-reflection" aria-live="polite">
          <span>
            READING NOTE <small>Draft reflection</small>
          </span>
          <p>{books[book].thought}</p>
          <span>I’D LEND IT TO</span>
          <p>{books[book].lend}</p>
          <a className="underlined-link" href={books[book].source} target="_blank" rel="noreferrer">Book details <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="contact-finale" data-sc-act="flow">
      <div className="contact-main">
        <p>THE NEXT CONVERSATION</p>
        <h2>
          Something messy.
          <br />
          Something <span>worth solving.</span>
        </h2>
        <p className="contact-description">
          I’m open to Founder’s Office, Chief of Staff, Strategy, and Special
          Projects conversations.
        </p>
        <a className="premium-button light" href={`mailto:${portfolio.contact.email}`}>
          Email Harith <ArrowUpRight size={18} />
        </a>
        <a className="contact-address" href={`mailto:${portfolio.contact.email}`}>
          {portfolio.contact.email}
        </a>
      </div>
      <div className="footer-line">
        <span>
          Harith Bairagoni <small>© 2026</small>
        </span>
        <div>
          <a
            href="https://www.linkedin.com/in/harith-bairagoni-5a100b210/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight size={14} />
          </a>
          <a
            href="https://github.com/harithbairagoni"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={14} />
          </a>
          <a href="#top">
            Back to top <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function PremiumPortfolio() {
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    let runtime: { destroy: () => void } | undefined;
    const mount = () => {
      const sc = (
        window as Window & {
          ScrollCraft?: { mount: (root: Element) => { destroy: () => void } };
        }
      ).ScrollCraft;
      if (sc) runtime = sc.mount(document.querySelector(".premium-site")!);
    };
    if (document.readyState === "complete") mount();
    else window.addEventListener("load", mount, { once: true });
    return () => {
      window.removeEventListener("load", mount);
      runtime?.destroy();
    };
  }, []);
  useEffect(() => {
    const sections = document.querySelectorAll(
      "main > section[id], main footer[id]",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menu) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [
          menuButton.current,
          ...Array.from(
            menuPanel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const index = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index === 0) {
          e.preventDefault();
          nodes[nodes.length - 1]?.focus();
        } else if (!e.shiftKey && index === nodes.length - 1) {
          e.preventDefault();
          nodes[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", handler);
    };
  }, [menu]);
  return (
    <div className="premium-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div
        aria-hidden="true"
        className="reading-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
      />
      <header className={`premium-nav ${menu ? "menu-is-open" : ""}`}>
        <a className="nav-name" href="#top">
          harith<span>.</span>
        </a>
        <nav aria-label="Primary navigation">
          {["Work", "Experience", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              aria-current={
                active === item.toLowerCase() ? "location" : undefined
              }
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          href="/resume.html"
          className="resume-link"
          target="_blank"
          rel="noreferrer"
        >
          Résumé <ArrowUpRight size={13} />
        </a>
        <a href={`mailto:${portfolio.contact.email}`} className="nav-contact">
          Email Harith <ArrowUpRight size={15} />
        </a>
        <button
          ref={menuButton}
          className="mobile-menu-button"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div
            ref={menuPanel}
            id="mobile-navigation"
            className="mobile-navigation"
            initial={{ opacity: 0, y: reduced ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={spring}
          >
            {["Work", "Experience", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenu(false)}
              >
                {item}
                <ArrowUpRight size={24} />
              </a>
            ))}
            <a href="/resume.html" target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight size={22} />
            </a>
            <a href={`mailto:${portfolio.contact.email}`}>
              Email Harith <Mail size={22} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <main id="main">
        <Hero />
        <div className="intention-strip">
          <span>Engineering mindset.</span>
          <span>People first.</span>
          <span>Useful outcomes.</span>
          <ArrowDownRight size={25} />
        </div>
        <SelectedWork />
        <ExperienceStories />
        <About />
        <Contact />
      </main>
    </div>
  );
}
