"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";

const KAKAO_LINK = "http://pf.kakao.com/_CUPCX/chat";
const NAVER_CAFE_LINK = "https://cafe.naver.com/coincheating";
const LAWFIRM_SITE_LINK = "https://xn--9z2b2xi4aba940lua.com/";

const DAMAGE_TYPES = [
  "불법사채",
  "불법추심",
  "대리입금",
  "선이자·고금리 피해",
  "지인연락·직장연락 피해",
  "기타",
];

const PRESSURE_LEVELS = [
  "연락은 있으나 심하지 않음",
  "반복 연락으로 스트레스가 큼",
  "욕설·협박성 연락이 있음",
  "가족·지인·직장에 연락함",
  "사진유포·신상유포 등 위협이 있음",
];

const YES_NO = ["있음", "없음"];

const EVIDENCE_OPTIONS = [
  "계좌내역 있음",
  "문자·카톡 있음",
  "녹취 있음",
  "캡처 일부만 있음",
  "거의 없음",
];

const PRIVACY_POLICY_TEXT = `개인정보처리방침 안내

매일법률사무소(이하 “회사”)는 관련 법령에 따라 개인정보를 처리합니다.

1. 수집항목
이름, 연락처, 상담내용, 접속기록

2. 이용목적
상담 접수, 사실관계 확인, 법률서비스 안내, 민원 응대

3. 보유기간
상담 목적 달성 후 지체 없이 파기하되, 관련 법령상 보존 의무가 있는 경우 해당 기간 동안 보관합니다.

4. 문의
매일법률사무소 / 02-6283-1100 / maeil@lawmaeil.com`;

const urgencyMessages = {
  low: {
    label: "초기 대응 단계",
    title: "지금부터 기록을 남기면 대응이 훨씬 유리합니다.",
    desc: "현재 단계에서는 증거 보존과 연락 대응 가이드만 제대로 잡아도 이후 절차가 훨씬 정리됩니다.",
  },
  medium: {
    label: "우선 상담 권장",
    title: "추심 강도가 올라가기 전에 대응 방향을 잡는 것이 좋습니다.",
    desc: "상대방의 연락 방식과 상환 구조를 함께 검토해 두는 것이 안전합니다.",
  },
  high: {
    label: "긴급 대응 필요",
    title: "주변인 연락·협박 정황이 있다면 빠른 법률 대응이 중요합니다.",
    desc: "증거 확보, 대응 문구 정리, 합의 가능성 검토, 환수 가능성 확인을 서둘러 진행하는 편이 좋습니다.",
  },
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(String(value).replace(/[^0-9]/g, "") || 0);
}

function formatManwon(value) {
  return `${toNumber(value).toLocaleString("ko-KR")}만원`;
}

function FadeInSection({ children, className = "", delay = 0, threshold = 0.12 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transform-gpu transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CTAButton({ href, onClick, variant = "red", full = false, children }) {
  const base =
    "pressable inline-flex min-h-[60px] items-center justify-center rounded-2xl px-6 py-4 text-center text-sm font-extrabold transition md:min-h-[64px] md:text-base";
  const styleMap = {
    red: "bg-[linear-gradient(180deg,#d10022_0%,#980017_100%)] text-white hover:opacity-95 red-glow",
    dark: "border border-[#321015] bg-[#111111] text-white hover:bg-[#171717]",
    ghost: "border border-[#4b141c] bg-[#16090c] text-[#ffd7dd] hover:bg-[#1c0b0f]",
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className={cn(base, styleMap[variant], full && "w-full")}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, styleMap[variant], full && "w-full")}
    >
      {children}
    </button>
  );
}

function StepOptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pressable rounded-2xl border px-4 py-4 text-sm font-bold transition md:text-base",
        selected
          ? "border-[#7f1220] bg-[linear-gradient(180deg,#c10020_0%,#8f0015_100%)] text-white shadow-[0_16px_40px_rgba(140,0,20,0.22)]"
          : "border-[#2b2b2b] bg-[#111111] text-zinc-100 hover:border-[#5b1620] hover:bg-[#151515]"
      )}
    >
      {children}
    </button>
  );
}

function ProgressRing({ progress }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 170 170" className="h-full w-full -rotate-90">
        <circle cx="85" cy="85" r={radius} fill="none" stroke="#262626" strokeWidth="12" />
        <circle
          cx="85"
          cy="85"
          r={radius}
          fill="none"
          stroke="#c10020"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-black text-white">{progress}%</div>
        <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">
          분석중
        </div>
      </div>
    </div>
  );
}

function InfoBadge({ children }) {
  return (
    <span className="rounded-full border border-[#3f151c] bg-[#12090b] px-4 py-2 text-sm font-semibold text-zinc-200">
      {children}
    </span>
  );
}

function getDiagnosisPayload(form) {
  const principal = toNumber(form.loanAmount);
  const repaid = toNumber(form.repaidAmount);
  const overpaid = Math.max(0, repaid - principal);

  let score = 0;

  if (["불법사채", "대리입금", "선이자·고금리 피해"].includes(form.damageType)) {
    score += 2;
  }

  if (
    [
      "욕설·협박성 연락이 있음",
      "가족·지인·직장에 연락함",
      "사진유포·신상유포 등 위협이 있음",
    ].includes(form.pressureLevel)
  ) {
    score += 3;
  }

  if (form.evidence !== "거의 없음" && form.evidence !== "") {
    score += 2;
  }

  if (form.spreadDamage === "있음") {
    score += 3;
  }

  if (overpaid > 0) {
    score += 2;
  }

  const urgency = score >= 8 ? "high" : score >= 4 ? "medium" : "low";

  const actionItems = [];
  if (form.evidence !== "거의 없음" && form.evidence !== "") {
    actionItems.push("증거 보존 및 정리");
  }
  if (form.spreadDamage === "있음") {
    actionItems.push("주변인 연락·명예훼손 대응 검토");
  }
  if (form.pressureLevel === "사진유포·신상유포 등 위협이 있음") {
    actionItems.push("긴급 위협 대응 및 신고 검토");
  }
  if (overpaid > 0) {
    actionItems.push("초과 상환분 환수 가능성 검토");
  }
  actionItems.push("합의 가능성 및 대응 문구 정리");

  return {
    damageType: form.damageType,
    pressureLevel: form.pressureLevel,
    loanAmount: principal,
    repaidAmount: repaid,
    evidence: form.evidence,
    spreadDamage: form.spreadDamage,
    overpaidAmount: overpaid,
    urgency,
    actionItems,
    summary: `${form.damageType || "피해유형 미선택"} / ${
      form.pressureLevel || "추심단계 미선택"
    } / 증거 ${form.evidence || "미선택"}`,
  };
}

function getCurrentStepValid(step, form) {
  if (step === 1) return !!form.damageType;
  if (step === 2) return !!form.pressureLevel;
  if (step === 3) return true;
  if (step === 4) return true;
  if (step === 5) return !!form.evidence;
  if (step === 6) return !!form.spreadDamage;
  return true;
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [consultation, setConsultation] = useState({ name: "", phone: "" });

  const [form, setForm] = useState({
    damageType: "",
    pressureLevel: "",
    loanAmount: "",
    repaidAmount: "",
    evidence: "",
    spreadDamage: "",
  });

  const diagnosis = useMemo(() => getDiagnosisPayload(form), [form]);
  const currentStepValid = getCurrentStepValid(step, form);

  const posthogInitialized = useRef(false);
  const diagnosisSourceRef = useRef("unknown");

  const safeCapture = (eventName, properties = {}) => {
    if (typeof window === "undefined") return;
    if (!posthogInitialized.current) return;

    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error("PostHog capture error:", error);
    }
  };

  const trackCtaClick = (ctaName, sectionId) => {
    safeCapture("landing cta clicked", {
      cta_name: ctaName,
      section_id: sectionId,
      current_url: window.location.pathname,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (posthogInitialized.current) return;
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2026-01-30",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });

    posthogInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!isModalOpen || step !== 7) return;

    setProgress(0);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setStep(8), 350);
          return 100;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [isModalOpen, step]);

  const openDiagnosisModal = (sourceSection = "unknown") => {
    diagnosisSourceRef.current = sourceSection;

    safeCapture("diagnosis started", {
      source: sourceSection,
      current_url: window.location.pathname,
    });

    setForm({
      damageType: "",
      pressureLevel: "",
      loanAmount: "",
      repaidAmount: "",
      evidence: "",
      spreadDamage: "",
    });
    setConsultation({ name: "", phone: "" });
    setSubmitMessage("");
    setPrivacyAgreed(false);
    setPrivacyOpen(false);
    setProgress(0);
    setStep(1);
    setIsModalOpen(true);
  };

  const closeDiagnosisModal = () => {
    safeCapture("diagnosis closed", {
      current_step: step,
      source: diagnosisSourceRef.current,
    });

    setIsModalOpen(false);
    setStep(1);
    setProgress(0);
    setSubmitMessage("");
    setIsSubmitting(false);
  };

  const nextStep = () => {
    safeCapture("diagnosis step completed", {
      step_number: step,
      source: diagnosisSourceRef.current,
    });

    if (step < 6) {
      setStep((prev) => prev + 1);
      return;
    }

    if (step === 6) {
      setStep(7);
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 7) {
      setStep((prev) => prev - 1);
    }
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();

    if (!consultation.name.trim() || !consultation.phone.trim()) {
      setSubmitMessage("이름과 연락처를 입력해주세요.");
      return;
    }

    if (!privacyAgreed) {
      setSubmitMessage("개인정보처리방침에 동의해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant: consultation,
          privacyAgreed,
          diagnosis,
          source: diagnosisSourceRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "상담 신청 전송에 실패했습니다.");
      }

      safeCapture("consultation submitted", {
        source: "illegal_loan_result",
        diagnosis_source: diagnosisSourceRef.current,
        urgency: diagnosis.urgency,
      });

      setSubmitMessage("상담 신청이 정상적으로 접수되었습니다.");
      setConsultation({ name: "", phone: "" });
      setPrivacyAgreed(false);
      setPrivacyOpen(false);
    } catch (error) {
      setSubmitMessage(error.message || "신청 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resultConfig = urgencyMessages[diagnosis.urgency];

  return (
    <main className="min-h-screen bg-[#050505] text-white [word-break:keep-all] [overflow-wrap:break-word]">
      <header className="sticky top-0 z-50 border-b border-[#22080d] bg-[rgba(5,5,5,0.92)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4b141c] bg-[#101010] text-[11px] font-black tracking-[0.22em] text-[#ff445e]">
              LG
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff445e]">
                ROGUARD
              </p>
              <p className="text-sm font-bold text-white">매일법률사무소 마케팅 브랜드</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={LAWFIRM_SITE_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-zinc-300 hover:text-white"
            >
              매일법률사무소
            </a>
            <a
              href={NAVER_CAFE_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-zinc-300 hover:text-white"
            >
              카페
            </a>
          </div>
        </div>
      </header>

      <section className="hero-noise relative overflow-hidden border-b border-[#22080d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(179,0,27,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(120,0,18,0.16),transparent_32%)]" />
        <div className="soft-grid absolute inset-0 opacity-30" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:py-24">
          <FadeInSection>
            <div className="inline-flex rounded-full border border-[#4b141c] bg-[#16090c] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff5369]">
              불법사채 · 불법추심 대응
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-white md:text-6xl">
              멈춰야 할 건
              <br />
              당신의 일상이 아니라
              <br />
              그들의 불법 추심입니다.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
              로가드는 매일법률사무소 소속 브랜드로,
              <br />
              불법사채·불법추심·지인연락·협박 정황을 정리하고
              <br />
              대응, 합의 검토, 초과 상환분 환수 가능성까지 함께 살펴봅니다.
            </p>

            <div className="mt-8 grid gap-4 sm:max-w-xl sm:grid-cols-2">
              <CTAButton
                href={KAKAO_LINK}
                variant="red"
                full
                onClick={() => trackCtaClick("kakao_consult", "hero")}
              >
                카카오톡 바로 상담
              </CTAButton>

              <CTAButton
                variant="dark"
                full
                onClick={() => {
                  trackCtaClick("diagnosis_start", "hero");
                  openDiagnosisModal("hero");
                }}
              >
                피해상황 빠른 확인
              </CTAButton>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <InfoBadge>불법추심 정황 정리</InfoBadge>
              <InfoBadge>합의 가능성 검토</InfoBadge>
              <InfoBadge>환수 가능성 검토</InfoBadge>
              <InfoBadge>주변인 연락 대응</InfoBadge>
            </div>
          </FadeInSection>

          <FadeInSection delay={120}>
            <div className="dark-card rounded-[34px] border border-[#311016] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
              <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ff5369]">
                  긴급 대응 체크
                </p>

                <div className="mt-5 grid gap-3">
                  {[
                    "욕설·협박 문자나 통화가 있다",
                    "가족·지인·직장으로 연락이 갔다",
                    "원금보다 더 많이 갚은 것 같다",
                    "입금내역·대화내역이 남아 있다",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-zinc-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-[linear-gradient(180deg,#c70021_0%,#920015_100%)] px-4 py-4 text-sm font-extrabold text-white">
                  지금은 혼자 버티는 것보다 기록을 남기고 빠르게 정리하는 편이 안전합니다.
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
        <FadeInSection className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
            로가드가 보는 핵심 포인트
          </p>
          <h2 className="mt-4 text-3xl font-black leading-[1.25] text-white md:text-5xl">
            단순히 돈 문제만 보는 것이 아니라
            <br />
            불법 행위의 흔적부터 정리합니다.
          </h2>
        </FadeInSection>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "추심 방식 확인",
              desc: "욕설, 협박, 반복 연락, 가족·지인 연락 여부를 먼저 확인합니다.",
            },
            {
              title: "상환 구조 확인",
              desc: "원금과 실제 상환액을 비교해 과도한 상환이 있었는지 검토합니다.",
            },
            {
              title: "증거 보존 정리",
              desc: "계좌내역, 문자, 카톡, 녹취, 캡처를 정리해 대응 방향을 세웁니다.",
            },
          ].map((item, index) => (
            <FadeInSection
              key={item.title}
              delay={index * 80}
              className="dark-card rounded-[30px] border border-[#262626] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b0a0e] text-sm font-black text-[#ff5369]">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-8 text-zinc-300">{item.desc}</p>
            </FadeInSection>
          ))}
        </div>
      </section>

      <section className="border-y border-[#1b1b1b] bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "이런 상황이면 바로 확인해보세요",
                items: [
                  "밤낮 없이 연락이 반복된다",
                  "지인이나 직장으로 연락하겠다고 한다",
                  "이미 원금 이상을 갚은 것 같다",
                  "불안해서 대화 내용을 지우고 싶어진다",
                ],
              },
              {
                title: "상담 전 확보하면 좋은 것",
                items: [
                  "입출금 내역 캡처",
                  "문자·카톡 대화 캡처",
                  "통화 녹음 파일",
                  "상대방 계좌번호·닉네임·전화번호",
                ],
              },
            ].map((card, index) => (
              <FadeInSection
                key={card.title}
                delay={index * 100}
                className="rounded-[32px] border border-[#2b2b2b] bg-[#111111] p-7"
              >
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
                  CHECK LIST
                </p>
                <h3 className="mt-4 text-3xl font-black leading-tight text-white">
                  {card.title}
                </h3>

                <div className="mt-6 space-y-3">
                  {card.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#2b2b2b] bg-[#171717] px-4 py-4 text-sm font-semibold text-zinc-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
        <FadeInSection className="rounded-[36px] border border-[#351017] bg-[linear-gradient(180deg,#130608_0%,#0b0b0b_100%)] px-6 py-8 text-white md:px-10 md:py-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
            진행 흐름
          </p>
          <h2 className="mt-4 text-3xl font-black leading-[1.2] md:text-5xl">
            상담은 이렇게 진행되는 구조로 설계했습니다.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "피해 상황 확인",
              "증거 자료 정리",
              "대응·합의 방향 검토",
              "필요 시 환수 가능성 검토",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="text-sm font-black text-[#ff5369]">STEP {index + 1}</div>
                <div className="mt-3 text-lg font-bold leading-7 text-white">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:max-w-xl sm:grid-cols-2">
            <CTAButton
              href={KAKAO_LINK}
              variant="red"
              full
              onClick={() => trackCtaClick("kakao_consult", "flow")}
            >
              카카오톡 상담하기
            </CTAButton>

            <CTAButton
              variant="ghost"
              full
              onClick={() => {
                trackCtaClick("diagnosis_start", "flow");
                openDiagnosisModal("flow");
              }}
            >
              피해상황 빠른 확인
            </CTAButton>
          </div>
        </FadeInSection>
      </section>

      <section className="border-y border-[#1b1b1b] bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
          <FadeInSection className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
              자주 묻는 질문
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.25] text-white md:text-5xl">
              광고 문구보다
              <br />
              실제로 많이 묻는 질문에 답합니다.
            </h2>
          </FadeInSection>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {[
              {
                q: "이미 꽤 많이 갚았는데도 계속 돈을 요구합니다.",
                a: "원금과 실제 상환 총액을 먼저 정리해보는 것이 중요합니다. 상환 구조가 과도했다면 별도 검토 포인트가 생길 수 있습니다.",
              },
              {
                q: "가족이나 직장으로 연락이 간 상태입니다.",
                a: "이 경우는 대응 속도가 중요합니다. 연락 정황, 캡처, 통화기록 등을 남겨두고 빠르게 정리하는 편이 좋습니다.",
              },
              {
                q: "증거가 조금밖에 없어도 상담이 가능한가요?",
                a: "가능합니다. 다만 계좌내역, 문자, 카톡, 통화기록 중 남아 있는 것을 최대한 보존해두는 것이 좋습니다.",
              },
            ].map((item) => (
              <FadeInSection
                key={item.q}
                className="rounded-[28px] border border-[#2b2b2b] bg-[#111111] p-6"
              >
                <h3 className="text-xl font-black text-white">{item.q}</h3>
                <p className="mt-3 text-base leading-8 text-zinc-300">{item.a}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#050505]">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ff5369]">
            ROGUARD × 매일법률사무소
          </p>
          <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
            불법사채·불법추심 대응 상담
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            상호명: 매일법률사무소 | 대표자: 김민석 | 사업자등록번호: 489-04-02780
            <br />
            주소: 서울특별시 서초구 서초대로42길 66 매일빌딩
            <br />
            광고책임자: 김민석 변호사 | 이메일: doublestone.partners@gmail.com
          </p>
        </div>
      </footer>

      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#2a0d12] bg-[#111111] p-3 shadow-2xl shadow-black/40">
          <CTAButton
            href={KAKAO_LINK}
            variant="red"
            full
            onClick={() => trackCtaClick("kakao_consult", "bottom_fixed")}
          >
            카톡 상담
          </CTAButton>

          <CTAButton
            variant="dark"
            full
            onClick={() => {
              trackCtaClick("diagnosis_start", "bottom_fixed");
              openDiagnosisModal("bottom_fixed");
            }}
          >
            빠른 확인
          </CTAButton>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[34px] border border-[#2a0d12] bg-[#0f0f0f] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeDiagnosisModal}
              className="pressable absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#171717] text-lg font-bold text-zinc-300"
            >
              ×
            </button>

            {step <= 6 && (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
                      불법사채 · 불법추심
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                      피해상황 빠른 확인
                    </h3>
                  </div>
                  <div className="rounded-full border border-[#2b2b2b] bg-[#171717] px-4 py-2 text-sm font-bold text-zinc-300">
                    {step} / 8
                  </div>
                </div>

                <div className="mb-8 h-2 overflow-hidden rounded-full bg-[#1b1b1b]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#d00022_0%,#900015_100%)] transition-all duration-300"
                    style={{ width: `${(step / 8) * 100}%` }}
                  />
                </div>

                {step === 1 && (
                  <div>
                    <h4 className="text-3xl font-black leading-tight text-white">
                      현재 가장 가까운 피해 유형을 선택해주세요.
                    </h4>
                    <p className="mt-3 text-base leading-7 text-zinc-400">
                      여러 개가 겹친다면 가장 심한 상황 기준으로 골라주세요.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {DAMAGE_TYPES.map((option) => (
                        <StepOptionButton
                          key={option}
                          selected={form.damageType === option}
                          onClick={() => setForm((prev) => ({ ...prev, damageType: option }))}
                        >
                          {option}
                        </StepOptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h4 className="text-3xl font-black leading-tight text-white">
                      현재 연락 강도는 어느 정도인가요?
                    </h4>
                    <p className="mt-3 text-base leading-7 text-zinc-400">
                      추심 강도에 따라 대응 우선순위가 달라집니다.
                    </p>

                    <div className="mt-8 grid gap-3">
                      {PRESSURE_LEVELS.map((option) => (
                        <StepOptionButton
                          key={option}
                          selected={form.pressureLevel === option}
                          onClick={() => setForm((prev) => ({ ...prev, pressureLevel: option }))}
                        >
                          {option}
                        </StepOptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h4 className="text-3xl font-black leading-tight text-white">
                      대여받은 원금은 어느 정도인가요?
                    </h4>
                    <p className="mt-3 text-base leading-7 text-zinc-400">
                      정확하지 않아도 대략적인 금액이면 됩니다.
                    </p>

                    <div className="mt-8 rounded-[28px] border border-[#2b2b2b] bg-[#151515] p-5">
                      <label className="block text-sm font-bold text-zinc-300">대여 원금</label>
                      <div className="mt-3 flex items-center rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] px-4 py-4">
                        <input
                          value={form.loanAmount}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              loanAmount: e.target.value.replace(/[^0-9]/g, ""),
                            }))
                          }
                          inputMode="numeric"
                          placeholder="예: 300"
                          className="w-full bg-transparent text-lg font-black outline-none"
                        />
                        <span className="text-base font-bold text-zinc-500">만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h4 className="text-3xl font-black leading-tight text-white">
                      지금까지 실제로 상환한 총액은 어느 정도인가요?
                    </h4>
                    <p className="mt-3 text-base leading-7 text-zinc-400">
                      이 역시 대략적인 금액이면 충분합니다.
                    </p>

                    <div className="mt-8 rounded-[28px] border border-[#2b2b2b] bg-[#151515] p-5">
                      <label className="block text-sm font-bold text-zinc-300">상환 총액</label>
                      <div className="mt-3 flex items-center rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] px-4 py-4">
                        <input
                          value={form.repaidAmount}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              repaidAmount: e.target.value.replace(/[^0-9]/g, ""),
                            }))
                          }
                          inputMode="numeric"
                          placeholder="예: 540"
                          className="w-full bg-transparent text-lg font-black outline-none"
                        />
                        <span className="text-base font-bold text-zinc-500">만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h4 className="text-3xl font-black leading-tight text-white">
                      현재 남아 있는 증거는 어떤 편인가요?
                    </h4>
                    <p className="mt-3 text-base leading-7 text-zinc-400">
                      가장 가까운 항목 하나를 선택해주세요.
                    </p>

                    <div className="mt-8 grid gap-3">
                      {EVIDENCE_OPTIONS.map((option) => (
                        <StepOptionButton
                          key={option}
                          selected={form.evidence === option}
                          onClick={() => setForm((prev) => ({ ...prev, evidence: option }))}
                        >
                          {option}
                        </StepOptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <h4 className="text-3xl font-black leading-tight text-white">
                      가족·지인·직장으로 연락이 갔거나 갈 우려가 있나요?
                    </h4>
                    <p className="mt-3 text-base leading-7 text-zinc-400">
                      현재 가장 가까운 상태를 선택해주세요.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {YES_NO.map((option) => (
                        <StepOptionButton
                          key={option}
                          selected={form.spreadDamage === option}
                          onClick={() => setForm((prev) => ({ ...prev, spreadDamage: option }))}
                        >
                          {option}
                        </StepOptionButton>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={cn(
                      "min-h-[56px] rounded-2xl px-6 text-sm font-bold",
                      step === 1
                        ? "pointer-events-none bg-[#171717] text-zinc-600"
                        : "bg-[#1f1f1f] text-zinc-200"
                    )}
                  >
                    이전
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!currentStepValid}
                    className={cn(
                      "min-h-[56px] rounded-2xl px-8 text-sm font-black text-white",
                      currentStepValid
                        ? "bg-[linear-gradient(180deg,#d10022_0%,#920015_100%)]"
                        : "bg-[#2c2c2c]"
                    )}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="py-12 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
                  상황 분석중
                </p>
                <h3 className="mt-3 text-3xl font-black text-white">
                  입력하신 피해 상황을 정리하고 있습니다.
                </h3>

                <div className="mt-8">
                  <ProgressRing progress={progress} />
                </div>

                <p className="mt-6 text-base leading-8 text-zinc-400">
                  불법 추심 강도, 상환 구조, 증거 보유 상태를 바탕으로 상담 우선순위를
                  정리하고 있습니다.
                </p>
              </div>
            )}

            {step === 8 && (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
                  분석 결과
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                  {resultConfig.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-zinc-400">{resultConfig.desc}</p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] border border-[#2b2b2b] bg-[#151515] p-5">
                    <p className="text-sm font-bold text-zinc-500">긴급도</p>
                    <p className="mt-2 text-2xl font-black text-white">{resultConfig.label}</p>
                  </div>

                  <div className="rounded-[28px] border border-[#2b2b2b] bg-[#151515] p-5">
                    <p className="text-sm font-bold text-zinc-500">원금</p>
                    <p className="mt-2 text-2xl font-black text-white">
                      {formatManwon(diagnosis.loanAmount)}
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-[#2b2b2b] bg-[#151515] p-5">
                    <p className="text-sm font-bold text-zinc-500">초과 상환 추정</p>
                    <p className="mt-2 text-2xl font-black text-[#ff5369]">
                      {formatManwon(diagnosis.overpaidAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-[#2b2b2b] bg-[#12090b] p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
                    우선 검토 항목
                  </p>

                  <div className="mt-4 grid gap-3">
                    {diagnosis.actionItems.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-[#2b2b2b] bg-[#171717] px-4 py-4 text-sm font-bold text-zinc-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={handleConsultSubmit}
                  className="mt-6 rounded-[30px] border border-[#2b2b2b] bg-[#101010] p-6 shadow-sm"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ff5369]">
                    상담 신청
                  </p>
                  <h4 className="mt-3 text-2xl font-black leading-tight text-white">
                    지금 상담을 남겨주시면
                    <br />
                    확인 후 빠르게 연락드리겠습니다.
                  </h4>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-300">이름</label>
                      <input
                        value={consultation.name}
                        onChange={(e) =>
                          setConsultation((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="성함을 입력해주세요"
                        className="h-14 w-full rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] px-4 outline-none focus:border-[#7a1320]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-300">
                        연락처
                      </label>
                      <input
                        value={consultation.phone}
                        onChange={(e) =>
                          setConsultation((prev) => ({
                            ...prev,
                            phone: e.target.value.replace(/[^0-9-]/g, ""),
                          }))
                        }
                        placeholder="010-0000-0000"
                        className="h-14 w-full rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] px-4 outline-none focus:border-[#7a1320]"
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4 text-sm leading-7 text-zinc-400">
                    <p className="font-bold text-zinc-200">요약</p>
                    <p className="mt-2">{diagnosis.summary}</p>
                  </div>

                  <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      개인정보 수집 및 이용에 동의합니다.
                      <button
                        type="button"
                        onClick={() => setPrivacyOpen((prev) => !prev)}
                        className="ml-2 font-bold text-[#ff5369] underline"
                      >
                        {privacyOpen ? "닫기" : "전문보기"}
                      </button>
                    </span>
                  </label>

                  {privacyOpen && (
                    <div className="mt-4 max-h-56 overflow-y-auto rounded-2xl border border-[#2b2b2b] bg-[#151515] p-4 text-xs leading-6 text-zinc-400 whitespace-pre-wrap">
                      {PRIVACY_POLICY_TEXT}
                    </div>
                  )}

                  {submitMessage && (
                    <p className="mt-4 text-sm font-bold text-zinc-200">{submitMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "mt-6 min-h-[60px] w-full rounded-2xl text-sm font-black text-white",
                      isSubmitting
                        ? "bg-[#3a3a3a]"
                        : "bg-[linear-gradient(180deg,#d10022_0%,#920015_100%)] shadow-[0_18px_45px_rgba(140,0,20,0.22)]"
                    )}
                  >
                    {isSubmitting ? "접수 중입니다..." : "상담 신청하기"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}