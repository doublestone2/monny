"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import { LANDING_HTML } from "@/lib/landingMarkup";
import {
  DAMAGE_TYPES,
  EVIDENCE_OPTIONS,
  PRESSURE_LEVELS,
  PRIVACY_POLICY_TEXT,
  YES_NO,
  formatManwon,
  getCurrentStepValid,
  getDiagnosisPayload,
  urgencyMessages,
} from "@/lib/diagnosis";

const DEFAULT_KAKAO_LINK = "http://pf.kakao.com/_CUPCX/chat";
const DEFAULT_LAWFIRM_SITE_LINK = "https://xn--9z2b2xi4aba940lua.com/";
const DEFAULT_NAVER_CAFE_LINK = "https://cafe.naver.com/coincheating";

function buildLandingHtml({ kakaoLink, lawfirmLink, cafeLink }) {
  return LANDING_HTML
    .replaceAll("__KAKAO_LINK__", kakaoLink)
    .replaceAll("__LAW_FIRM_LINK__", lawfirmLink)
    .replaceAll("__NAVER_CAFE_LINK__", cafeLink);
}

function ProgressRing({ progress }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="lg-progress-ring">
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(245,241,232,0.12)" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#C9A961"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="lg-progress-ring__center">
        <strong>{progress}%</strong>
        <span>분석중</span>
      </div>
    </div>
  );
}

function StepChoice({ selected, onClick, children, multiple = false }) {
  return (
    <button
      type="button"
      className={`lg-step-choice${selected ? " is-selected" : ""}${multiple ? " is-multiple" : ""}`}
      onClick={onClick}
    >
      {multiple && <span className="lg-step-choice__marker" aria-hidden="true">{selected ? "✓" : "+"}</span>}
      <span>{children}</span>
    </button>
  );
}

function toggleSelection(list = [], value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function Page() {
  const containerRef = useRef(null);
  const posthogInitialized = useRef(false);
  const diagnosisSourceRef = useRef("unknown");

  const kakaoLink = process.env.NEXT_PUBLIC_KAKAO_LINK || DEFAULT_KAKAO_LINK;
  const lawfirmLink = process.env.NEXT_PUBLIC_LAWFIRM_LINK || DEFAULT_LAWFIRM_SITE_LINK;
  const cafeLink = process.env.NEXT_PUBLIC_NAVER_CAFE_LINK || DEFAULT_NAVER_CAFE_LINK;

  const landingHtml = useMemo(
    () => buildLandingHtml({ kakaoLink, lawfirmLink, cafeLink }),
    [kakaoLink, lawfirmLink, cafeLink]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [consultation, setConsultation] = useState({ name: "", phone: "" });

  const [form, setForm] = useState({
    damageTypes: [],
    pressureLevels: [],
    loanAmount: "",
    repaidAmount: "",
    evidenceItems: [],
    spreadDamage: "",
  });

  const diagnosis = useMemo(() => getDiagnosisPayload(form), [form]);
  const currentStepValid = getCurrentStepValid(step, form);
  const resultConfig = urgencyMessages[diagnosis.urgency];

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
      current_url: typeof window !== "undefined" ? window.location.pathname : "",
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

  const openDiagnosisModal = (sourceSection = "unknown") => {
    diagnosisSourceRef.current = sourceSection;

    safeCapture("diagnosis started", {
      source: sourceSection,
      current_url: typeof window !== "undefined" ? window.location.pathname : "",
    });

    setForm({
      damageTypes: [],
      pressureLevels: [],
      loanAmount: "",
      repaidAmount: "",
      evidenceItems: [],
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

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const diagnosisButtons = Array.from(node.querySelectorAll(".js-open-diagnosis"));
    const kakaoAnchors = Array.from(node.querySelectorAll(".js-kakao-cta"));

    const onDiagnosisClick = (event) => {
      event.preventDefault();
      const source = event.currentTarget.getAttribute("data-source") || "unknown";
      trackCtaClick("diagnosis_start", source);
      openDiagnosisModal(source);
    };

    const onKakaoClick = (event) => {
      const source = event.currentTarget.getAttribute("data-source") || "unknown";
      trackCtaClick("kakao_consult", source);
    };

    diagnosisButtons.forEach((button) => button.addEventListener("click", onDiagnosisClick));
    kakaoAnchors.forEach((anchor) => anchor.addEventListener("click", onKakaoClick));

    return () => {
      diagnosisButtons.forEach((button) => button.removeEventListener("click", onDiagnosisClick));
      kakaoAnchors.forEach((anchor) => anchor.removeEventListener("click", onKakaoClick));
    };
  }, [landingHtml]);

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

  useEffect(() => {
    if (step === 8) {
      safeCapture("diagnosis result viewed", {
        source: diagnosisSourceRef.current,
        urgency: diagnosis.urgency,
        overpaid_amount: diagnosis.overpaidAmount,
      });
    }
  }, [step, diagnosis]);

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
      safeCapture("diagnosis step back", {
        step_number: step,
        source: diagnosisSourceRef.current,
      });
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

  return (
    <>
      <main ref={containerRef}>
        <div dangerouslySetInnerHTML={{ __html: landingHtml }} />
      </main>

      {isModalOpen && (
        <div className="lg-modal-overlay" onClick={closeDiagnosisModal}>
          <div className="lg-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lg-modal-close" onClick={closeDiagnosisModal} aria-label="닫기">
              ×
            </button>

            {step <= 6 && (
              <div>
                <div className="lg-modal-head">
                  <div>
                    <p className="lg-modal-eyebrow">LAWGUARD DIAGNOSIS</p>
                    <h3 className="lg-modal-title">피해상황 1분 진단</h3>
                  </div>
                  <div className="lg-modal-step">{step} / 8</div>
                </div>

                <div className="lg-modal-progress">
                  <div style={{ width: `${(step / 8) * 100}%` }} />
                </div>

                {step === 1 && (
                  <div className="lg-step-block">
                    <h4>현재 가장 가까운 피해 유형을 선택해주세요.</h4>
                    <p>여러 개가 겹친다면 중복으로 선택하여 주세요.</p>
                    <div className="lg-step-grid lg-step-grid--three">
                      {DAMAGE_TYPES.map((option) => (
                        <StepChoice
                          key={option}
                          multiple
                          selected={form.damageTypes.includes(option)}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              damageTypes: toggleSelection(prev.damageTypes, option),
                            }))
                          }
                        >
                          {option}
                        </StepChoice>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="lg-step-block">
                    <h4>현재 연락 강도는 어느 정도인가요?</h4>
                    <p>해당하는 사항을 모두 선택 해주세요.</p>
                    <div className="lg-step-grid">
                      {PRESSURE_LEVELS.map((option) => (
                        <StepChoice
                          key={option}
                          multiple
                          selected={form.pressureLevels.includes(option)}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              pressureLevels: toggleSelection(prev.pressureLevels, option),
                            }))
                          }
                        >
                          {option}
                        </StepChoice>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="lg-step-block">
                    <h4>대여받은 원금은 어느 정도인가요?</h4>
                    <p>정확하지 않아도 대략적인 금액이면 충분합니다.</p>
                    <div className="lg-field-card">
                      <label>대여 원금</label>
                      <div className="lg-input-wrap">
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
                        />
                        <span>만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="lg-step-block">
                    <h4>지금까지 실제로 상환한 총액은 어느 정도인가요?</h4>
                    <p>이 역시 대략적인 금액이면 충분합니다.</p>
                    <div className="lg-field-card">
                      <label>상환 총액</label>
                      <div className="lg-input-wrap">
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
                        />
                        <span>만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="lg-step-block">
                    <h4>현재 남아 있는 증거는 어떤 편인가요?</h4>
                    <p>해당하는 사항을 모두 선택 해주세요.</p>
                    <div className="lg-step-grid">
                      {EVIDENCE_OPTIONS.map((option) => (
                        <StepChoice
                          key={option}
                          multiple
                          selected={form.evidenceItems.includes(option)}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              evidenceItems: toggleSelection(prev.evidenceItems, option),
                            }))
                          }
                        >
                          {option}
                        </StepChoice>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="lg-step-block">
                    <h4>가족·지인·직장으로 연락이 갔거나 갈 우려가 있나요?</h4>
                    <p>현재 가장 가까운 상태를 선택해주세요.</p>
                    <div className="lg-step-grid lg-step-grid--two">
                      {YES_NO.map((option) => (
                        <StepChoice
                          key={option}
                          selected={form.spreadDamage === option}
                          onClick={() => setForm((prev) => ({ ...prev, spreadDamage: option }))}
                        >
                          {option}
                        </StepChoice>
                      ))}
                    </div>
                  </div>
                )}

                <div className="lg-modal-actions">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`lg-modal-nav lg-modal-nav--secondary${step === 1 ? " is-disabled" : ""}`}
                    disabled={step === 1}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className={`lg-modal-nav lg-modal-nav--primary${!currentStepValid ? " is-disabled" : ""}`}
                    disabled={!currentStepValid}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="lg-loading-state">
                <p className="lg-modal-eyebrow">ANALYZING</p>
                <h3 className="lg-modal-title">입력하신 피해 상황을 정리하고 있습니다.</h3>
                <ProgressRing progress={progress} />
                <p className="lg-loading-copy">
                  불법 추심 강도, 상환 구조, 증거 보유 상태를 바탕으로 상담 우선순위를 정리하고 있습니다.
                </p>
              </div>
            )}

            {step === 8 && (
              <div className="lg-result-state">
                <p className="lg-modal-eyebrow">ANALYSIS RESULT</p>
                <h3 className="lg-modal-title">{resultConfig.title}</h3>
                <p className="lg-result-copy">{resultConfig.desc}</p>

                <div className="lg-result-grid">
                  <div className="lg-result-card">
                    <span>긴급도</span>
                    <strong>{resultConfig.label}</strong>
                  </div>
                  <div className="lg-result-card">
                    <span>원금</span>
                    <strong>{formatManwon(diagnosis.loanAmount)}</strong>
                  </div>
                  <div className="lg-result-card">
                    <span>초과 상환 추정</span>
                    <strong className="is-gold">{formatManwon(diagnosis.overpaidAmount)}</strong>
                  </div>
                </div>

                <div className="lg-result-actions-card">
                  <p>우선 검토 항목</p>
                  <div className="lg-action-list">
                    {diagnosis.actionItems.map((item) => (
                      <div key={item} className="lg-action-item">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleConsultSubmit} className="lg-consult-form">
                  <p className="lg-consult-form__eyebrow">상담 신청</p>
                  <h4 className="lg-consult-form__title">
                    지금 상담을 남겨주시면
                    <br />
                    확인 후 빠르게 연락드리겠습니다.
                  </h4>

                  <div className="lg-form-grid">
                    <div className="lg-form-field">
                      <label>이름</label>
                      <input
                        value={consultation.name}
                        onChange={(e) =>
                          setConsultation((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="성함을 입력해주세요"
                      />
                    </div>
                    <div className="lg-form-field">
                      <label>연락처</label>
                      <input
                        value={consultation.phone}
                        onChange={(e) =>
                          setConsultation((prev) => ({
                            ...prev,
                            phone: e.target.value.replace(/[^0-9-]/g, ""),
                          }))
                        }
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>

                  <div className="lg-summary-box">
                    <strong>요약</strong>
                    <p>{diagnosis.summary}</p>
                  </div>

                  <label className="lg-privacy-line">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    />
                    <span>
                      개인정보 수집 및 이용에 동의합니다.
                      <button
                        type="button"
                        onClick={() => setPrivacyOpen((prev) => !prev)}
                        className="lg-privacy-toggle"
                      >
                        {privacyOpen ? "닫기" : "전문보기"}
                      </button>
                    </span>
                  </label>

                  {privacyOpen && (
                    <div className="lg-privacy-box">{PRIVACY_POLICY_TEXT}</div>
                  )}

                  {submitMessage && <p className="lg-submit-message">{submitMessage}</p>}

                  <button type="submit" className="lg-submit-button" disabled={isSubmitting}>
                    {isSubmitting ? "접수 중입니다..." : "상담 신청하기"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}