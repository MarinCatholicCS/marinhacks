import { useState, useEffect, useRef } from 'react'
import './HackathonPage.css'
import xyzGuidePdf from './assets/xyz.pdf'

/* Event day is August 2, 2026 — Pacific Daylight Time (UTC−7).
   Every time below is pinned to that offset so the countdown reads the same
   no matter what timezone a participant's laptop happens to be set to. */
const at = (time) => new Date(`2026-08-02T${time}-07:00`)

const SUBMISSIONS_DUE = at('18:00:00')

const DISCORD_URL = 'https://discord.gg/apMVepA7fK'
const SLIDES_URL = 'https://docs.google.com/presentation/d/1FhC81Hd6JiTZipPSfEEf9bWlpIUblvla7CpzFJsLPhA/edit?usp=sharing'
const RUBRIC_URL = 'https://docs.google.com/document/d/1MawAUAX7cEP9iJZS9J5PYtmBIKCA4w5N4ESCzp_ieEY/edit?usp=sharing'
const DEVPOST_URL = 'https://marinhacks.devpost.com/'
const DOMAIN_PROMO = 'MRN2026'

/* Drives the "up next" line under the clock. */
const schedule = [
  {
    start: at('08:00:00'),
    time: '8:00 AM',
    title: 'Check-in',
    detail: 'Check in at the entrance of the JPII Student Center. Remember to bring your signed participant waiver. Feel free to get your workspace set up while you wait for the opening ceremony.',
  },
  {
    start: at('08:15:00'),
    time: '8:15 AM',
    title: 'Welcome Presentation',
    detail: 'Opening remarks from the organizing team, introductions to our staff, sponsors, and judges, and a walkthrough of everything you need to know for the day.',
  },
  {
    start: at('08:30:00'),
    time: '8:30 AM',
    title: 'Theme Reveal & Start',
    detail: 'The overall theme and track categories are revealed. Hacking officially begins immediately after the announcement.',
  },
  {
    start: at('09:00:00'),
    time: '9:00 AM',
    title: 'Intro to Vibe Coding',
    detail: 'Workshop led by Stanley Ho on leveraging coding agents to ship a project with little to no prior experience.',
  },
  {
    start: at('09:30:00'),
    time: '9:30 AM',
    title: 'How to Hackathon',
    detail: 'Workshop led by Nico Zametto — a 4x hackathon winner — on scoping your idea, building under time pressure, and delivering a compelling demo.',
  },
  {
    start: at('12:00:00'),
    time: '12:00 PM',
    title: 'Lunch',
    detail: 'Catered pizza. Step away from your project, meet other participants, and recharge for the afternoon.',
  },
  {
    start: at('13:00:00'),
    time: '1:00 PM',
    title: 'Boba Break',
    detail: 'Courtesy of our local sponsor Sharetea. Participants who selected a boba drink during registration can pick up their free drink.',
  },
  {
    start: SUBMISSIONS_DUE,
    time: '6:00 PM',
    title: 'Submissions Due',
    detail: 'All projects must be submitted to Devpost by 6:00 PM sharp. Any commits to your repository after the deadline will result in immediate disqualification. You are welcome to keep refining your presentation and demo after submitting.',
  },
  {
    start: at('18:10:00'),
    time: '6:10 PM',
    title: 'Dinner',
    detail: 'Panda Express is served while teams prepare for their judging slots. Fuel up before you present.',
  },
  {
    start: at('18:30:00'),
    time: '6:30 PM',
    title: 'Judging Begins',
    detail: 'Teams are called in scheduled order to present to a panel of three judges. Be ready to walk through your project, explain your process, and demo what you built.',
  },
  {
    start: at('19:30:00'),
    time: '7:30 PM',
    title: 'Geoguessr & Trivia',
    detail: 'Hosted by Alex Willard. Open to everyone while the judges finalize scores and deliberate on winners.',
  },
  {
    start: at('20:00:00'),
    time: '8:00 PM',
    title: 'Closing Ceremony',
    detail: 'Winners announced, awards handed out, and closing remarks. However it shakes out, take pride in what you built — creating something from nothing in 12 hours is no small feat.',
  },
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

/* ── Ticking clock ── */
function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function splitDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total / 60) % 60),
    seconds: total % 60,
  }
}

/* Compact "in 2h 14m" phrasing for the up-next line */
function formatUntil(ms) {
  if (ms <= 0) return 'happening now'
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `in ${hours}h ${minutes}m`
  if (totalMinutes > 0) return `in ${totalMinutes} min`
  return `in ${Math.max(1, Math.ceil(ms / 1000))} sec`
}

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
  const now = useNow()

  const untilDeadline = SUBMISSIONS_DUE - now
  const deadlinePassed = untilDeadline <= 0
  const clock = splitDuration(untilDeadline)

  const nextEvent = schedule.find((item) => item.start > now) ?? null

  return (
    <>
      <main>
        {/* ── LIVE COUNTDOWN ── */}
        <header className="hk-hero">
          <div className="hk-hero-grid" aria-hidden="true" />
          <div className="hk-hero-inner">
            <p className="hk-clock-caption">
              {deadlinePassed ? 'Submissions closed at 6:00 PM' : 'Submissions close at 6:00 PM'}
            </p>

            <div
              className="hk-clock"
              role="timer"
              aria-label={`${clock.hours} hours and ${clock.minutes} minutes until the 6:00 PM submission deadline`}
            >
              <div className="hk-clock-unit">
                <span className="hk-clock-value">{pad(clock.hours)}</span>
                <span className="hk-clock-label">Hours</span>
              </div>
              <span className="hk-clock-colon" aria-hidden="true">:</span>
              <div className="hk-clock-unit">
                <span className="hk-clock-value">{pad(clock.minutes)}</span>
                <span className="hk-clock-label">Minutes</span>
              </div>
              <span className="hk-clock-colon" aria-hidden="true">:</span>
              <div className="hk-clock-unit">
                <span className="hk-clock-value">{pad(clock.seconds)}</span>
                <span className="hk-clock-label">Seconds</span>
              </div>
            </div>

            {/* ── UP NEXT ── */}
            <div className="hk-next">
              <div className="hk-next-head">
                <span className="hk-eyebrow">Up next</span>
                <span className="hk-next-time">{nextEvent ? nextEvent.time : '—'}</span>
              </div>
              <div className="hk-next-body">
                <h2 className="hk-next-title">{nextEvent ? nextEvent.title : 'That’s a wrap'}</h2>
                <p className="hk-next-detail">
                  {nextEvent
                    ? nextEvent.detail
                    : 'Every scheduled event has finished. Thanks for hacking with us.'}
                </p>
              </div>
              {nextEvent && <span className="hk-next-in">{formatUntil(nextEvent.start - now)}</span>}
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
                    The theme is <strong>Safety</strong>. Every project must relate to it, including
                    those in a track.
                  </p>
                </li>
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Submissions</span>
                  <p className="hk-announce-body">
                    Every project is submitted on the{' '}
                    <a href={DEVPOST_URL} target="_blank" rel="noreferrer" className="hk-link">
                      MarinHacks Devpost
                    </a>
                    . Submissions close at 6:00 PM sharp.
                  </p>
                </li>
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Judging rubric</span>
                  <p className="hk-announce-body">
                    The rubric judges will score you against is published.{' '}
                    <a href={RUBRIC_URL} target="_blank" rel="noreferrer" className="hk-link">
                      Read it before you present
                    </a>
                    .
                  </p>
                </li>
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Wi-Fi</span>
                  <p className="hk-announce-body">
                    Network <span className="hk-cred">marinhacks</span>, password{' '}
                    <span className="hk-cred">Zametto!</span> — the exclamation mark is part of the
                    password.
                  </p>
                </li>
                <li className="hk-announce-item">
                  <span className="hk-announce-label">Merch &amp; swag</span>
                  <p className="hk-announce-body">
                    MarinHacks merchandise and sponsor swag are out in the front area. Come grab
                    yours whenever you need a break from your project.
                  </p>
                </li>
              </ul>
            </div>

            <p className="hk-eyebrow hk-section-eyebrow">Details</p>
            <h2 className="hk-section-title">Everything you need today</h2>
            <p className="hk-section-desc">
              Links, codes, and resources for the event. Announcements go out in Discord first, so
              keep it open while you build.
            </p>

            <div className="hk-cards">
              <div className="hk-card">
                <h3 className="hk-card-title">Discord</h3>
                <p className="hk-card-body">
                  Live announcements, mentor help, team-finding, and judging call-ups all happen in
                  the server. Every participant should be in it.
                </p>
                <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hk-btn hk-btn-primary">
                  Join the server
                </a>
              </div>

              <div className="hk-card">
                <h3 className="hk-card-title">Opening Ceremony</h3>
                <p className="hk-card-body">
                  The full opening deck — theme, tracks, rules, and logistics. Refer back to it any
                  time you need to double-check something from this morning.
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
            <h2 className="hk-section-title">How presentations work</h2>
            <p className="hk-section-desc">
              Judging starts at 6:30 PM and teams are called in scheduled order. Read these before
              you present — a project that misses any of them cannot be scored.
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
