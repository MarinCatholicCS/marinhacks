import { useState, useEffect, useRef } from 'react'
import './HackathonPage.css'
import xyzGuidePdf from './assets/xyz.pdf'

const DISCORD_URL = 'https://discord.gg/apMVepA7fK'
const SLIDES_URL = 'https://docs.google.com/presentation/d/1FhC81Hd6JiTZipPSfEEf9bWlpIUblvla7CpzFJsLPhA/edit?usp=sharing'
const RUBRIC_URL = 'https://docs.google.com/document/d/1MawAUAX7cEP9iJZS9J5PYtmBIKCA4w5N4ESCzp_ieEY/edit?usp=sharing'
const DEVPOST_URL = 'https://marinhacks.devpost.com/'
const DOMAIN_PROMO = 'MRN2026'

const winners = [
  { place: 'Overall — 1st ($500)', team: 'Seismic', members: 'Vihaan Gangai' },
  { place: 'Overall — 2nd ($300)', team: 'Firefly', members: 'Sanreen Khosla, Meghna Magesh' },
  { place: 'Overall — 3rd ($200)', team: 'Probe', members: 'Sahaj Khandelwal, Stas Kornuta, Maxim Shvets' },
  { place: 'Fintech Track — 1st', team: 'Overseer', members: 'Arnav P, Aarav M, Vivaan D, Prayag N' },
  { place: 'Fintech Track — 2nd', team: 'Splitkeypq', members: 'Akahl Saokar, Manav Patel, Tejas Tammana' },
  { place: 'MoHack / Coolest Project', team: 'Ledge', members: 'Anne Nolte, Adam Zheng, Owen Cheng' },
  { place: 'Best Beginner', team: 'Allroots', members: 'John Ha, Yuhe Liu, Carson Zenahrio, Bhargava Gumpula' },
  { place: 'Best Solo', team: 'Findr', members: 'Nayan Vangala' },
]

const judgingRules = [
  {
    title: 'Four minutes, maximum',
    body: 'Your slot with the judges is capped at four minutes. Rehearse against a timer so you finish inside it.',
  },
  {
    title: 'A live demo is required',
    body: 'You have to show the project actually running. Slides and screenshots on their own do not count as a demo.',
  },
  {
    title: 'Leave room for questions',
    body: 'Judges will have questions. Pace your presentation so there is time left to answer them.',
  },
  {
    title: 'Open source on GitHub',
    body: 'Your code must be publicly available in a GitHub repository, and that link has to be part of your submission.',
  },
  {
    title: 'Devpost submission required',
    body: 'Every project needs a Devpost submission in by 6:00 PM. A project without one cannot be judged.',
  },
  {
    title: 'Built at Marin Catholic',
    body: 'All projects must have been made here at Marin Catholic during the event. Pre-existing work is not eligible.',
  },
]

const pad = (n) => String(n).padStart(2, '0')

/* Select the code so it can be copied by hand when the clipboard API is
   unavailable — some mobile browsers block it outside a secure context. */
function selectNode(node) {
  const selection = window.getSelection()
  if (!selection) return false
  const range = document.createRange()
  range.selectNodeContents(node)
  selection.removeAllRanges()
  selection.addRange(range)
  return true
}

/* ── Promo code with copy-to-clipboard ── */
function PromoCode({ code }) {
  const [copied, setCopied] = useState(false)
  const valueRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const flashCopied = () => {
    setCopied(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      flashCopied()
      return
    } catch {
      /* Fall through to the manual-selection path below. */
    }

    if (valueRef.current && selectNode(valueRef.current)) {
      // execCommand is deprecated but remains the only fallback that still
      // works where the async clipboard API is blocked.
      if (document.execCommand?.('copy')) flashCopied()
    }
  }

  return (
    <button type="button" className="hk-code" onClick={copy}>
      <span className="hk-code-value" ref={valueRef}>{code}</span>
      <span className="hk-code-action">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

export default function HackathonPage() {
  return (
    <>
      <main>
        {/* ── RECAP HERO ── */}
        <header className="hk-hero">
          <div className="hk-hero-grid" aria-hidden="true" />
          <div className="hk-hero-inner">
            <p className="hk-clock-caption">MarinHacks 2026 has wrapped</p>

            {/* ── WINNERS ── */}
            <div className="hk-next">
              <div className="hk-next-head">
                <span className="hk-eyebrow">Winners</span>
              </div>
              <div className="hk-next-body">
                <h2 className="hk-next-title">Congratulations to every team</h2>
                <p className="hk-next-detail">
                  Thank you to everyone who came out and built with us. Here's who took home the wins.
                </p>
              </div>
              <ul className="hk-announce-list">
                {winners.map((w) => (
                  <li className="hk-announce-item" key={w.place}>
                    <span className="hk-announce-label">{w.place}</span>
                    <p className="hk-announce-body">
                      <strong>{w.team}</strong> — {w.members}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        {/* ── DETAILS ── */}
        <section id="details" className="hk-section">
          <div className="hk-container">
            <div className="hk-announce">
              <span className="hk-eyebrow">Announcements</span>
              <ul className="hk-announce-list">
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Theme</span>
                  <p className="hk-announce-body">
                    The theme was <strong>Safety</strong>. Every project related to it, including
                    those in a track.
                  </p>
                </li>
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Submissions</span>
                  <p className="hk-announce-body">
                    Every project was submitted on the{' '}
                    <a href={DEVPOST_URL} target="_blank" rel="noreferrer" className="hk-link">
                      MarinHacks Devpost
                    </a>
                    . Take a look at what teams built.
                  </p>
                </li>
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Judging rubric</span>
                  <p className="hk-announce-body">
                    The rubric judges scored against is published.{' '}
                    <a href={RUBRIC_URL} target="_blank" rel="noreferrer" className="hk-link">
                      Take a look
                    </a>
                    .
                  </p>
                </li>
              </ul>
            </div>

            <p className="hk-eyebrow hk-section-eyebrow">Details</p>
            <h2 className="hk-section-title">Recap and resources</h2>
            <p className="hk-section-desc">
              Links and resources from the event, kept here for reference.
            </p>

            <div className="hk-cards">
              <div className="hk-card">
                <h3 className="hk-card-title">Discord</h3>
                <p className="hk-card-body">
                  Our community lives on. Join the server to stay in touch, hear about future
                  MarinHacks events, and keep building with people you met on event day.
                </p>
                <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hk-btn hk-btn-primary">
                  Join the server
                </a>
              </div>

              <div className="hk-card">
                <h3 className="hk-card-title">Opening Ceremony</h3>
                <p className="hk-card-body">
                  The full opening deck — theme, tracks, rules, and logistics from event day, kept
                  here for reference.
                </p>
                <a href={SLIDES_URL} target="_blank" rel="noreferrer" className="hk-btn hk-btn-secondary">
                  Open the slides
                </a>
              </div>

              <div className="hk-card">
                <h3 className="hk-card-title">Free .XYZ Domain</h3>
                <p className="hk-card-body">
                  Our sponsor{' '}
                  <a href="https://gen.xyz/" target="_blank" rel="noreferrer" className="hk-link">.xyz</a>{' '}
                  is covering a domain for your project. Apply this promo code at checkout — no
                  spaces.
                </p>
                <PromoCode code={DOMAIN_PROMO} />
                <a href={xyzGuidePdf} target="_blank" rel="noreferrer" className="hk-card-aside">
                  Step-by-step redemption guide (PDF)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── JUDGING ── */}
        <section id="judging" className="hk-section hk-section-alt">
          <div className="hk-container">
            <p className="hk-eyebrow hk-section-eyebrow">Judging</p>
            <h2 className="hk-section-title">How presentations worked</h2>
            <p className="hk-section-desc">
              Judging began at 6:30 PM with teams called in scheduled order. These were the rules
              every presenting team followed.
            </p>

            <ol className="hk-rules">
              {judgingRules.map((rule, i) => (
                <li className="hk-rule" key={rule.title}>
                  <span className="hk-rule-num">{pad(i + 1)}</span>
                  <div className="hk-rule-body-wrap">
                    <h3 className="hk-rule-title">{rule.title}</h3>
                    <p className="hk-rule-body">{rule.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="hk-footer">
        <div className="hk-footer-logo">Marin<span>Hacks</span></div>
        <p className="hk-footer-copy">© 2026 MarinHacks · Marin Catholic · Kentfield, CA</p>
        <a href="mailto:marinhacksofficial@gmail.com" className="hk-link hk-footer-mail">
          marinhacksofficial@gmail.com
        </a>
      </footer>
    </>
  )
}
