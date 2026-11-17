"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxqUPdLljnoEh4bdWaUyCywLkvdoBRlpZNDj0nff4TPxXwJyDV0yzgJJTHnus9--TFw/exec";
const SHOW_GIFTS = false;

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const photos = [
  asset("/watercolor-embrace-of-love.png"),
  asset("/watercolour-romance.png"),
  asset("/dreamy-watercolour-couple-portrait.png"),
];

function Petals() {
  const petals = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    left: i % 2 === 0 ? `${(i * 11) % 20}%` : `${80 + ((i * 13) % 20)}%`, delay: `${-((i * 2.7) % 18)}s`, duration: `${10 + (i % 8)}s`, sway: i % 2 ? -1 : 1,
    color: ["#e28d95", "#c95964", "#f4b8be", "#e9c176", "#7d957e"][i % 5], size: `${18 + (i % 5) * 4}px`,
  })), []);
  return <><div className="petals" aria-hidden="true">{petals.map((p, i) => <span key={i} className={`petal petal-${i % 4}`} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, ["--sway" as string]: `${p.sway * (10 + i % 4 * 7)}px`, ["--petal-sprite" as string]: `url(${asset("/petals/rose-petal-sprite.png")})`, width: p.size, height: `calc(${p.size} * 1.2)` }} />)}</div><WelcomeOverlay /></>;
}

function WelcomeOverlay() {
  const [open, setOpen] = useState(false);
  const openInvitation = () => {
    const audio = document.querySelector<HTMLAudioElement>("audio");
    setOpen(true);
    audio?.play().catch(() => {});
  };
  if (open) return null;
  return <div className="welcome-screen"><div className="welcome-card"><p className="eyebrow">Bijin &amp; Devu</p><h1>Our Wedding Invitation</h1><p>Join us as we begin our auspicious journey together.</p><button onClick={openInvitation}>Open Invitation <span>↗</span></button></div></div>;
}

function Countdown() {
  const [remaining, setRemaining] = useState(0);
  const target = new Date("2027-02-07T12:00:00+05:30").getTime();
  useEffect(() => { setRemaining(target - Date.now()); const timer = window.setInterval(() => setRemaining(target - Date.now()), 1000); return () => window.clearInterval(timer); }, [target]);
  const values = remaining <= 0 ? [0, 0, 0, 0] : [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <div className="countdown">{values.map((value, i) => <div className="count-box" key={i}><strong>{String(value).padStart(2, "0")}</strong><span>{["Days", "Hours", "Mins", "Secs"][i]}</span></div>)}</div>;
}

export default function Home() {
  const [music, setMusic] = useState(false); const [toast, setToast] = useState(""); const [giftBlessing, setGiftBlessing] = useState(""); const [submitting, setSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const startMusic = () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.play().then(() => setMusic(true)).catch(() => {});
    };
    window.addEventListener("pointerdown", startMusic, { once: true });
    return () => window.removeEventListener("pointerdown", startMusic);
  }, []);
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) { await audio.play(); setMusic(true); }
      else { audio.pause(); setMusic(false); }
    } catch { setMusic(false); }
  };
  const share = async () => { try { if (navigator.share) await navigator.share({ title: "Bijin & Devu — The Wedding Celebration", text: "Join us on 07 February 2027.", url: location.href }); else { await navigator.clipboard.writeText(location.href); setToast("Invitation link copied"); setTimeout(() => setToast(""), 2500); } } catch {} };
  const calendar = () => { const url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding%3A%20Bijin%20%26%20Devu&dates=20270207T063000Z%2F20270207T123000Z&location=Mannam%20Smaraka%20Mandiram%2C%20Kerala"; window.open(url, "_blank", "noopener,noreferrer"); };
  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (SHOW_GIFTS && !giftBlessing) { setToast("Please choose Yes or No for the gift blessing."); return; }
    const form = event.currentTarget;
    const values = new FormData(form);
    const file = values.get("paymentScreenshot");
    setSubmitting(true);
    try {
      const screenshot = file instanceof File && file.size > 0 ? { fileName: file.name, mimeType: file.type, base64: await fileToBase64(file) } : null;
      const payload = { name: values.get("name"), address: values.get("address"), marriage: values.get("marriage"), reception: values.get("reception"), side: values.get("side"), guests: values.get("guests"), giftBlessing: SHOW_GIFTS ? giftBlessing : "", giftAmount: values.get("giftAmount"), transactionId: values.get("transactionId"), message: values.get("message"), screenshot };
      await fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      setToast("Thank you — your RSVP has been sent.");
      form.reset();
      setGiftBlessing("");
    } catch { setToast("We could not send your RSVP. Please try again."); }
    finally { setSubmitting(false); }
  };
  return <><audio ref={audioRef} src={asset("/bangalore-days-bgm-malayalam.mp3")} loop preload="metadata" autoPlay onPlay={() => setMusic(true)} /><Petals /><header><div className="nav"><a className="monogram" href="#top">B<span>&amp;</span>D</a><nav className="nav-links" aria-label="Main navigation"><a className="active" href="#top">Home</a><a href="#story">Our Story</a><a href="#venues">Events</a><a href="#details">Details</a></nav><a className="brand" href="#top">Bijin &amp; Devu<small>Auspicious Union</small></a><button className="music" onClick={toggleMusic} aria-label={music ? "Pause music" : "Play music"}><i className={music ? "playing" : ""}>▮▮▮</i> <span>{music ? "Pause" : "Music"}</span></button></div></header><main id="top">
    <section className="hero"><div className="hero-card"><div className="hero-floral" aria-hidden="true"><img className="hero-floral-image" src={asset("/hero-porcelain-floral.png")} alt="" /></div><div className="ornament" /><div className="hero-content"><p className="eyebrow">श्री | ഓം നമശിവായ</p><p className="kicker">Bespoke Ceremonial Union</p><p className="intro">Together with their families and with the boundless blessings of God, joyfully invite you to celebrate the marriage of</p><h1>Bijin <em>&amp;</em> Devu</h1><div className="rule">∞</div><div className="date">07 February 2027 <b>•</b> Sunday <b>•</b> Kerala, India</div><div className="actions"><a href="#details">View Muhurtham Details</a><a className="light" href="#venues">Ceremony Venues</a></div></div></div><span className="scroll">Scroll to Explore ↓</span></section>
    <section className="section soft story-section" id="story"><div className="section-head"><p className="eyebrow">Divine Confluence</p><h2>Our Story</h2><p className="section-lead">A journey that began with friendship, grew with understanding, and continues into a lifelong commitment.</p><div className="rule">∞</div></div><div className="profiles"><Profile title="The Groom" name="Bijin B" parent="Sri Biju & Smt Ajitha Kumari K.C." text="Known for his quiet grace, radiant heart, and devotion to timeless values and familial warmth." img={photos[0]} /><Profile title="The Bride" name="Devu Sunil" parent="Sri Sunil & Smt Kala" text="Admired for her infectious vivacity, gentle kindness, artistic spirit, and thoughtful elegance." img={photos[1]} /></div></section>
    <section className="section" id="details"><div className="section-head"><p className="eyebrow">Sacred Timeline &amp; Celebration</p><h2>Auspicious Countdown</h2><div className="rule">∞</div></div><div className="countdown-card"><p className="eyebrow">Auspicious Moment</p><div className="date-display" aria-label="Wedding date: February 7, 2027"><strong>07</strong><span><b>FEBRUARY</b><small>2027</small></span></div><h2>Our Wedding</h2><p>12:00 PM IST at Mannam Smaraka Mandiram, Kerala</p><Countdown /><div className="gallery">{photos.map((photo, i) => <img src={photo} alt="Wedding detail" key={i} />)}</div><p className="quote">“Two souls, one sacred path blessed by time and tradition”</p></div></section>
    <section className="section soft" id="venues"><div className="section-head"><p className="eyebrow">Destinations of Grace</p><h2>Sacred Venues</h2></div><div className="venues"><Venue title="Mannam Smaraka Mandiram" tag="Auspicious Muhurtham" time="12:00 PM – 12:45 PM" text="Witness the sacred Kanyadaanam, Thalikettu, exchange of floral garlands, and traditional Kerala Sadya feast." link="https://www.google.com/maps/search/?api=1&query=Mannam%20Smaraka%20Mandiram%2C%20Temple%20Road%2C%20Kallissery%2C%20Chengannur%2C%20Kerala%20689121" /><Venue title="Marthoma Community Hall" tag="Grand Soirée" time="Evening Felicitations & Dinner" text="An enchanting evening of camaraderie, live cultural orchestra, joyous melodies, heartfelt congratulations, and delectable feasts." link="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwjg0v-_m_aXAxUAAAAAHQAAAAAQCg..i&sca_esv=bd3a8f772863d765&udm&fvr=1&pvq=Cg0vZy8xMWNzcHR2Z2JkIhkKE21hcnRob21hIGF1ZGl0b3JpdW0QAhgDiQG2ODKatUO4sA&lqi=CiBtYXJ0aG9tYSBhdWRpdG9yaXVtIGt1bGlrYW1wYWxhbUjM8vTc4quAgAhaKBAAEAEYACIgbWFydGhvbWEgYXVkaXRvcml1bSBrdWxpa2FtcGFsYW2SARBjb21tdW5pdHlfY2VudGVy&cs=1&um=1&ie=UTF-8&fb=1&gl=in&sa=X&ftid=0x3b06227ec220892d:0xb0b843b59a3238b6" /></div></section>
    <section className="section invitation"><p className="eyebrow">ഓം ശ്രീ ഗണേശായ നമഃ • മാംഗല്യ ക്ഷണം</p><h2>സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു</h2><p>ഞങ്ങളുടെ പ്രിയപ്പെട്ട <b>ബിജിൻ ബി.</b>യുടെയും <b>ദേവു സുനിലിന്റെയും</b> വിവാഹ മംഗളവേളയിൽ താങ്കളുടെയും കുടുംബത്തിന്റെയും സാന്നിധ്യം സാദരം ക്ഷണിച്ചുകൊള്ളുന്നു.</p><div className="rule">∞</div><b>ഉപചാരപൂർവ്വം<br />അജിൻ ബി.</b></section>
    <section className="closing"><p className="eyebrow">Save the Auspicious Date</p><h2>Be Part of Our Journey</h2><p>Add our wedding celebration to your calendar to stay reminded of the auspicious timings and locations.</p><div className="actions"><button onClick={calendar}>＋ Add to Google Calendar</button><button className="light" onClick={share}><svg className="share-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></svg> Share Invitation</button></div>{toast && <div className="toast">{toast}</div>}</section>
    <section className="section rsvp-section" id="rsvp"><div className="rsvp-card"><div className="rsvp-art" aria-hidden="true"><img src={asset("/dreamy-watercolour-couple-transparent.png")} alt="" /></div><div className="rsvp-content"><p className="eyebrow">A Gentle Reply</p><h2>Will You Join Us?</h2><p className="rsvp-intro">Your presence would make our wedding celebration even more meaningful. Kindly let us know how you will be joining us.</p><form className="rsvp-form" onSubmit={submitRsvp} aria-busy={submitting}><label>Full name<input name="name" type="text" placeholder="Your name" required /></label><label>Address / House name<input name="address" type="text" placeholder="Your address or house name" /></label><div className="rsvp-grid rsvp-span-2"><label>Marriage ceremony<select name="marriage" defaultValue=""><option value="" disabled>Select one</option><option>Yes, I will attend</option><option>No, I cannot attend</option></select></label><label>Reception<select name="reception" defaultValue=""><option value="" disabled>Select one</option><option>Yes, I will attend</option><option>No, I cannot attend</option></select></label></div><div className="rsvp-grid rsvp-span-2"><label>Joining from<select name="side" defaultValue=""><option value="" disabled>Select side</option><option value="groom">Groom's side</option><option value="bride">Bride's side</option></select></label><label>Number of guests<input name="guests" type="number" min="1" max="20" placeholder="1" /></label></div><label className="rsvp-message rsvp-span-2">A note for the couple<textarea name="message" rows={2} placeholder="Share a warm note, if you wish" /></label>{SHOW_GIFTS && <fieldset className="rsvp-gift-fields rsvp-span-2"><legend>Would you like to give a gift blessing? (സംഭാവന)</legend><div className="gift-choice"><button className={giftBlessing === "yes" ? "gift-pill active" : "gift-pill"} type="button" onClick={() => setGiftBlessing("yes")}>Yes, with love</button><button className={giftBlessing === "no" ? "gift-pill active" : "gift-pill"} type="button" onClick={() => setGiftBlessing("no")}>No, thank you</button></div></fieldset>}{SHOW_GIFTS && giftBlessing === "yes" && <div className="gift-details rsvp-gift-details rsvp-span-2"><div className="gift-qr-note"><span>The payment QR code is below this form. Scan it, complete your payment, then enter the amount and upload your screenshot here.</span><em>“A blessing shared becomes a memory cherished.”</em></div><label>Gift amount<input type="number" min="1" name="giftAmount" placeholder="Amount in ₹" required /></label><label>UPI transaction ID<input type="text" name="transactionId" placeholder="Enter the transaction ID" required /></label><label>Payment screenshot<input type="file" name="paymentScreenshot" accept="image/png,image/jpeg,image/webp" required /></label></div>}<button className="rsvp-submit rsvp-span-2" type="submit" disabled={submitting}>{submitting && <i className="rsvp-spinner" aria-hidden="true" />}{submitting ? "Sending…" : "Submit Complete RSVP"} {!submitting && <svg className="rsvp-submit-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10 5l5 5-5 5" /></svg>}</button></form>{toast && <div className="rsvp-toast" role="status">{toast}</div>}<small className="rsvp-note">Your reply will be received with love and kept for the celebration arrangements.</small></div></div></section>
    {SHOW_GIFTS && <section className="section gifts-section" id="gifts"><div className="gift-card"><div><p className="eyebrow">A Small Blessing</p><h2>Gifts From the Heart</h2><p>Your presence is our greatest gift. If you would like to offer a blessing, scan the QR below and include your gift details in the RSVP form.</p><p className="gift-caption">Scan with Google Pay, PhonePe, or any UPI app.</p><div className="payment-methods" aria-label="Accepted payment methods"><span className="payment-pill gpay-pill"><img className="payment-logo" src={asset("/payment-logos/google-pay.png")} alt="Google Pay" /></span><span className="payment-pill upi-pill"><img className="payment-logo upi-logo" src={asset("/payment-logos/upi.svg")} alt="UPI" /></span><span className="payment-pill phonepe-pill"><img className="payment-logo" src={asset("/payment-logos/phonepe.svg")} alt="PhonePe" /></span></div></div><div className="upi-card"><img src={asset("/sindhubiju69-upi-qr.png")} alt="UPI payment QR code" /><span>Payment QR code</span></div></div></section>}
  </main><footer><strong>Bijin &amp; Devu</strong><p>With The Blessings of Our Beloved Families</p><small>© 2026 Bijin &amp; Devu Wedding Celebration</small></footer></>;
}

function Profile({ title, name, parent, text, img }: { title: string; name: string; parent: string; text: string; img: string }) { return <article className="profile"><img src={img} alt={name} /><div><p className="eyebrow">{title}</p><h3>{name}</h3><p>{text}</p><div className="parent"><small>Child of</small><b>{parent}</b></div></div></article>; }
function Venue({ title, tag, time, text, link }: { title: string; tag: string; time: string; text: string; link: string }) { return <article className="venue"><div className="venue-image"><span>{tag}</span><h3>{title}</h3></div><div className="venue-body"><p>{text}</p><strong>◷ {time}</strong><a href={link} target="_blank" rel="noreferrer"><svg className="map-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.25" /></svg> Open in Google Maps</a></div></article>; }
