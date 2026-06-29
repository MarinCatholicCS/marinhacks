import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import jpii from './assets/jpii.jpg'
import stanley from './assets/stanley.jpg'
import alex from './assets/alex.jpg'
import nico from './assets/nico.jpg'
import marinhacksLogo from './assets/marinhacks.png'
import coderLogo from './assets/coder.svg'
import pcbwayLogo from './assets/PCBWay.jpg'
import codecraftersLogo from './assets/sponsors/codecrafters.svg'
import wolframLogo from './assets/sponsors/wolfram.png'
import aopsLogo from './assets/sponsors/aops.png'
import hackpilotLogo from './assets/sponsors/hackpilot.png'
import yriLogo from './assets/sponsors/yri.jpg'
import xyzLogo from './assets/sponsors/xyz-logo-color.png'
import mastraLogo from './assets/sponsors/mastra.svg'
import marinSonomaLogo from './assets/marinsonoma.webp'
import prospectusPdf from './assets/MarinHacks_Sponsorship_Prospectus.pdf'

const EVENT_DATE = new Date('2026-08-02T08:00:00-08:00')

const schedule = [
  { time: '8:00 AM', title: 'Check-in', desc: 'Participants arrive and get settled', detail: 'Check in at the entrance of the JPII Student Center. Remember to bring your signed participant waiver. Feel free to get your workspace set up while you wait for the opening ceremony.' },
  { time: '8:15 AM', title: 'Welcome Presentation', desc: 'Opening remarks and introductions', detail: 'Kick off MarinHacks with opening remarks from the organizing team. We will introduce our staff, sponsors, judges, and walk through everything you need to know for the day.' },
  { time: '8:30 AM', title: 'Theme Reveal & Start', desc: 'Theme announced — hacking begins!', detail: 'The overall theme and track categories will be revealed. Immediately following the announcement, hacking officially begins — good luck!' },
  { time: '9:00 AM', title: 'Intro to Vibe Coding', desc: 'Workshop led by Stanley Ho', detail: "Never made an app before? It's 2026 and easier than ever before to ship a project with little to no experience. A pioneer in ML and co-founder of OpenAI, Andrej Karpathy coined the term 'vibe-coding' last year and tweeted that he barely writes hand-written code anymore. Learn how to leverage coding agents to build anything you desire" },
  { time: '9:30 AM', title: "How to Hackathon", desc: 'Workshop led by Nico Zametto', detail: "Nico Zametto — a 4x hackathon winner and winner of a Y Combinator hackathon — will lead an interactive workshop on how to approach and excel at hackathons. Learn how to scope your idea, build efficiently under time pressure, and deliver a compelling demo." },
  { time: '10:00 AM', title: 'Chess Tournament', desc: 'Step away from the keyboard and compete', detail: 'Need a mental reset? Join our single-elimination blitz chess tournament running throughout the day. Games are 5 minutes each. The winner takes home some MarinHacks swag.' },
  { time: '12:00 PM', title: 'Lunch', desc: 'Catered lunch break — recharge and connect', detail: 'Take a break and enjoy a catered lunch featuring assorted sandwiches and salad. A great opportunity to step away from your project, meet other participants, and recharge for the afternoon.' },
  { time: '1:00 PM', title: 'Boba Break', desc: 'Complimentary boba courtesy of Sharetea', detail: 'Courtesy of our local sponsor Sharetea, participants who selected a boba drink during registration can pick up their free drink. A small perk to keep the energy going.' },
  { time: '6:00 PM', title: 'Submissions Due', desc: 'All projects must be submitted by 6:00 PM', detail: 'All projects must be submitted to DevPost by 6:00 PM sharp. Any commits to your repository after the deadline will result in immediate disqualification. You are welcome to continue refining your presentation and demo after submission.' },
  { time: '6:10 PM', title: 'Dinner', desc: 'Pizza served before judging begins', detail: 'Fuel up before you present. Pizza will be served while teams prepare for their judging slots.' },
  { time: '6:30 PM', title: 'Judging Begins', desc: 'Teams present to a panel of judges', detail: 'Teams will be called in scheduled order to present their projects to a panel of three judges. Be prepared to walk through your project, explain your process, and demo what you built.' },
  { time: '7:30 PM', title: 'Geoguessr & Trivia', desc: 'Open activities while results are tallied', detail: 'Hosted by Alex Willard, all participants are welcome to join a Geoguessr tournament and trivia rounds while the judges finalize scores and deliberate on winners.' },
  { time: '8:00 PM', title: 'Closing Ceremony', desc: 'Winners announced and closing remarks', detail: 'Join us for the closing ceremony as we announce the winners, hand out awards, and wrap up the day. Regardless of the outcome, take pride in what you built — creating something from nothing in 12 hours is no small feat.' },
]

const faqs = [
  {
    q: 'Who can participate?',
    a: 'MarinHacks is open to high school students who are 18 or younger on August 2nd, the day of the event. Qualified middle school students may appeal once the application is available. All skill levels are welcomed, though we recommend that you come in with a basic knowledge of programming and project management.',
  },
  {
    q: 'Is it free to attend?',
    a: 'Yes! MarinHacks is completely free to attend. We will provide catered meals, snacks, and all the resources you need to build your project.',
  },
  {
    q: 'What should I bring?',
    a: 'You should bring a portable laptop, charger, drinks, and snacks. Please do not bring anything too large, ex. External Monitors, 3D Printers. If you have any questions of what to bring, contact us through email or Discord.',
  },
  {
    q: 'Can I work alone or do I need a team?',
    a: 'Yes you can work alone! However, we highly encourage you find and work with a team. You learn many valuable lessons through code collaboration and version control.',
  },
  {
    q: 'Where is MarinHacks hosted?',
    a: <>{"MarinHacks will be held at the Marin Catholic's John Paul II Student Center. "}<a href="https://www.marincatholic.org/about/campus-map" target="_blank" rel="noreferrer" className="faq-link">View the campus map</a>.</>,
  },
  {
    q: 'What kind of projects can I build?',
    a: 'Anything! Websites, software, mobile apps, etc. Hardware Hacks are allowed, but are discouraged since no pre-built hardware projects are allowed and because of the short working time',
  },
  {
    q: "Is there a theme?",
    a: "Yes, there is a theme and it will be revealed during the opening ceremony. All projects, (even in different tracks), must relate to the theme.",
  },
  {
    q: "What are the prizes?",
    a: "Top teams will be awarded Amazon gift cards — $250 for 1st place, $150 for 2nd, and $100 for 3rd. Beyond the overall prizes, each track will feature its own dedicated awards, including research program scholarships and credits from our sponsor companies. All registered participants will receive access to a curated set of sponsor tools throughout the event.",
  }
]

const leads = [
  { name: 'Stanley Ho', role: 'Lead Director', initials: 'S', photo: stanley, linkedin: 'https://www.linkedin.com/in/stanley-ho-66748a338/' },
  { name: 'Nico Zametto', role: 'Lead Director', initials: 'N', photo: nico, linkedin: 'https://www.linkedin.com/in/nico-zametto-a862643b4/' },
  { name: 'Alex Willard', role: 'Outreach Director', initials: 'A', photo: alex, linkedin: 'https://www.linkedin.com/in/alex-willard-14aa5838b/' },
]

const assistantOrganizers = [
  { name: 'Gavin Pan', role: 'Assistant Organizer', initials: 'GP' },
  { name: 'Gavin Perry', role: 'Assistant Organizer', initials: 'GP' },
  { name: 'Wesley Fong', role: 'Assistant Organizer', initials: 'WF' },
  { name: 'Joseph Colombo', role: 'Assistant Organizer', initials: 'JC' },
  { name: 'Izzy Clayton', role: 'Assistant Organizer', initials: 'IC' },
]

const organizers = []

const advisors = [
  { name: 'Mr. Adib', role: 'Faculty Advisor', initials: 'MA' },
]

/* ── Countdown hook ── */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function getTimeLeft(targetDate) {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Animated counter ── */
function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10)
        if (isNaN(num)) { setDisplay(value); return }
        const prefix = value.match(/^[^0-9]*/)?.[0] || ''
        const dur = 1500
        const start = performance.now()
        const animate = (now) => {
          const t = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay(prefix + Math.round(eased * num))
          if (t < 1) requestAnimationFrame(animate)
          else setDisplay(value)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ── Starfield canvas ── */
function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const init = () => {
      resize()
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        da: (Math.random() - 0.5) * 0.015,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.alpha += s.da
        if (s.alpha > 1 || s.alpha < 0.1) s.da *= -1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96, 165, 250, ${s.alpha.toFixed(2)})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}

/* ── Floating shapes ── */
function FloatingShapes() {
  return (
    <div className="floating-shapes" aria-hidden="true">
      <div className="float-shape shape-1" />
      <div className="float-shape shape-2" />
      <div className="float-shape shape-3" />
      <div className="float-shape shape-4" />
      <div className="float-shape shape-5" />
    </div>
  )
}

/* ── FAQ with smooth accordion ── */
function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [ref, visible] = useReveal()

  return (
    <div className={`faq-item reveal${visible ? ' visible' : ''}`} ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {q}
        <span className={`faq-icon${open ? ' open' : ''}`}>+</span>
      </button>
      <div
        className="faq-answer-wrap"
        style={{ maxHeight: open ? contentRef.current?.scrollHeight : 0 }}
      >
        <div className="faq-answer" ref={contentRef}>{a}</div>
      </div>
    </div>
  )
}

/* ── Reveal wrapper for items in loops ── */
function RevealItem({ children, className = '', style = {}, threshold = 0.2 }) {
  const [ref, visible] = useReveal(threshold)
  return (
    <div className={`${className} reveal${visible ? ' visible' : ''}`} ref={ref} style={style}>
      {children}
    </div>
  )
}

function LinkedInIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-label="Discord">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

/* ── Team member card ── */
function TeamCard({ member, delay, isLead }) {
  const card = (
    <RevealItem className={`team-card${isLead ? ' team-card-lead' : ''}${member.linkedin ? ' team-card-link' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {member.photo
        ? <img src={member.photo} alt={member.name} className="team-avatar team-avatar-photo" loading="lazy" decoding="async" />
        : <div className="team-avatar">{member.initials}</div>
      }
      <h4>{member.name}</h4>
      <p>{member.role}</p>
      {member.linkedin && <span className="team-linkedin"><LinkedInIcon /></span>}
    </RevealItem>
  )
  return member.linkedin
    ? <a href={member.linkedin} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{card}</a>
    : card
}

/* ── Main App ── */
export default function App() {
  const [heroRef, heroVisible] = useReveal(0.1)
  const [statsRef, statsVisible] = useReveal(0.2)
  const [aboutRef, aboutVisible] = useReveal(0.1)
  const [schedRef, schedVisible] = useReveal(0.1)
  const [teamRef, teamVisible] = useReveal(0.1)
  const [sponsorsRef, sponsorsVisible] = useReveal(0.1)
  const [faqRef, faqVisible] = useReveal(0.1)
  const [ctaRef, ctaVisible] = useReveal(0.1)

  const countdown = useCountdown(EVENT_DATE)
  const [hoveredEvent, setHoveredEvent] = useState(schedule[0])

  /* Parallax on hero on mouse move */
  const heroContainerRef = useRef(null)
  const handleMouseMove = useCallback((e) => {
    const el = heroContainerRef.current
    if (!el) return
    const x = (e.clientX / window.innerWidth - 0.5) * 20
    const y = (e.clientY / window.innerHeight - 0.5) * 20
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }, [])

  return (
    <>
      <Starfield />

      {/* NAV */}
      <nav>
        <div className="nav-logo"><img src={marinhacksLogo} alt="MarinHacks" className="nav-logo-img" /></div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#schedule">Schedule</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#sponsors">Sponsors</a></li>
          <li><a href="#judges">Judges</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="https://hcb.hackclub.com/donations/start/marinhacks" target="_blank" rel="noreferrer" className="nav-donate">Donate</a></li>
          <li><a href="https://forms.gle/5eGxKWadr2QK13Lb7" target="_blank" rel="noreferrer" className="nav-cta">Apply Now</a></li>
        </ul>
      </nav>

      <main>
      {/* HERO */}
      <section className="hero" id="home" onMouseMove={handleMouseMove} ref={heroContainerRef}>
        <div className="hero-bg" />
        <div className="hero-grid" />
        <FloatingShapes />
        <div className={`hero-content${heroVisible ? ' visible' : ''}`} ref={heroRef}>
          <h1>
            Marin<span className="highlight">Hacks</span>
          </h1>
          <p className="hero-date">August 2, 2026 · Marin Catholic JPII Student Center, Kentfield CA</p>

          {/* Countdown Timer */}
          <div className="countdown">
            <div className="countdown-unit">
              <span className="countdown-number">{countdown.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-unit">
              <span className="countdown-number">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>

          <div className="hero-btns">
            <a href="https://forms.gle/5eGxKWadr2QK13Lb7" target="_blank" rel="noreferrer" className="btn-primary">
              Apply Now
            </a>
            <a href="https://discord.gg/apMVepA7fK" target="_blank" rel="noreferrer" className="btn-secondary">
              Join our Discord
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className={`stats${statsVisible ? ' visible' : ''}`} ref={statsRef}>
        <div className="stat" style={{ transitionDelay: '0ms' }}>
          <span className="stat-number"><AnimatedNumber value="12" /></span>
          <span className="stat-label">Hours of Hacking</span>
        </div>
        <div className="stat" style={{ transitionDelay: '100ms' }}>
          <span className="stat-number"><AnimatedNumber value="100" suffix="+" /></span>
          <span className="stat-label">Participants</span>
        </div>
        <div className="stat" style={{ transitionDelay: '200ms' }}>
          <span className="stat-number"><AnimatedNumber value="$1000" suffix="+" /></span>
          <span className="stat-label">In Prizes</span>
        </div>
        <div className="stat" style={{ transitionDelay: '300ms' }}>
          <span className="stat-number">Free</span>
          <span className="stat-label">To Attend</span>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="container" ref={aboutRef}>
          <div className={`about-grid reveal${aboutVisible ? ' visible' : ''}`}>
            <div>
              <p className="section-label">About</p>
              <h2 className="section-title">Build something amazing in 12 hours</h2>
              <p className="section-desc">
                MarinHacks is Marin Catholic's inaugural hackathon — a free, 12-hour event open to
                middle and high school students across the Bay Area. Come with an idea, leave with
                a project, and compete for prizes alongside hundreds of fellow builders.
              </p>
              <br />
              <p className="section-desc">
                We are trying to bring hackathons into Marin County and grow a STEM culture in our community.

              </p>
            </div>
            <div className={`venue-img-wrap reveal${aboutVisible ? ' visible' : ''}`} style={{ transitionDelay: '150ms' }}>
              <img src={jpii} alt="JPII Student Center at Marin Catholic" className="venue-img" loading="lazy" decoding="async" />
              <p className="venue-caption">John Paul II Student Center · Marin Catholic, Kentfield CA</p>
            </div>
          </div>

          <div className="about-cards-row">
            {[
              { title: 'Theme-Based', desc: 'Build projects around a revealed theme which will be announced day of' },
              { title: 'Catered Food', desc: 'Lunch and dinner provided. Stay fueled and focused all day.' },
              { title: 'Real Prizes', desc: 'Compete for Amazon gift cards, track-specific awards including scholarships and sponsor credits, and tool access for every participant.' },
              { title: 'All Skill Levels', desc: 'Beginners welcome. Solo or team. Form groups on the day of the event.' },
            ].map((card, i) => (
              <div className={`about-card reveal${aboutVisible ? ' visible' : ''}`} key={card.title} style={{ transitionDelay: `${300 + i * 100}ms` }}>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="schedule-section">
        <div className="container" ref={schedRef}>
          <div className={`reveal${schedVisible ? ' visible' : ''}`}>
            <p className="section-label">Schedule</p>
            <h2 className="section-title">Day of the event</h2>
            <p className="section-desc">
              A full day of building, learning, and competing. All times are approximate.
            </p>
          </div>
          <div className="schedule-layout">
            <div className="timeline">
              {schedule.map((item, i) => (
                <div
                  key={item.time}
                  onMouseEnter={() => setHoveredEvent(item)}
                >
                  <RevealItem className={`timeline-item${hoveredEvent === item ? ' hovered' : ''}`} style={{ transitionDelay: `${i * 80}ms` }} threshold={0.3}>
                    <div className="timeline-time">
                      {item.time.replace(/(AM|PM)/, '\u2009$1')}
                    </div>
                    <div className="timeline-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </RevealItem>
                </div>
              ))}
            </div>

            <div className="schedule-detail-panel">
              <div className="schedule-detail-card" key={hoveredEvent.time}>
                <div className="schedule-detail-time">{hoveredEvent.time}</div>
                <h3 className="schedule-detail-title">{hoveredEvent.title}</h3>
                <p className="schedule-detail-desc">{hoveredEvent.detail ?? hoveredEvent.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="schedule-section">
        <div className="container" ref={teamRef}>
          <div className={`reveal${teamVisible ? ' visible' : ''}`}>
            <p className="section-label">Team</p>
            <h2 className="section-title">Meet the organizers</h2>
            <p className="section-desc">
              MarinHacks is organized by the Marin Catholic Computer Science Club.
            </p>
          </div>

          {/* Lead Directors */}
          <div className="team-leads">
            {leads.map((member, i) => (
              <TeamCard key={member.name} member={member} delay={i * 100} isLead />
            ))}
          </div>

          {/* Assistant Organizers + Advisors */}
          <div className="team-grid team-assistants">
            {[...assistantOrganizers, ...advisors].map((member, i) => (
              <TeamCard key={member.name} member={member} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors">
        <div className="container" ref={sponsorsRef}>
          <div className={`reveal${sponsorsVisible ? ' visible' : ''}`}>
            <p className="section-label">Sponsors</p>
            <div className="sponsors-heading-row">
              <h2 className="section-title">Our Sponsors</h2>
              <a href={prospectusPdf} target="_blank" rel="noreferrer" className="btn-secondary">
                View Sponsorship Prospectus
              </a>
            </div>
            <p className="section-desc">
              MarinHacks is made possible by the generous support of our sponsors. We're
              actively reaching out to more partners — check back soon for additions.
            </p>
            <div className="sponsor-grid sponsor-grid-centered">
              <a href="https://www.msivfund.com/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={marinSonomaLogo} alt="Marin Sonoma" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://coder.com/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={coderLogo} alt="Coder" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://www.pcbway.com/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={pcbwayLogo} alt="PCBWay" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://codecrafters.io/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={codecraftersLogo} alt="CodeCrafters" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://www.wolfram.com/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={wolframLogo} alt="Wolfram" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://artofproblemsolving.com/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={aopsLogo} alt="Art of Problem Solving" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://www.hackpilot.io/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={hackpilotLogo} alt="HackPilot" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://www.yriscience.com/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={yriLogo} alt="YRI" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://gen.xyz/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={xyzLogo} alt=".XYZ" className="sponsor-logo" loading="lazy" decoding="async" />
              </a>
              <a href="https://mastra.ai/" target="_blank" rel="noreferrer" className="sponsor-card">
                <img src={mastraLogo} alt="Mastra" className="sponsor-logo" style={{ maxWidth: '130px' }} loading="lazy" decoding="async" />
              </a>
              <a href="mailto:marinhacksofficial@gmail.com" className="sponsor-card sponsor-card-cta">
                <div className="sponsor-cta-inner">
                  <span className="sponsor-cta-label">Your Company</span>
                  <span className="sponsor-cta-sub">Become a sponsor</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JUDGES */}
      <section id="judges">
        <div className="container">
          <div className={`reveal${sponsorsVisible ? ' visible' : ''}`}>
            <p className="section-label">Judges</p>
            <h2 className="section-title">Meet the judges</h2>
            <p className="section-desc">
              Our judging panel will be announced soon. We're bringing in industry professionals
              to evaluate projects and share feedback with participants.
            </p>
            <div className="tbd-placeholder">
              <div className="tbd-box">
                <span className="tbd-text">Judges TBD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container" ref={faqRef}>
          <div className={`reveal${faqVisible ? ' visible' : ''}`}>
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="faq-list">
            <div className="faq-col">
              {faqs.filter((_, i) => i % 2 === 0).map((item, i) => (
                <FaqItem key={item.q} q={item.q} a={item.a} delay={i * 80} />
              ))}
            </div>
            <div className="faq-col">
              {faqs.filter((_, i) => i % 2 !== 0).map((item, i) => (
                <FaqItem key={item.q} q={item.q} a={item.a} delay={i * 80 + 40} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="register" className="cta-section" ref={ctaRef}>
        <div className={`container reveal${ctaVisible ? ' visible' : ''}`}>
          <p className="section-label">Register</p>
          <h2 className="section-title">Ready to build?</h2>
          <p className="section-desc">
            Spots are limited. Sign up to secure your place at MarinHacks and be the first to hear
            about the theme, sponsors, and updates. More details to come.
          </p>
          <a href="https://forms.gle/5eGxKWadr2QK13Lb7" target="_blank" rel="noreferrer" className="btn-primary btn-glow">Apply Now</a>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Marin<span>Hacks</span></div>
        <div className="footer-contact">
          <a href="mailto:marinhacksofficial@gmail.com">marinhacksofficial@gmail.com</a>
        </div>
        <p className="footer-copy">© 2026 MarinHacks · Marin Catholic · Kentfield, CA</p>
        <p className="footer-hcb">
          Fiscally sponsored by{' '}
          <a href="https://hcb.hackclub.com/marinhacks" target="_blank" rel="noreferrer" className="footer-hcb-link">HCB</a>
        </p>
        <div className="footer-socials">
          <a href="https://discord.gg/apMVepA7fK" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Discord">
            <DiscordIcon />
          </a>
        </div>
      </footer>
    </>
  )
}
