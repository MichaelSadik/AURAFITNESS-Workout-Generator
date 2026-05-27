import React, { useState, useEffect, useRef } from "react";

const EXERCISE_POOL = {
  barbell: {
    quads: { name: "Barbell Back Squat", altKnee: "Box Squat", altBack: "Leg Press" },
    posterior: { name: "Barbell Deadlift", altKnee: "Barbell Hip Thrust", altBack: "Barbell Hip Thrust" },
    push: { name: "Barbell Bench Press", altShoulder: "Neutral Grip Floor Press", altWrist: "Forearm Plank Push-up" },
    pull: { name: "Pendlay Row", altShoulder: "Underhand Barbell Row", altWrist: "Band Row (Wrist Strapped)" },
  },
  smith: {
    quads: { name: "Smith Machine Squat", altKnee: "Smith Hack Squat", altBack: "Leg Press" },
    posterior: { name: "Smith Machine RDL", altKnee: "Smith Glute Bridge", altBack: "Smith Glute Bridge" },
    push: { name: "Smith Machine Bench", altShoulder: "Smith Floor Press", altWrist: "Machine Fly" },
    pull: { name: "Smith Machine Row", altShoulder: "Inverted Smith Row", altWrist: "Band Pull-apart" },
  },
  cables: {
    quads: { name: "Cable Goblet Squat", altKnee: "Cable Pull-Through", altBack: "Cable Leg Extension" },
    posterior: { name: "Cable RDL", altKnee: "Cable Glute Kickback", altBack: "Cable Glute Kickback" },
    push: { name: "Standing Cable Press", altShoulder: "Low-to-High Cable Fly", altWrist: "Cable Crossover (Cuffs)" },
    pull: { name: "Seated Cable Row", altShoulder: "Straight Arm Pulldown", altWrist: "Cable Row (Cuffs)" },
  },
  dumbbell: {
    quads: { name: "Dumbbell Goblet Squat", altKnee: "Dumbbell Step-up", altBack: "Bulgarian Split Squat" },
    posterior: { name: "Dumbbell RDL", altKnee: "Dumbbell Glute Bridge", altBack: "Dumbbell Glute Bridge" },
    push: { name: "Dumbbell Bench Press", altShoulder: "Neutral Grip DB Press", altWrist: "DB Floor Press" },
    pull: { name: "Single-Arm DB Row", altShoulder: "Chest-Supported DB Row", altWrist: "Band Row" },
  },
  kettlebell: {
    quads: { name: "KB Front Squat", altKnee: "KB Box Step-up", altBack: "Goblet Squat" },
    posterior: { name: "KB Swing", altKnee: "KB Glute Bridge", altBack: "KB Glute Bridge" },
    push: { name: "Single-Arm KB Press", altShoulder: "KB Floor Press", altWrist: "Push-up on KB Handles" },
    pull: { name: "Renegade Row", altShoulder: "Supported KB Row", altWrist: "Band Row" },
  },
  bands: {
    quads: { name: "Banded Squat", altKnee: "Banded Leg Extension", altBack: "Banded Leg Press" },
    posterior: { name: "Banded Good Morning", altKnee: "Banded Glute Bridge", altBack: "Banded Glute Bridge" },
    push: { name: "Banded Chest Press", altShoulder: "Banded Front Raise", altWrist: "Banded Fly (Forearm)" },
    pull: { name: "Banded Seated Row", altShoulder: "Banded Lat Pulldown", altWrist: "Banded Row (Forearm)" },
  },
  suspension: {
    quads: { name: "TRX Squat", altKnee: "TRX Assisted Lunge", altBack: "TRX Wall Sit" },
    posterior: { name: "TRX Hamstring Curl", altKnee: "TRX Glute Bridge", altBack: "TRX Glute Bridge" },
    push: { name: "TRX Chest Press", altShoulder: "TRX Tricep Press", altWrist: "TRX Forearm Plank" },
    pull: { name: "TRX Row", altShoulder: "TRX High Row", altWrist: "TRX Bicep Curl" },
  },
  bodyweight: {
    quads: { name: "Pistol Squat Progression", altKnee: "Wall Sit", altBack: "Air Squat" },
    posterior: { name: "Nordic Curl", altKnee: "Single-Leg Glute Bridge", altBack: "Glute Bridge" },
    push: { name: "Deficit Push-up", altShoulder: "Incline Push-up", altWrist: "Knuckle Push-up" },
    pull: { name: "Pull-up", altShoulder: "Inverted Bodyweight Row", altWrist: "Towel Pull-up" },
  },
};

const C = {
  bg: "#080808", s0: "#0f0f0f", s1: "#161616", s2: "#1e1e1e",
  bd: "#272727", bdHi: "#363636",
  accent: "#c8f000",
  accentA: "rgba(200,240,0,0.08)",
  accentB: "rgba(200,240,0,0.25)",
  text: "#f0f0f0", muted: "#666", dim: "#333",
  purple: "#9b8cff", purpleA: "rgba(155,140,255,0.09)", purpleB: "rgba(155,140,255,0.28)",
  green: "#22c55e", greenA: "rgba(34,197,94,0.08)", greenB: "rgba(34,197,94,0.28)",
};
const Fd = "'Barlow Condensed', Impact, sans-serif";
const Fm = "'IBM Plex Mono', 'Courier New', monospace";

function useFont() {
  useEffect(() => {
    if (document.getElementById("af-fonts")) return;
    const l = document.createElement("link");
    l.id = "af-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
}

const Lbl = ({ children, color }) => (
  <div style={{ fontFamily: Fm, fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: color || C.muted, marginBottom: 7 }}>
    {children}
  </div>
);

function StepBadge({ n, active, done }) {
  return (
    <div style={{
      width: 27, height: 27, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: Fm, fontSize: 10, fontWeight: 500,
      background: active ? C.accentA : "transparent",
      border: `1.5px solid ${active ? C.accent : done ? C.bdHi : C.bd}`,
      color: active ? C.accent : done ? C.muted : C.dim,
      transition: "all 0.25s",
    }}>
      {done ? "✓" : `0${n}`}
    </div>
  );
}

function StepProgress({ step, setStep }) {
  const steps = [{ n: 1, l: "Profile" }, { n: 2, l: "Hardware" }, { n: 3, l: "Safety" }];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, cursor: step > s.n ? "pointer" : "default" }}
            onClick={() => step > s.n && setStep(s.n)}>
            <StepBadge n={s.n} active={step === s.n} done={step > s.n} />
            <span style={{ fontFamily: Fm, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: step === s.n ? C.text : step > s.n ? C.muted : C.dim }}>
              {s.l}
            </span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 1, background: step > s.n ? C.accentB : C.bd, transition: "background 0.3s" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Timer({ restSecs, label }) {
  const [tl, setTl] = useState(null);
  const [on, setOn] = useState(false);
  const ref = useRef();
  const start = () => { clearInterval(ref.current); setTl(restSecs); setOn(true); };
  const stop = () => { clearInterval(ref.current); setOn(false); setTl(null); };
  useEffect(() => {
    if (on) ref.current = setInterval(() => setTl(t => {
      if (t <= 1) { setOn(false); clearInterval(ref.current); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(ref.current);
  }, [on]);
  const pct = tl !== null ? tl / restSecs : 1;
  const R = 22, circ = 2 * Math.PI * R;
  const m = Math.floor((tl ?? restSecs) / 60);
  const s = String((tl ?? restSecs) % 60).padStart(2, "0");
  const done = tl === 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.s1, border: `1px solid ${C.bd}`, borderRadius: 10 }}>
      <svg width={54} height={54} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        <circle cx={27} cy={27} r={R} fill="none" stroke={C.bd} strokeWidth={2.5} />
        <circle cx={27} cy={27} r={R} fill="none"
          stroke={done ? C.green : C.accent} strokeWidth={2.5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: on ? "stroke-dashoffset 0.95s linear" : "none" }}
        />
      </svg>
      <div style={{ flex: 1 }}>
        <Lbl>Rest Timer — {label}</Lbl>
        <div style={{ fontFamily: Fm, fontSize: 24, fontWeight: 500, color: done ? C.green : C.text, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {m}:{s}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={start} style={{ fontFamily: Fd, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 14px", borderRadius: 7, cursor: "pointer", background: on ? C.s2 : C.accentA, border: `1px solid ${on ? C.bd : C.accentB}`, color: on ? C.muted : C.accent }}>
          {on ? "Restart" : done ? "Again" : "Start"}
        </button>
        {tl !== null && (
          <button onClick={stop} style={{ fontFamily: Fd, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 12px", borderRadius: 7, cursor: "pointer", background: "transparent", border: `1px solid ${C.bd}`, color: C.muted }}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function AITip({ plan }) {
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!plan) return;
    setLoading(true); setTxt("");
    const prompt = `You are an elite strength and conditioning coach. Give exactly ONE specific coaching insight — 2 sentences maximum — for an athlete with: Goal: ${plan.title} | Equipment: ${plan.tier} | Physical limitation: ${plan.injury || "none"}. Be direct, technical, and immediately actionable. No greetings, no fluff.`;
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 130, messages: [{ role: "user", content: prompt }] })
    }).then(r => r.json()).then(d => {
      setTxt(d.content?.find(b => b.type === "text")?.text || "Coaching insight unavailable.");
      setLoading(false);
    }).catch(() => { setTxt("Could not load coaching insight."); setLoading(false); });
  }, [plan]);
  return (
    <div style={{ padding: "14px 16px", background: C.accentA, border: `1px solid ${C.accentB}`, borderRadius: 10 }}>
      <Lbl color={C.accent}>AI Coach Insight</Lbl>
      {loading ? (
        <div style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 2 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, animation: `blink 1.2s ${i * 0.22}s ease-in-out infinite` }} />
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, fontFamily: Fd, fontSize: 16, color: C.text, lineHeight: 1.55, letterSpacing: "0.01em" }}>{txt}</p>
      )}
    </div>
  );
}

function ExCard({ ex, sTotal, idx }) {
  const [done, setDone] = useState(0);
  const full = done >= sTotal;
  const isLower = ex.type === "lower";
  const accentCol = isLower ? C.accent : C.purple;
  const accentACol = isLower ? C.accentA : C.purpleA;
  const accentBCol = isLower ? C.accentB : C.purpleB;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
      background: full ? C.greenA : C.s1,
      border: `1px solid ${full ? C.greenB : C.bd}`,
      borderLeft: `3px solid ${full ? C.green : accentCol}`,
      borderRadius: 10, transition: "all 0.22s",
    }}>
      <div style={{ flexShrink: 0, width: 30, textAlign: "center" }}>
        <div style={{ fontFamily: Fm, fontSize: 8, color: C.dim, letterSpacing: "0.1em" }}>EX</div>
        <div style={{ fontFamily: Fd, fontSize: 28, fontWeight: 900, color: full ? C.green : C.dim, lineHeight: 1 }}>
          {String(idx + 1).padStart(2, "0")}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: Fm, fontSize: 9, color: full ? C.green : accentCol, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
          {ex.target}
        </div>
        <div style={{ fontFamily: Fd, fontSize: 19, fontWeight: 700, color: full ? C.green : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>
          {ex.exercise}
        </div>
        <div style={{ fontFamily: Fm, fontSize: 10, color: C.muted, marginTop: 3 }}>{ex.suggestedWeight}</div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: sTotal }, (_, i) => (
            <div key={i} onClick={() => setDone(i < done ? i : i + 1)} style={{
              width: 12, height: 12, borderRadius: 3, cursor: "pointer",
              background: i < done ? accentCol : C.s2,
              border: `1px solid ${i < done ? accentBCol : C.bd}`,
              transition: "all 0.12s",
            }} />
          ))}
        </div>
        <div style={{ fontFamily: Fm, fontSize: 9, color: C.muted }}>{done}/{sTotal} sets</div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ padding: "12px 14px", background: C.s1, border: `1px solid ${C.bd}`, borderRadius: 9 }}>
      <Lbl>{label}</Lbl>
      <div style={{ fontFamily: Fd, fontSize: 20, fontWeight: 700, color: C.text }}>{value}</div>
    </div>
  );
}

const EQUIP_LABELS = { barbell: "Barbell & Plates", smith: "Smith Machine", cables: "Cable Towers", dumbbell: "Dumbbells", kettlebell: "Kettlebells", bands: "Resistance Bands", suspension: "TRX Suspension", bodyweight: "Bodyweight Only" };
const INJ_LABELS = { none: "No Limitation", knee: "Knee Pain", back: "Back Pain", shoulder: "Shoulder Pain", wrist: "Wrist Pain" };

export default function App() {
  useFont();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [bw, setBw] = useState("");
  const [equip, setEquip] = useState({ barbell: false, smith: false, cables: false, dumbbell: false, kettlebell: false, bands: false, suspension: false, bodyweight: false });
  const [injury, setInjury] = useState("none");
  const [plan, setPlan] = useState(null);

  const step1ok = goal && Number(bw) > 0;
  const step2ok = Object.values(equip).some(Boolean);

  const calcWeight = (tier, lower, w, g) => {
    if (tier === "bodyweight" || tier === "suspension") return "Bodyweight";
    const mult = g === "strength" ? 1.3 : g === "endurance" ? 0.7 : 1.0;
    const n = parseFloat(w);
    if (tier === "barbell" || tier === "smith") return `${Math.round((n * (lower ? 0.75 : 0.55) * mult) / 5) * 5} lbs`;
    if (tier === "dumbbell" || tier === "kettlebell") return `${Math.round((n * (lower ? 0.25 : 0.15) * mult) / 5) * 5} lbs/hand`;
    return `${Math.round((n * 0.35 * mult) / 5) * 5} lbs`;
  };

  const generate = () => {
    const order = ["barbell", "smith", "cables", "dumbbell", "kettlebell", "bands", "suspension", "bodyweight"];
    const tier = order.find(t => equip[t]) || "bodyweight";
    const pool = EXERCISE_POOL[tier];
    const get = (cat) => {
      if ((cat === "quads" || cat === "posterior") && injury === "knee") return pool[cat].altKnee;
      if ((cat === "quads" || cat === "posterior") && injury === "back") return pool[cat].altBack;
      if ((cat === "push" || cat === "pull") && injury === "shoulder") return pool[cat].altShoulder;
      if ((cat === "push" || cat === "pull") && injury === "wrist") return pool[cat].altWrist;
      return pool[cat].name;
    };
    const sr = goal === "strength" ? "5 × 5" : goal === "hypertrophy" ? "4 × 10" : "3 × 15–20";
    const note = goal === "strength"
      ? "3–5 min rest. Prioritize bar speed and maximal neural drive."
      : goal === "hypertrophy"
      ? "90 sec rest. Control the eccentric. Maximize time under tension."
      : "45 sec rest. Aerobic efficiency and muscular stamina output.";
    setPlan({
      title: goal.charAt(0).toUpperCase() + goal.slice(1),
      tier, sr, note, injury,
      exercises: [
        { target: "Lower Body / Anterior", type: "lower", exercise: get("quads"), suggestedWeight: calcWeight(tier, true, bw, goal) },
        { target: "Lower Body / Posterior", type: "lower", exercise: get("posterior"), suggestedWeight: calcWeight(tier, true, bw, goal) },
        { target: "Upper Body / Push", type: "upper", exercise: get("push"), suggestedWeight: calcWeight(tier, false, bw, goal) },
        { target: "Upper Body / Pull", type: "upper", exercise: get("pull"), suggestedWeight: calcWeight(tier, false, bw, goal) },
      ],
    });
  };

  const reset = () => {
    setStep(1); setGoal(""); setBw(""); setInjury("none");
    setEquip({ barbell: false, smith: false, cables: false, dumbbell: false, kettlebell: false, bands: false, suspension: false, bodyweight: false });
    setPlan(null);
  };

  const setsN = goal === "strength" ? 5 : goal === "hypertrophy" ? 4 : 3;
  const restS = goal === "strength" ? 300 : goal === "hypertrophy" ? 90 : 45;
  const restLbl = goal === "strength" ? "5 min" : goal === "hypertrophy" ? "90 sec" : "45 sec";

  const inputS = { width: "100%", background: C.s0, border: `1px solid ${C.bd}`, borderRadius: 8, padding: "11px 14px", fontFamily: Fm, fontSize: 13, color: C.text, outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" };
  const btnP = { fontFamily: Fd, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "13px 18px", borderRadius: 8, background: C.accent, border: "none", color: "#080808", cursor: "pointer", flex: 1 };
  const btnS = { fontFamily: Fd, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "13px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${C.bd}`, color: C.muted, cursor: "pointer" };
  const btnSm = { ...btnS, fontSize: 11, padding: "8px 14px" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: Fd, padding: "24px 20px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentA} !important; }
        select option { background: #161616; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.bd}; border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: `1px solid ${C.bd}`, paddingBottom: 18, marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1 }}>
              <span style={{ fontFamily: Fd, fontSize: 42, fontWeight: 900, color: C.accent, letterSpacing: "-0.01em" }}>AURA</span>
              <span style={{ fontFamily: Fd, fontSize: 42, fontWeight: 400, color: C.muted }}>FITNESS</span>
            </div>
            <div style={{ fontFamily: Fm, fontSize: 9, color: C.dim, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 5 }}>
              Biometric Algorithmic Engine v2.5
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => {
              const b = new Blob([JSON.stringify({ goal, bw, equip, injury, plan }, null, 2)], { type: "application/json" });
              const u = URL.createObjectURL(b); const a = document.createElement("a");
              a.href = u; a.download = `aura-${goal || "workout"}.json`; a.click(); URL.revokeObjectURL(u);
            }} style={btnSm}>Export</button>
            <label style={{ ...btnSm, cursor: "pointer" }}>Import
              <input type="file" accept=".json" style={{ display: "none" }} onChange={e => {
                const f = e.target.files[0]; if (!f) return;
                const r = new FileReader(); r.onload = ev => {
                  try {
                    const d = JSON.parse(ev.target.result);
                    if (d.goal) setGoal(d.goal); if (d.bw) setBw(d.bw);
                    if (d.equip) setEquip(d.equip); if (d.injury) setInjury(d.injury);
                    if (d.plan) setPlan(d.plan);
                  } catch { alert("Invalid file."); }
                }; r.readAsText(f);
              }} />
            </label>
            <button onClick={reset} style={btnSm}>Reset</button>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 20, alignItems: "start" }}>

          {/* ── Config Panel ── */}
          <div style={{ background: C.s0, border: `1px solid ${C.bd}`, borderRadius: 14, padding: "22px", display: "flex", flexDirection: "column", gap: 22 }}>
            <StepProgress step={step} setStep={setStep} />

            {/* Big step number */}
            <div style={{ position: "relative", height: 76, overflow: "hidden" }}>
              <div style={{ fontFamily: Fd, fontSize: 110, fontWeight: 900, color: C.accentA, lineHeight: 0.82, letterSpacing: "-0.02em", userSelect: "none", position: "absolute", top: 0, left: -4 }}>
                {String(step).padStart(2, "0")}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 1 }}>
                <div style={{ fontFamily: Fd, fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {step === 1 ? "Profile Metrics" : step === 2 ? "Hardware Mapping" : "Safety Overrides"}
                </div>
              </div>
            </div>

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.2s ease" }}>
                <div>
                  <Lbl>Primary Goal</Lbl>
                  <select value={goal} onChange={e => setGoal(e.target.value)} style={inputS}>
                    <option value="" disabled>Select objective…</option>
                    <option value="strength">Strength — 5×5 Max Power</option>
                    <option value="hypertrophy">Hypertrophy — 4×10 Muscle Growth</option>
                    <option value="endurance">Endurance — 3×15 Stamina</option>
                  </select>
                </div>
                <div>
                  <Lbl>Bodyweight (lbs)</Lbl>
                  <input type="number" min={50} max={500} placeholder="e.g. 175" value={bw} onChange={e => setBw(e.target.value)} style={inputS} />
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div style={{ animation: "fadeUp 0.2s ease" }}>
                <Lbl>Available Hardware</Lbl>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {Object.entries(EQUIP_LABELS).map(([k, label]) => {
                    const on = equip[k];
                    return (
                      <label key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderRadius: 8, cursor: "pointer", background: on ? C.accentA : C.s1, border: `1px solid ${on ? C.accentB : C.bd}`, transition: "all 0.15s" }}>
                        <span style={{ fontFamily: Fd, fontSize: 15, fontWeight: on ? 700 : 400, color: on ? C.accent : C.muted, letterSpacing: "0.03em" }}>{label}</span>
                        <input type="checkbox" checked={!!on} onChange={() => setEquip(p => ({ ...p, [k]: !p[k] }))} style={{ accentColor: C.accent, width: 14, height: 14 }} />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div style={{ animation: "fadeUp 0.2s ease" }}>
                <Lbl>Active Limitations</Lbl>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {Object.entries(INJ_LABELS).map(([k, label]) => {
                    const sel = injury === k;
                    return (
                      <button key={k} onClick={() => setInjury(k)} style={{ padding: "13px 10px", borderRadius: 8, cursor: "pointer", background: sel ? C.purpleA : C.s1, border: `1px solid ${sel ? C.purpleB : C.bd}`, fontFamily: Fd, fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: sel ? C.purple : C.muted, transition: "all 0.15s" }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nav */}
            <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
              {step > 1 && <button onClick={() => setStep(s => s - 1)} style={btnS}>← Back</button>}
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={step === 1 ? !step1ok : !step2ok} style={{ ...btnP, opacity: (step === 1 ? !step1ok : !step2ok) ? 0.3 : 1, cursor: (step === 1 ? !step1ok : !step2ok) ? "not-allowed" : "pointer" }}>
                  Next →
                </button>
              ) : (
                <button onClick={generate} style={btnP}>Generate Protocol</button>
              )}
            </div>
          </div>

          {/* ── Output Panel ── */}
          <div style={{ background: C.s0, border: `1px solid ${C.bd}`, borderRadius: 14, padding: "22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ borderBottom: `1px solid ${C.bd}`, paddingBottom: 16 }}>
              <Lbl>Output / Workout Protocol</Lbl>
              <div style={{ fontFamily: Fd, fontSize: 28, fontWeight: 900, color: plan ? C.text : C.dim, letterSpacing: "0.02em" }}>
                {plan ? `${plan.title.toUpperCase()} PROTOCOL` : "AWAITING INPUT"}
              </div>
            </div>

            {plan ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp 0.25s ease" }}>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  <Stat label="Sets × Reps" value={plan.sr} />
                  <Stat label="Equipment" value={plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)} />
                  <Stat label="Modification" value={injury === "none" ? "Standard" : injury.charAt(0).toUpperCase() + injury.slice(1)} />
                </div>

                {/* Protocol note */}
                <div style={{ padding: "10px 14px", background: C.s1, border: `1px solid ${C.bd}`, borderRadius: 8, fontFamily: Fm, fontSize: 11, color: C.muted, lineHeight: 1.65 }}>
                  {plan.note}
                </div>

                {/* Exercise cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {plan.exercises.map((ex, i) => <ExCard key={i} ex={ex} sTotal={setsN} idx={i} />)}
                </div>

                {/* Rest timer */}
                <Timer restSecs={restS} label={restLbl} />

                {/* AI tip */}
                <AITip plan={plan} />

              </div>
            ) : (
              <div style={{ flex: 1, minHeight: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px dashed ${C.bd}`, borderRadius: 10, textAlign: "center", padding: 40 }}>
                <div style={{ fontFamily: Fm, fontSize: 10, color: C.dim, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>
                  // system standby
                </div>
                <div style={{ fontFamily: Fd, fontSize: 16, color: C.muted, lineHeight: 1.6 }}>
                  Complete the configuration steps<br />to generate your athletic protocol.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}