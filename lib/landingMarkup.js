export const LANDING_HTML = `<header>
  <div class="container header-inner">
    <div class="logo-group">
      <div class="logo-mark">
        <img src="/brand/lawguard-logo.png" alt="LawGuard 로고" class="logo-mark-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <span class="logo-mark-fallback">LG</span>
      </div>
      <div class="logo-text">
        <div class="brand">ROGUARD</div>
        <div class="tagline">매일법률사무소 · 불법사채 대응</div>
      </div>
    </div>
    <nav class="header-nav">
      <a href="__LAW_FIRM_LINK__" target="_blank" rel="noreferrer">매일법률사무소</a>
      <a href="__LAW_FIRM_LINK__" target="_blank" rel="noreferrer">개인회생</a>
      <a href="__NAVER_CAFE_LINK__" target="_blank" rel="noreferrer">카페</a>
    </nav>
  </div>
</header>

<!-- ================= HERO ================= -->
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div>
        <div class="eyebrow animate">
          <svg viewBox="0 0 24 24"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"/></svg>
          LAWGUARD × 매일법률사무소 · 불법사채 전담
        </div>
        <h1 class="hero-title animate">
          멈춰야 할 건<br>
          당신의 일상이 아니라<br>
          <span class="accent">그들의 불법 추심</span>입니다.
        </h1>
        <p class="hero-sub animate">
          연 20%를 넘는 이자, 가족·직장으로의 연락, 밤낮없는 협박.<br>
          당신이 잘못한 게 아니라, <strong style="color: var(--ivory);">그들이 저지른 범죄</strong>입니다.
        </p>
        <div class="hero-trust animate">
          <strong>변호사법상 비밀유지 의무</strong>로 보호됩니다.<br>
          상담 내역은 채권자에게 절대 통보되지 않습니다.
        </div>
        <div class="hero-cta-group animate">
          <button type="button" class="btn-primary js-open-diagnosis" data-source="hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
            1분 무료 진단
          </button>
          <a href="__KAKAO_LINK__" target="_blank" rel="noreferrer" class="btn-secondary js-kakao-cta" data-source="hero">카카오톡 익명 상담</a>
        </div>
        <div class="tag-row animate">
          <span class="tag">추심 중단</span>
          <span class="tag">환수 검토</span>
          <span class="tag">형사 대응</span>
          <span class="tag">가족 연락 차단</span>
        </div>
      </div>

      <div class="check-card animate">
        <div class="check-label">EMERGENCY CHECK</div>
        <h3 class="check-title">현재 이런 상태라면,<br>로가드가 지켜드리겠습니다</h3>
        <ul class="check-list">
          <li class="check-item">
            <span class="check-mark"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            연 20% 넘는 이자를 요구받았다
          </li>
          <li class="check-item">
            <span class="check-mark"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            욕설·협박 문자나 통화가 왔다
          </li>
          <li class="check-item">
            <span class="check-mark"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            가족·지인·직장으로 연락이 갔다
          </li>
          <li class="check-item">
            <span class="check-mark"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            원금보다 더 많이 갚은 것 같다
          </li>
          <li class="check-item">
            <span class="check-mark"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            입금내역·대화내역이 남아 있다
          </li>
        </ul>
        <div class="check-footer">
          지금은 혼자 버티는 것보다 <strong>기록을 남기고 빠르게 정리하는 편</strong>이
          법적으로 유리합니다. 불법 추심은 <strong>형사 처벌 대상</strong>이며,
          초과 상환분은 <strong>환수 가능</strong>한 경우가 많습니다.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= STATS ================= -->
<section class="stats">
  <div class="container">
    <div class="section-label">STATISTICS · 혼자만의 문제가 아닙니다</div>
    <h2 class="section-title">
      지금, 당신과 같은 상황으로<br>
      신고된 건만 연 <span style="color: var(--gold);">16,988건</span>
    </h2>
    <p class="section-sub">— 집계된 숫자보다 현실에서는 더 규모가 클 것입니다 —</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">16,988</div>
        <div class="stat-unit">건</div>
        <div class="stat-label">2025년 금감원<br>불법사금융 피해신고</div>
        <div class="stat-delta">2022년 대비 64%</div>
        <div class="stat-source">SOURCE · 금융감독원</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">309<span style="font-size: 36px;">억</span></div>
        <div class="stat-unit">범죄수익 환수액</div>
        <div class="stat-label">2025년 피해자에게<br>실제 돌려준 금액</div>
        <div class="stat-delta">전년 대비 65%</div>
        <div class="stat-source">SOURCE · 경찰청·금감원</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">3,365</div>
        <div class="stat-unit">건</div>
        <div class="stat-label">2025년 불법사금융<br>사범 검거·수사</div>
        <div class="stat-delta">전년 대비 70%</div>
        <div class="stat-source">SOURCE · 경찰청</div>
      </div>
    </div>

    <div class="stats-conclusion">
      <p>
        이 숫자가 말하는 건 단 하나 —<br>
        <span class="hl">불법사채로 많은 사람들이 피해를 보고 있다는 사실</span>,<br>
        <span class="hl">전문 로펌의 도움을 받아 전략적으로 대응해야 한다는 것</span>입니다.
      </p>
    </div>

    <div class="stats-footnote">
      <span class="law-badge">이자제한법</span>
      <span class="law-badge">대부업법 (2025.7.22 개정)</span>
      <span class="law-badge">채권추심법</span>
    </div>
  </div>
</section>

<!-- ================= WEAPONS ================= -->
<section class="weapons">
  <div class="container">
    <div class="weapons-header">
      <div class="section-label">YOUR LEGAL WEAPONS</div>
      <h2 class="section-title">
        그들이 저지른 짓을<br>
        <span style="color: var(--gold);">법으로 그대로</span> 돌려받게 합니다.
      </h2>
      <p class="section-sub">— 법률 전문가가 전략적으로 대응해야 합니다 —</p>
      <p class="extra">
        로가드는 <strong>변호사가 직접 설계한 3가지 법적 무기</strong>를<br>
        피해자 상황에 맞춰 동시에 발동시킵니다.
      </p>
    </div>

    <div class="weapons-grid">

      <!-- WEAPON 01 -->
      <div class="weapon-card">
        <div class="weapon-header">
          <div class="weapon-badge">
            <span class="num">01</span>&nbsp;WEAPON
          </div>
          <div class="weapon-title-group">
            <div class="weapon-name">즉시 연락 차단</div>
            <div class="weapon-promise">"서면 통지 1장으로, 다음 날부터 추심이 멎습니다"</div>
          </div>
        </div>
        <div class="weapon-body">
          <div class="weapon-box">
            <div class="weapon-box-label">법적 근거</div>
            <div class="weapon-box-title">채권추심법 제8조의2<br>— 대리인 선임 시 연락 금지</div>
            <div class="weapon-box-content">
              변호사를 대리인으로 선임하고 <strong>서면 통지</strong>한 경우, 채권추심자는 채무자에게 방문·전화·문자를 할 수 없습니다.<br><br>
              위반 시 <strong>2천만 원 이하 과태료</strong>
            </div>
          </div>
          <div class="weapon-box">
            <div class="weapon-box-label">실제 효과</div>
            <div class="weapon-box-title">수임 → 서면 통지 → 추심 중단</div>
            <div class="weapon-box-content">
              <ul>
                <li>로가드 수임 → <strong>서면 통지 발송</strong></li>
                <li>통지 다음 날부터 추심 중단</li>
                <li>위반 시 과태료·형사 고소 병행</li>
                <li>채권자와 직접 연락할 일 없음</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="weapon-footer">발동까지 걸리는 시간 · <strong>최대 3일</strong></div>
      </div>

      <!-- WEAPON 02 -->
      <div class="weapon-card">
        <div class="weapon-header">
          <div class="weapon-badge">
            <span class="num">02</span>&nbsp;WEAPON
          </div>
          <div class="weapon-title-group">
            <div class="weapon-name">대부계약 무효 · 환수</div>
            <div class="weapon-promise">"연 60% 초과 계약은 법적으로 0원. 이미 낸 돈도 돌려받습니다"</div>
          </div>
        </div>
        <div class="weapon-body">
          <div class="weapon-box">
            <div class="weapon-box-label">법적 근거</div>
            <div class="weapon-box-title">이자제한법 제2조 · 대부업법 제8조의2</div>
            <div class="weapon-box-content">
              연 20% 초과분은 <strong>원칙적 무효</strong>. 2025년 7월 개정 대부업법에 따라 <strong>연 60% 초과 계약은 계약 자체가 무효</strong>.<br><br>
              대부제공자는 원금·이자를 청구할 수 없고, <strong>받은 돈은 반환해야 합니다.</strong>
            </div>
          </div>
          <div class="weapon-box">
            <div class="weapon-box-label">실제 효과</div>
            <div class="weapon-box-title">초과 상환분 반환 · 잔여 채무 소멸</div>
            <div class="weapon-box-content">
              <ul>
                <li>연 20% 초과분 → <strong>남은 채무 공제·반환</strong></li>
                <li>연 60% 초과 → 앞으로 갚을 의무 0원</li>
                <li>기존 상환액 전액 반환 대상</li>
                <li>금감원 무효확인서로 추심 근거 제거</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="weapon-footer">환수 가능액 · <strong>1분 무료 진단에서 바로 계산</strong></div>
      </div>

      <!-- WEAPON 03 -->
      <div class="weapon-card">
        <div class="weapon-header">
          <div class="weapon-badge">
            <span class="num">03</span>&nbsp;WEAPON
          </div>
          <div class="weapon-title-group">
            <div class="weapon-name">불법 추심 형사고소</div>
            <div class="weapon-promise">"당신이 겪은 괴롭힘은 이미 명문화된 형사 범죄입니다"</div>
          </div>
        </div>
        <div class="weapon-body">
          <div class="weapon-box">
            <div class="weapon-box-label">법적 근거</div>
            <div class="weapon-box-title">채권추심법 제9조 — 폭행·협박 등의 금지</div>
            <div class="weapon-box-content">
              다음은 모두 <strong>형사 처벌 대상</strong>:
              <ul>
                <li>폭행·협박·위계·위력 사용</li>
                <li><strong>야간(21시~익일 8시) 반복 연락</strong></li>
                <li>가족·직장 등 제3자에 알림</li>
                <li>대신 갚으라는 요구</li>
              </ul>
              사진 협박 → 성폭력처벌법 병합 적용
            </div>
          </div>
          <div class="weapon-box">
            <div class="weapon-box-label">실제 효과</div>
            <div class="weapon-box-title">수사 착수 = 추심 중단</div>
            <div class="weapon-box-content">
              <ul>
                <li><strong>수사 착수만으로 대부분 추심 중단</strong></li>
                <li>민사 손해배상 청구 병행 가능</li>
                <li>전국 261개 전담수사팀 운영 중</li>
                <li>신고포상금 최대 <strong>5천만 원</strong></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="weapon-footer">신고만으로 상대방이 도망가는 경우 · <strong>매우 많음</strong></div>
      </div>

    </div>

    <div class="strategy-box">
      <div class="strategy-title">상황에 맞는 대응 전략을 설계합니다</div>
      <div class="strategy-items">
        <div class="strategy-item">
          <span class="situation">추심 강도가 극심할 때</span>
          <span class="combination">WEAPON 01 + 03</span>
        </div>
        <div class="strategy-item">
          <span class="situation">원금 이상 상환했을 때</span>
          <span class="combination">WEAPON 02 환수 우선</span>
        </div>
        <div class="strategy-item">
          <span class="situation">가족 연락·사진 협박</span>
          <span class="combination">WEAPON 01 + 03 병합</span>
        </div>
      </div>
      <div class="strategy-cta">
        <div class="strategy-cta-text">
          어떤 조합이 당신에게 맞는지, <strong>1분 진단</strong>으로 확인됩니다.
        </div>
        <button type="button" class="btn-primary js-open-diagnosis" data-source="stats">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
          내 무기 확인 · 1분 무료 진단
        </button>
      </div>
    </div>
  </div>
</section>

<!-- ================= CASES ================= -->
<section class="cases">
  <div class="container">
    <div class="cases-header">
      <div class="section-label">REAL CASES</div>
      <h2 class="section-title">
        실제 숫자로 보는<br>
        <span style="color: var(--gold);">해결 케이스</span>
      </h2>
      <p class="section-sub">— 실제 대응 사례. 개인정보 보호를 위해 익명 처리 —</p>
    </div>

    <div class="cases-grid">

      <div class="case-card">
        <div class="case-header">
          <div class="case-num">— CASE 01</div>
          <div class="case-profile">30대 직장인 A씨<span class="region">· 서울</span></div>
        </div>
        <div class="case-stats">
          <div class="case-stat-row">
            <span class="label">원금 대여액</span>
            <span class="value">500만원</span>
          </div>
          <div class="case-stat-row">
            <span class="label">실제 상환 총액</span>
            <span class="value">1,400만원</span>
          </div>
          <div class="case-stat-row">
            <span class="label">적용 이자율</span>
            <span class="value" style="color: var(--crimson-bright);">연 180%</span>
          </div>
          <div class="case-stat-row highlight">
            <span class="label">환수 검토 금액</span>
            <span class="value">900만원</span>
          </div>
        </div>
        <div class="case-meta">
          <div class="case-meta-row">
            <span class="meta-label">대응 기간</span>
            <span class="meta-value">약 2개월</span>
          </div>
          <div class="case-meta-row" style="align-items: flex-start;">
            <span class="meta-label">사용 무기</span>
            <span class="meta-value" style="display: flex; flex-wrap: wrap;">
              <span class="case-weapon-tag">W02 계약 무효</span>
              <span class="case-weapon-tag">환수 청구</span>
            </span>
          </div>
        </div>
        <div class="case-outcome">
          초과 상환분 계산 후 <strong>금감원 무효확인서 발급</strong>. 추가 상환 의무 정지 및 환수 청구 진행.
        </div>
      </div>

      <div class="case-card">
        <div class="case-header">
          <div class="case-num">— CASE 02</div>
          <div class="case-profile">40대 자영업자 B씨<span class="region">· 경기</span></div>
        </div>
        <div class="case-stats">
          <div class="case-stat-row">
            <span class="label">피해 유형</span>
            <span class="value">복합 추심</span>
          </div>
          <div class="case-stat-row">
            <span class="label">지속 기간</span>
            <span class="value">3개월 이상</span>
          </div>
          <div class="case-stat-row">
            <span class="label">특이 사항</span>
            <span class="value" style="color: var(--crimson-bright);">사진 협박</span>
          </div>
          <div class="case-stat-row highlight">
            <span class="label">결과</span>
            <span class="value" style="font-size: 14px;">추심 중단 · 형사 고소</span>
          </div>
        </div>
        <div class="case-meta">
          <div class="case-meta-row">
            <span class="meta-label">대응 기간</span>
            <span class="meta-value">2주</span>
          </div>
          <div class="case-meta-row" style="align-items: flex-start;">
            <span class="meta-label">사용 무기</span>
            <span class="meta-value" style="display: flex; flex-wrap: wrap;">
              <span class="case-weapon-tag">W01 연락 차단</span>
              <span class="case-weapon-tag">W03 형사 고소</span>
            </span>
          </div>
        </div>
        <div class="case-outcome">
          서면 통지 후 <strong>추심 즉시 중단</strong>. 채권추심법·협박죄·성폭력처벌법 병합 고소.
        </div>
      </div>

      <div class="case-card">
        <div class="case-header">
          <div class="case-num">— CASE 03</div>
          <div class="case-profile">20대 사회초년생 C씨<span class="region">· 부산</span></div>
        </div>
        <div class="case-stats">
          <div class="case-stat-row">
            <span class="label">원금 대여액</span>
            <span class="value">100만원</span>
          </div>
          <div class="case-stat-row">
            <span class="label">실제 상환 총액</span>
            <span class="value">320만원</span>
          </div>
          <div class="case-stat-row">
            <span class="label">적용 이자율</span>
            <span class="value" style="color: var(--crimson-bright);">연 240%</span>
          </div>
          <div class="case-stat-row highlight">
            <span class="label">결과</span>
            <span class="value" style="font-size: 14px;">상환 의무 0원</span>
          </div>
        </div>
        <div class="case-meta">
          <div class="case-meta-row">
            <span class="meta-label">증거 상황</span>
            <span class="meta-value">카톡 일부만 보유</span>
          </div>
          <div class="case-meta-row" style="align-items: flex-start;">
            <span class="meta-label">사용 무기</span>
            <span class="meta-value" style="display: flex; flex-wrap: wrap;">
              <span class="case-weapon-tag">W02 계약 무효</span>
            </span>
          </div>
        </div>
        <div class="case-outcome">
          증거 복원 후 <strong>연 60% 초과 계약 무효 확정</strong>. 대부업법 제8조의2에 따라 상환 의무 소멸.
        </div>
      </div>

    </div>

    <div class="cases-warning">
      <div class="warn-icon">⚠</div>
      <div class="cases-warning-text">
        <strong>대응이 늦어질수록 환수 가능 금액은 줄어듭니다.</strong><br>
        증거는 시간이 지나면 사라지고, 추심은 시간이 지나면 강해집니다.
      </div>
    </div>

    <div class="cases-cta">
      <button type="button" class="btn-primary js-open-diagnosis" data-source="cases" style="padding: 20px 36px; font-size: 15.5px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
        내 환수 가능액 무료로 계산
      </button>
      <a href="__KAKAO_LINK__" target="_blank" rel="noreferrer" class="btn-secondary js-kakao-cta" data-source="cases">카카오톡으로 물어보기</a>
    </div>

    <div class="cases-footnote">
      ※ 위 사례는 실제 대응을 바탕으로 익명 처리되었습니다.<br>
      개별 사안은 구체적 사실관계에 따라 달라질 수 있습니다.
    </div>
  </div>
</section>

<!-- ================= CORE POINTS ================= -->
<section class="core-points">
  <div class="container">
    <div class="section-label">CORE POINTS</div>
    <h2 class="section-title">
      사채 피해자의<br>
      <span style="color: var(--gold);">안전과 피해회복</span>에 집중합니다.
    </h2>
    <p class="section-sub">— 사채업자는 정식 로펌을 두려워합니다 —</p>

    <div class="core-grid">
      <div class="core-card">
        <div class="core-num">— 01</div>
        <h3>추심 방식 확인</h3>
        <p>욕설·협박·반복 연락·가족 연락 여부를 시간순으로 정리합니다. 어떤 추심이 있었는지 구체적으로 기록하는 것부터가 시작입니다.</p>
        <div class="core-benefit">불법 추심이 확인되면 형사 대응 근거가 됩니다.</div>
      </div>
      <div class="core-card">
        <div class="core-num">— 02</div>
        <h3>상환 구조 확인</h3>
        <p>원금·이자율·실제 상환 총액을 법정 기준과 비교합니다. 얼마를 빌렸고 얼마를 갚았는지 숫자로 명확히 파악합니다.</p>
        <div class="core-benefit">연 20% 초과분은 원칙적으로 환수 대상입니다.</div>
      </div>
      <div class="core-card">
        <div class="core-num">— 03</div>
        <h3>증거 보존 정리</h3>
        <p>통화기록·문자·카톡·녹취·캡처를 체계적으로 분류합니다. 흩어진 자료를 법적으로 쓸 수 있는 형태로 묶어냅니다.</p>
        <div class="core-benefit">대응·합의·신고 모든 단계의 핵심 자료입니다.</div>
      </div>
    </div>
  </div>
</section>

<!-- ================= CHECKLIST DUO ================= -->
<section class="checklist-duo">
  <div class="container">
    <div style="text-align: center; margin-bottom: 10px;">
      <div class="section-label">CHECKLIST</div>
      <h2 class="section-title">상담 전, 두 가지만 확인해주세요</h2>
    </div>

    <div class="duo-grid" style="margin-top: 52px;">
      <div class="duo-card signal">
        <div class="duo-label">SIGNAL</div>
        <h3 class="duo-title">이런 신호가 보이면,<br>더 늦기 전에</h3>
        <ul class="duo-list">
          <li class="duo-item"><span class="duo-bullet"></span>밤낮 없이 연락이 반복된다</li>
          <li class="duo-item"><span class="duo-bullet"></span>지인·직장에 연락하겠다고 한다</li>
          <li class="duo-item"><span class="duo-bullet"></span>이미 원금 이상을 갚은 것 같다</li>
          <li class="duo-item warning"><span class="duo-bullet"></span>대화 내용을 지우고 싶어진다 <span class="warn-tag">지우지 마세요</span></li>
          <li class="duo-item"><span class="duo-bullet"></span>약속한 조건과 계속 달라진다</li>
        </ul>
        <div class="duo-footer">
          <strong>→</strong> 2개 이상 해당되면, 불법 추심 가능성이 높습니다.
        </div>
      </div>

      <div class="duo-card">
        <div class="duo-label">PREPARE</div>
        <h3 class="duo-title">상담 전,<br>이것만 남겨두세요</h3>
        <ul class="duo-list">
          <li class="duo-item"><span class="duo-bullet"></span>입출금 내역 캡처 (원금·이자 구분)</li>
          <li class="duo-item"><span class="duo-bullet"></span>문자·카톡 대화 전체 캡처</li>
          <li class="duo-item"><span class="duo-bullet"></span>통화 녹음 파일</li>
          <li class="duo-item"><span class="duo-bullet"></span>상대방 계좌번호·닉네임·전화번호</li>
          <li class="duo-item"><span class="duo-bullet"></span>차용증·계약서 사진 (있다면)</li>
        </ul>
        <div class="duo-footer">
          <strong>→</strong> 없어도 상담 가능합니다. 있는 것부터 보내주세요.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= PROCESS ================= -->
<section class="process">
  <div class="container">
    <div class="section-label">PROCESS FLOW</div>
    <h2 class="section-title">
      상담은 이렇게<br>
      진행됩니다.
    </h2>
    <p class="section-sub">— 첫 상담부터 결과까지, 변호사가 모든 단계에 함께합니다 —</p>

    <div class="process-wrap">
      <div class="steps-grid">
        <div class="step">
          <div class="step-num">STEP 01</div>
          <h4>피해 상황 확인</h4>
          <p>카카오톡으로 정황 공유<br>변호사 1차 검토 <strong>(무료)</strong></p>
        </div>
        <div class="step">
          <div class="step-num">STEP 02</div>
          <h4>증거 자료 정리</h4>
          <p>남아있는 자료 기준<br>불법성 판단 · 분류</p>
        </div>
        <div class="step">
          <div class="step-num">STEP 03</div>
          <h4>대응 방향 검토</h4>
          <p>형사 / 합의 / 환수<br>최적 전략 설계</p>
        </div>
        <div class="step">
          <div class="step-num">STEP 04</div>
          <h4>환수 가능성 검토</h4>
          <p>초과 상환분이 있다면<br>회수 절차 진행</p>
        </div>
      </div>
      <div class="process-cta">
        <button type="button" class="btn-primary js-open-diagnosis" data-source="process">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
          1분 무료 진단 시작
        </button>
        <a href="__KAKAO_LINK__" target="_blank" rel="noreferrer" class="btn-secondary js-kakao-cta" data-source="process">카카오톡 상담</a>
      </div>
    </div>
  </div>
</section>

<!-- ================= FAQ ================= -->
<section class="faq">
  <div class="container">
    <div style="text-align: center;">
      <div class="section-label">FREQUENTLY ASKED</div>
      <h2 class="section-title">
        <span style="color: var(--gold);">자주 하는</span> 질문
      </h2>
    </div>

    <div class="faq-list">
      <div class="faq-item featured">
        <div class="faq-q">상담하면 채권자에게 알려지지 않나요?</div>
        <div class="faq-a">
          <strong>절대 알려지지 않습니다.</strong> 변호사는 법으로 비밀유지 의무가 있으며, 상담 단계에서는 어떠한 대외 연락도 발생하지 않습니다. 의뢰인의 동의 없이는 다음 단계로 진행되지 않습니다.
        </div>
        <div class="faq-law">📎 근거: 변호사법 제26조 (비밀유지의무)</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">로가드는 진짜 변호사가 하는 건가요?</div>
        <div class="faq-a">
          로가드는 <strong>매일법률사무소(대표변호사 김민석)</strong>가 운영하는 불법사채 전담 법률 서비스입니다. 상담·서류 검토·대응 전략 수립까지 모두 변호사가 직접 진행하며, 매일법률사무소 정식 사건으로 수임됩니다. "○○센터", "○○지원단" 같은 비변호사 업체와는 구조가 다릅니다.
        </div>
        <div class="faq-law">📎 사업자등록번호 489-04-02780</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">이미 꽤 많이 갚았는데도 계속 돈을 요구합니다.</div>
        <div class="faq-a">
          원금과 실제 상환 총액을 먼저 정리해보는 것이 중요합니다. <strong>연 20%(법정 최고이자율)를 초과한 상환분은 원칙적으로 무효</strong>이며, 환수를 검토할 수 있습니다.
        </div>
        <div class="faq-law">📎 근거: 이자제한법 제2조, 대부업법 제8조</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">가족이나 직장으로 연락이 간 상태입니다.</div>
        <div class="faq-a">
          이 경우는 대응 속도가 중요합니다. <strong>제3자에 대한 연락은 채권추심법 위반으로 형사 처벌 대상</strong>입니다. 연락 정황·캡처·통화기록을 남기고 빠르게 상담해주세요.
        </div>
        <div class="faq-law">📎 근거: 채권추심법 제9조 제6호·제7호</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">증거가 조금밖에 없어도 상담이 가능한가요?</div>
        <div class="faq-a">
          가능합니다. 계좌내역·문자·카톡·통화기록 중 남아 있는 것을 최대한 보존해두시면 됩니다. 없는 자료는 법적 절차를 통해 확보 가능한 경우도 많습니다.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">상담료는 어떻게 되나요?</div>
        <div class="faq-a">
          <strong>모든 상담은 무료</strong>입니다. 피해 상황을 검토한 후 대응이 필요한 경우에만 수임 여부와 비용을 투명하게 안내드립니다.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= FOOTER CTA ================= -->
<section class="footer-cta">
  <div class="container">
    <div class="footer-ornament">— ROGUARD × 매일법률사무소 —</div>
    <h2 class="footer-title">
      불법사채·불법추심 대응 상담
    </h2>
    <div class="footer-info footer-business-info">
      상호명: 매일법률사무소 | 대표자: 김민석 | 사업자등록번호: 489-04-02780<br>
      주소: 서울특별시 서초구 서초대로42길 66 매일빌딩<br>
      광고책임자: 김민석 변호사 | 이메일: doublestone.partners@gmail.com
    </div>
    <div class="final-cta">
      <button type="button" class="btn-primary js-open-diagnosis" data-source="footer" style="padding: 20px 40px; font-size: 15.5px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
        1분 무료 진단 시작
      </button>
      <a href="__KAKAO_LINK__" target="_blank" rel="noreferrer" class="btn-secondary js-kakao-cta" data-source="footer" style="padding: 20px 32px; font-size: 15.5px;">카카오톡 상담</a>
    </div>
    <div class="footer-meta">
      © LAWGUARD. 본 페이지의 법률 정보는 일반적 안내이며, 구체적 상담은 변호사와 진행하시기 바랍니다.
    </div>
  </div>
</section>

<!-- ================= MOBILE STICKY CTA ================= -->
<div class="sticky-cta">
  <button type="button" class="btn-primary js-open-diagnosis" data-source="sticky">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
    1분 무료 진단
  </button>
  <a href="__KAKAO_LINK__" target="_blank" rel="noreferrer" class="btn-secondary js-kakao-cta" data-source="sticky">카톡</a>
</div>`;
