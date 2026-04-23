'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';
import {
  DAMAGE_TYPES,
  EVIDENCE_OPTIONS,
  KAKAO_LINK,
  LAWFIRM_SITE_LINK,
  NAVER_CAFE_LINK,
  PRESSURE_LEVELS,
  PRIVACY_POLICY_TEXT,
  urgencyMessages,
  YES_NO,
} from '../lib/landing-data';
import { formatManwon, getCurrentStepValid, getDiagnosisPayload } from '../lib/diagnosis';

function CTAAnchor({ href, className, onClick, children, style }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onClick} style={style}>
      {children}
    </a>
  );
}

function CTAButton({ className, onClick, children, style, type = 'button', disabled = false }) {
  return (
    <button type={type} className={className} onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
}

function StepOptionButton({ selected, children, onClick }) {
  return (
    <button type="button" className={`option-button ${selected ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

function ProgressRing({ progress }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <svg viewBox="0 0 180 180" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#C9A961"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800 }}>{progress}%</div>
        <div style={{ fontSize: 11, letterSpacing: '0.24em', color: 'rgba(245,241,232,0.6)' }}>분석중</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [consultation, setConsultation] = useState({ name: '', phone: '' });
  const [form, setForm] = useState({
    damageType: '',
    pressureLevel: '',
    loanAmount: '',
    repaidAmount: '',
    evidence: '',
    spreadDamage: '',
  });

  const diagnosis = useMemo(() => getDiagnosisPayload(form), [form]);
  const currentStepValid = getCurrentStepValid(step, form);
  const posthogInitialized = useRef(false);
  const diagnosisSourceRef = useRef('unknown');

  const safeCapture = (eventName, properties = {}) => {
    if (typeof window === 'undefined') return;
    if (!posthogInitialized.current) return;
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error('PostHog capture error:', error);
    }
  };

  const trackCtaClick = (ctaName, sectionId) => {
    safeCapture('landing cta clicked', {
      cta_name: ctaName,
      section_id: sectionId,
      current_url: typeof window !== 'undefined' ? window.location.pathname : '/',
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (posthogInitialized.current) return;
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      defaults: '2026-01-30',
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

  useEffect(() => {
    if (step === 8) {
      safeCapture('diagnosis result viewed', {
        source: diagnosisSourceRef.current,
        urgency: diagnosis.urgency,
        overpaid_amount: diagnosis.overpaidAmount,
      });
    }
  }, [step, diagnosis]);

  const openDiagnosisModal = (sourceSection = 'unknown') => {
    diagnosisSourceRef.current = sourceSection;

    safeCapture('diagnosis started', {
      source: sourceSection,
      current_url: typeof window !== 'undefined' ? window.location.pathname : '/',
    });

    setForm({
      damageType: '',
      pressureLevel: '',
      loanAmount: '',
      repaidAmount: '',
      evidence: '',
      spreadDamage: '',
    });
    setConsultation({ name: '', phone: '' });
    setSubmitMessage('');
    setPrivacyAgreed(false);
    setPrivacyOpen(false);
    setProgress(0);
    setStep(1);
    setIsModalOpen(true);
  };

  const closeDiagnosisModal = () => {
    safeCapture('diagnosis closed', {
      current_step: step,
      source: diagnosisSourceRef.current,
    });

    setIsModalOpen(false);
    setStep(1);
    setProgress(0);
    setSubmitMessage('');
    setIsSubmitting(false);
    setPrivacyAgreed(false);
    setPrivacyOpen(false);
  };

  const nextStep = () => {
    safeCapture('diagnosis step completed', {
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
      safeCapture('diagnosis step back', {
        step_number: step,
        source: diagnosisSourceRef.current,
      });
      setStep((prev) => prev - 1);
    }
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();

    if (!consultation.name.trim() || !consultation.phone.trim()) {
      setSubmitMessage('이름과 연락처를 입력해주세요.');
      return;
    }

    if (!privacyAgreed) {
      setSubmitMessage('개인정보처리방침에 동의해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');

      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant: consultation,
          privacyAgreed,
          diagnosis,
          source: diagnosisSourceRef.current,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || '상담 신청 전송에 실패했습니다.');
      }

      safeCapture('consultation submitted', {
        source: 'illegal_loan_result',
        diagnosis_source: diagnosisSourceRef.current,
        urgency: diagnosis.urgency,
      });

      setSubmitMessage('상담 신청이 정상적으로 접수되었습니다.');
      setConsultation({ name: '', phone: '' });
      setPrivacyAgreed(false);
      setPrivacyOpen(false);
    } catch (error) {
      setSubmitMessage(error.message || '신청 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resultConfig = urgencyMessages[diagnosis.urgency];

  return (
    <main>
      <header>
        <div className="container header-inner">
          <div className="logo-group">
            <div className="logo-mark">LG</div>
            <div className="logo-text">
              <div className="brand">ROGUARD</div>
              <div className="tagline">매일법률사무소 · 불법사채 대응</div>
            </div>
          </div>
          <nav className="header-nav">
            <a href={LAWFIRM_SITE_LINK} target="_blank" rel="noreferrer">매일법률사무소</a>
            <a href="#">개인회생</a>
            <a href={NAVER_CAFE_LINK} target="_blank" rel="noreferrer">카페</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow animate">
                <svg className="shield" viewBox="0 0 24 24">
                  <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" />
                </svg>
                LAWGUARD × 매일법률사무소 · 불법사채 전담 대응
              </div>
              <h1 className="hero-title animate">
                멈춰야 할 건
                <br />
                당신의 일상이 아니라
                <br />
                <span className="accent">그들의 불법 추심</span>입니다.
              </h1>
              <p className="hero-sub animate">
                연 20%를 넘는 이자, 가족·직장으로의 연락, 밤낮없는 협박.
                <br />
                법은 이미 당신 편에 있습니다.
              </p>
              <div className="hero-trust animate">
                <strong style={{ color: 'var(--gold-bright)' }}>변호사법상 비밀유지 의무</strong>로 보호됩니다.
                <br />
                상담 내역은 채권자에게 절대 통보되지 않습니다.
              </div>
              <div className="hero-cta-group animate">
                <CTAAnchor
                  href={KAKAO_LINK}
                  className="btn-primary"
                  onClick={() => trackCtaClick('kakao_consult', 'hero')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 5.58 2 10c0 2.72 1.67 5.12 4.22 6.58l-.85 3.12c-.08.28.22.52.48.38L9.48 18h.02c.83.12 1.66.18 2.5.18 5.52 0 10-3.58 10-8S17.52 2 12 2z" />
                  </svg>
                  카카오톡 익명 상담 · 1분
                </CTAAnchor>
                <CTAButton
                  className="btn-secondary"
                  onClick={() => {
                    trackCtaClick('diagnosis_start', 'hero');
                    openDiagnosisModal('hero');
                  }}
                >
                  내 피해상황 진단하기
                </CTAButton>
              </div>
              <div className="tag-row animate">
                <span className="tag">불법추심 정황 정리</span>
                <span className="tag">합의 가능성 검토</span>
                <span className="tag">환수 가능성 검토</span>
                <span className="tag">주변인 연락 대응</span>
              </div>
            </div>

            <div className="check-card animate">
              <div className="check-label">EMERGENCY CHECK</div>
              <h3 className="check-title">
                하나라도 해당되면,
                <br />
                오늘 상담이 안전합니다
              </h3>
              <ul className="check-list">
                {[
                  '욕설·협박 문자나 통화가 왔다',
                  '가족·지인·직장으로 연락이 갔다',
                  '원금보다 많이 갚은 것 같다',
                  '입금내역·대화내역이 남아 있다',
                  '연 20% 넘는 이자를 요구받았다',
                ].map((item) => (
                  <li className="check-item" key={item}>
                    <span className="check-mark">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="check-footer">
                지금은 혼자 버티는 것보다 <strong>기록을 남기고 빠르게 정리하는 편</strong>이 법적으로 유리합니다.
                불법 추심은 <strong>형사 처벌 대상</strong>이며, 초과 상환분은 <strong>환수가 가능한 경우</strong>가 많습니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="core-points">
        <div className="container">
          <div className="section-label">CORE POINTS</div>
          <h2 className="section-title">
            단순히 돈 문제만 보는 것이 아니라
            <br />
            <span style={{ color: 'var(--gold)' }}>불법 행위의 흔적</span>부터 정리합니다.
          </h2>
          <p className="section-sub">— 채권자가 두려워하는 건 피해자의 침묵이지, 기록이 아닙니다 —</p>

          <div className="core-grid">
            <div className="core-card">
              <div className="core-num">— 01</div>
              <h3>추심 방식 확인</h3>
              <p>욕설·협박·반복 연락·가족/지인 연락 여부를 시간순으로 정리합니다. 어떤 추심이 있었는지 구체적으로 기록하는 것부터가 시작입니다.</p>
              <div className="core-benefit">불법 추심 행위에 해당하면 형사 대응 근거가 됩니다.</div>
            </div>
            <div className="core-card">
              <div className="core-num">— 02</div>
              <h3>상환 구조 확인</h3>
              <p>원금·이자율·실제 상환 총액을 법정 기준과 비교 검토합니다. 얼마를 빌렸고 얼마를 갚았는지 숫자로 명확히 파악합니다.</p>
              <div className="core-benefit">연 20% 초과분은 원칙적으로 무효이며, 환수 대상입니다.</div>
            </div>
            <div className="core-card">
              <div className="core-num">— 03</div>
              <h3>증거 보존 정리</h3>
              <p>통화기록·문자·카톡·녹취·캡처를 체계적으로 분류합니다. 흩어진 자료를 법적으로 쓸 수 있는 형태로 묶어냅니다.</p>
              <div className="core-benefit">대응·합의·신고 모든 단계의 핵심 자료가 됩니다.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="checklist-duo">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div className="section-label">CHECKLIST</div>
            <h2 className="section-title">상담 전, 두 가지만 확인해주세요</h2>
          </div>

          <div className="duo-grid" style={{ marginTop: 60 }}>
            <div className="duo-card signal">
              <div className="duo-label">SIGNAL</div>
              <h3 className="duo-title">
                이런 신호가 보이면,
                <br />
                더 늦기 전에
              </h3>
              <ul className="duo-list">
                <li className="duo-item"><span className="duo-bullet" />밤낮 없이 연락이 반복된다</li>
                <li className="duo-item"><span className="duo-bullet" />지인이나 직장에 연락하겠다고 한다</li>
                <li className="duo-item"><span className="duo-bullet" />이미 원금 이상을 갚은 것 같다</li>
                <li className="duo-item warning"><span className="duo-bullet" />불안해서 대화 내용을 지우고 싶어진다 <span className="warn-tag">지우지 마세요</span></li>
                <li className="duo-item"><span className="duo-bullet" />원래 약속한 조건과 계속 달라진다</li>
              </ul>
              <div className="duo-footer">
                <strong>→</strong> 이 중 2개 이상이면, 불법 추심 가능성이 높습니다.
              </div>
            </div>

            <div className="duo-card">
              <div className="duo-label">PREPARE</div>
              <h3 className="duo-title">
                상담 전,
                <br />
                이것만 남겨두세요
              </h3>
              <ul className="duo-list">
                <li className="duo-item"><span className="duo-bullet" />입출금 내역 캡처 (원금·이자 구분)</li>
                <li className="duo-item"><span className="duo-bullet" />문자·카톡 대화 전체 캡처</li>
                <li className="duo-item"><span className="duo-bullet" />통화 녹음 파일</li>
                <li className="duo-item"><span className="duo-bullet" />상대방 계좌번호·닉네임·전화번호</li>
                <li className="duo-item"><span className="duo-bullet" />차용증·계약서 사진 (있다면)</li>
              </ul>
              <div className="duo-footer">
                <strong>→</strong> 없어도 상담 가능합니다. 있는 것부터 보내주세요.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="process">
        <div className="container">
          <div className="section-label">PROCESS FLOW</div>
          <h2 className="section-title">
            상담은 이렇게 진행되는
            <br />
            구조로 설계했습니다.
          </h2>
          <p className="section-sub">— 첫 상담부터 결과까지, 변호사가 모든 단계에 함께합니다 —</p>

          <div className="process-wrap">
            <div className="steps-grid">
              <div className="step">
                <div className="step-num">STEP 01</div>
                <h4>피해 상황 확인</h4>
                <p>
                  카카오톡으로 정황 공유
                  <br />
                  변호사 1차 검토 <strong style={{ color: 'var(--gold-bright)' }}>(무료)</strong>
                </p>
              </div>
              <div className="step">
                <div className="step-num">STEP 02</div>
                <h4>증거 자료 정리</h4>
                <p>남아있는 자료를 기준으로<br />불법성 판단 · 자료 분류</p>
              </div>
              <div className="step">
                <div className="step-num">STEP 03</div>
                <h4>대응·합의 방향 검토</h4>
                <p>형사대응 / 합의 / 환수 중<br />최적 전략 설계</p>
              </div>
              <div className="step">
                <div className="step-num">STEP 04</div>
                <h4>환수 가능성 검토</h4>
                <p>초과 상환분이 있다면<br />회수 절차 진행</p>
              </div>
            </div>
            <div className="process-cta">
              <CTAAnchor
                href={KAKAO_LINK}
                className="btn-primary"
                onClick={() => trackCtaClick('kakao_consult', 'process')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 5.58 2 10c0 2.72 1.67 5.12 4.22 6.58l-.85 3.12c-.08.28.22.52.48.38L9.48 18h.02c.83.12 1.66.18 2.5.18 5.52 0 10-3.58 10-8S17.52 2 12 2z" />
                </svg>
                카카오톡으로 상담 시작
              </CTAAnchor>
              <CTAButton
                className="btn-secondary"
                onClick={() => {
                  trackCtaClick('diagnosis_start', 'process');
                  openDiagnosisModal('process');
                }}
              >
                피해상황 빠른 확인
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label">FREQUENTLY ASKED</div>
            <h2 className="section-title">
              광고 문구보다
              <br />
              <span style={{ color: 'var(--gold)' }}>실제로 많이 묻는 질문</span>에 답합니다.
            </h2>
          </div>

          <div className="faq-list">
            <div className="faq-item featured">
              <div className="faq-q">상담하면 채권자에게 알려지지 않나요?</div>
              <div className="faq-a">
                <strong>절대 알려지지 않습니다.</strong> 변호사는 법으로 비밀유지 의무가 있으며, 상담 단계에서는 어떠한 대외 연락도 발생하지 않습니다. 의뢰인의 동의 없이는 다음 단계로 진행되지 않습니다.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">이미 꽤 많이 갚았는데도 계속 돈을 요구합니다.</div>
              <div className="faq-a">
                원금과 실제 상환 총액을 먼저 정리해보는 것이 중요합니다. <strong>연 20%(법정 최고이자율)를 초과한 상환분은 원칙적으로 무효</strong>이며, 환수를 검토할 수 있습니다.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">가족이나 직장으로 연락이 간 상태입니다.</div>
              <div className="faq-a">
                이 경우는 대응 속도가 중요합니다. <strong>제3자에 대한 연락은 채권추심법 위반으로 형사 처벌 대상</strong>입니다. 연락 정황·캡처·통화기록을 남기고 빠르게 상담해주세요.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">증거가 조금밖에 없어도 상담이 가능한가요?</div>
              <div className="faq-a">
                가능합니다. 계좌내역·문자·카톡·통화기록 중 남아 있는 것을 최대한 보존해두시면 됩니다. 없는 자료는 법적 절차를 통해 확보 가능한 경우도 많습니다.
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q">상담료는 어떻게 되나요?</div>
              <div className="faq-a">
                <strong>1차 카카오톡 상담은 무료</strong>입니다. 피해 상황을 검토한 후 대응이 필요한 경우에만 수임 여부와 비용을 투명하게 안내드립니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <div className="container">
          <div className="footer-ornament">— ROGUARD × 매일법률사무소 —</div>
          <h2 className="footer-title">불법사채·불법추심 대응 상담</h2>
          <div className="footer-info">
            변호사 1차 검토 <span>·</span> 익명 상담 가능 <span>·</span> 비밀유지 보장
          </div>
          <div className="final-cta">
            <CTAAnchor
              href={KAKAO_LINK}
              className="btn-primary"
              style={{ padding: '20px 44px', fontSize: 16 }}
              onClick={() => trackCtaClick('kakao_consult', 'footer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 5.58 2 10c0 2.72 1.67 5.12 4.22 6.58l-.85 3.12c-.08.28.22.52.48.38L9.48 18h.02c.83.12 1.66.18 2.5.18 5.52 0 10-3.58 10-8S17.52 2 12 2z" />
              </svg>
              카카오톡 상담 시작
            </CTAAnchor>
            <CTAButton
              className="btn-secondary"
              style={{ padding: '20px 36px', fontSize: 16 }}
              onClick={() => {
                trackCtaClick('diagnosis_start', 'footer');
                openDiagnosisModal('footer');
              }}
            >
              피해상황 빠른 확인
            </CTAButton>
          </div>
          <div className="footer-meta">
            상호명: 매일법률사무소 &nbsp;|&nbsp; 대표자: 김민석 &nbsp;|&nbsp; 사업자등록번호: 489-04-02780
            <br />
            © LAWGUARD. 본 페이지의 법률 정보는 일반적 안내이며, 구체적 상담은 변호사와 진행하시기 바랍니다.
          </div>
        </div>
      </section>

      <div className="fixed-cta">
        <div className="fixed-cta-inner">
          <CTAAnchor
            href={KAKAO_LINK}
            className="btn-primary"
            onClick={() => trackCtaClick('kakao_consult', 'fixed_bottom')}
          >
            카카오톡 상담
          </CTAAnchor>
          <CTAButton
            className="btn-secondary"
            onClick={() => {
              trackCtaClick('diagnosis_start', 'fixed_bottom');
              openDiagnosisModal('fixed_bottom');
            }}
          >
            피해상황 빠른 확인
          </CTAButton>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-shell">
            <button type="button" className="modal-close" onClick={closeDiagnosisModal} aria-label="닫기">
              ×
            </button>

            {step <= 6 && (
              <div>
                <div className="modal-top">
                  <div>
                    <div className="modal-eyebrow">LAWGUARD · 피해상황 빠른 확인</div>
                    <h3 className="modal-title">현재 상황을 짧게 정리해보겠습니다.</h3>
                    <p className="modal-desc">버티고 계신 상황을 6단계로 확인한 뒤, 상담 우선순위와 정리 포인트를 바로 보여드립니다.</p>
                  </div>
                  <div className="step-badge">{step} / 8</div>
                </div>

                <div className="progress-bar">
                  <div className="progress-value" style={{ width: `${(step / 8) * 100}%` }} />
                </div>

                {step === 1 && (
                  <div>
                    <h4 className="modal-title" style={{ fontSize: 28, marginBottom: 10 }}>현재 가장 가까운 피해 유형을 선택해주세요.</h4>
                    <p className="modal-desc">여러 개가 겹친다면 가장 심한 상황 기준으로 골라주세요.</p>
                    <div className="option-grid columns-3" style={{ marginTop: 22 }}>
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
                    <h4 className="modal-title" style={{ fontSize: 28, marginBottom: 10 }}>현재 연락 강도는 어느 정도인가요?</h4>
                    <p className="modal-desc">추심 강도에 따라 대응 우선순위가 달라집니다.</p>
                    <div className="option-grid" style={{ marginTop: 22 }}>
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
                    <h4 className="modal-title" style={{ fontSize: 28, marginBottom: 10 }}>대여받은 원금은 어느 정도인가요?</h4>
                    <p className="modal-desc">정확하지 않아도 대략적인 금액이면 됩니다.</p>
                    <div className="field-card" style={{ marginTop: 22 }}>
                      <label className="field-label">대여 원금</label>
                      <div className="input-wrap">
                        <input
                          className="field-input"
                          value={form.loanAmount}
                          onChange={(e) => setForm((prev) => ({ ...prev, loanAmount: e.target.value.replace(/[^0-9]/g, '') }))}
                          inputMode="numeric"
                          placeholder="예: 300"
                        />
                        <span className="input-suffix">만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h4 className="modal-title" style={{ fontSize: 28, marginBottom: 10 }}>지금까지 실제로 상환한 총액은 어느 정도인가요?</h4>
                    <p className="modal-desc">이 역시 대략적인 금액이면 충분합니다.</p>
                    <div className="field-card" style={{ marginTop: 22 }}>
                      <label className="field-label">상환 총액</label>
                      <div className="input-wrap">
                        <input
                          className="field-input"
                          value={form.repaidAmount}
                          onChange={(e) => setForm((prev) => ({ ...prev, repaidAmount: e.target.value.replace(/[^0-9]/g, '') }))}
                          inputMode="numeric"
                          placeholder="예: 540"
                        />
                        <span className="input-suffix">만원</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h4 className="modal-title" style={{ fontSize: 28, marginBottom: 10 }}>현재 남아 있는 증거는 어떤 편인가요?</h4>
                    <p className="modal-desc">가장 가까운 항목 하나를 선택해주세요.</p>
                    <div className="option-grid" style={{ marginTop: 22 }}>
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
                    <h4 className="modal-title" style={{ fontSize: 28, marginBottom: 10 }}>가족·지인·직장으로 연락이 갔거나 갈 우려가 있나요?</h4>
                    <p className="modal-desc">현재 가장 가까운 상태를 선택해주세요.</p>
                    <div className="option-grid columns-2" style={{ marginTop: 22 }}>
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

                <div className="modal-actions">
                  <CTAButton className="action-btn" onClick={prevStep} disabled={step === 1}>이전</CTAButton>
                  <CTAButton className="action-btn primary" onClick={nextStep} disabled={!currentStepValid}>다음</CTAButton>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="loading-wrap">
                <div className="modal-eyebrow">LAWGUARD ANALYSIS</div>
                <h3 className="modal-title">입력하신 피해 상황을 정리하고 있습니다.</h3>
                <div style={{ marginTop: 30 }}>
                  <ProgressRing progress={progress} />
                </div>
                <p className="loading-text">
                  불법 추심 강도, 상환 구조, 증거 보유 상태를 바탕으로
                  <br />
                  상담 우선순위를 정리하고 있습니다.
                </p>
              </div>
            )}

            {step === 8 && (
              <div>
                <div className="modal-eyebrow">ANALYSIS RESULT</div>
                <h3 className="modal-title">{resultConfig.title}</h3>
                <p className="modal-desc">{resultConfig.desc}</p>

                <div className="result-grid">
                  <div className="result-card">
                    <div className="label">긴급도</div>
                    <div className="value">{resultConfig.label}</div>
                  </div>
                  <div className="result-card">
                    <div className="label">원금</div>
                    <div className="value">{formatManwon(diagnosis.loanAmount)}</div>
                  </div>
                  <div className="result-card highlight">
                    <div className="label">초과 상환 추정</div>
                    <div className="value">{formatManwon(diagnosis.overpaidAmount)}</div>
                  </div>
                </div>

                <div className="action-list-box">
                  <div className="modal-eyebrow" style={{ marginBottom: 8 }}>PRIORITY</div>
                  <h4>우선 검토 항목</h4>
                  <div className="action-list">
                    {diagnosis.actionItems.map((item) => (
                      <div className="action-list-item" key={item}>{item}</div>
                    ))}
                  </div>
                </div>

                <form className="consult-box" onSubmit={handleConsultSubmit}>
                  <div className="modal-eyebrow" style={{ marginBottom: 8 }}>CONSULTATION</div>
                  <h4>
                    지금 상담을 남겨주시면
                    <br />
                    확인 후 빠르게 연락드리겠습니다.
                  </h4>

                  <div className="form-grid">
                    <div>
                      <label className="field-label">이름</label>
                      <input
                        className="field-input"
                        value={consultation.name}
                        onChange={(e) => setConsultation((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="성함을 입력해주세요"
                      />
                    </div>
                    <div>
                      <label className="field-label">연락처</label>
                      <input
                        className="field-input"
                        value={consultation.phone}
                        onChange={(e) => setConsultation((prev) => ({ ...prev, phone: e.target.value.replace(/[^0-9-]/g, '') }))}
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>

                  <div className="form-note">
                    <strong style={{ color: 'var(--gold-bright)' }}>요약</strong>
                    <br />
                    {diagnosis.summary}
                  </div>

                  <label className="privacy-row">
                    <input type="checkbox" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} style={{ marginTop: 4 }} />
                    <span>
                      개인정보 수집 및 이용에 동의합니다.
                      <button type="button" className="privacy-button" onClick={() => setPrivacyOpen((prev) => !prev)}>
                        {privacyOpen ? '닫기' : '전문보기'}
                      </button>
                    </span>
                  </label>

                  {privacyOpen && <div className="privacy-box">{PRIVACY_POLICY_TEXT}</div>}
                  {submitMessage && <p className="submit-message">{submitMessage}</p>}

                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? '접수 중입니다...' : '상담 신청하기'}
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
