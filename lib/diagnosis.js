export function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  return Number(String(value).replace(/[^0-9]/g, '') || 0);
}

export function formatManwon(value) {
  return `${toNumber(value).toLocaleString('ko-KR')}만원`;
}

export function getDiagnosisPayload(form) {
  const principal = toNumber(form.loanAmount);
  const repaid = toNumber(form.repaidAmount);
  const overpaid = Math.max(0, repaid - principal);

  let score = 0;

  if (['불법사채', '대리입금', '선이자·고금리 피해'].includes(form.damageType)) {
    score += 2;
  }

  if (
    ['욕설·협박성 연락이 있음', '가족·지인·직장에 연락함', '사진유포·신상유포 등 위협이 있음'].includes(
      form.pressureLevel
    )
  ) {
    score += 3;
  }

  if (form.evidence !== '거의 없음' && form.evidence !== '') {
    score += 2;
  }

  if (form.spreadDamage === '있음') {
    score += 3;
  }

  if (overpaid > 0) {
    score += 2;
  }

  const urgency = score >= 8 ? 'high' : score >= 4 ? 'medium' : 'low';

  const actionItems = [];
  if (form.evidence !== '거의 없음' && form.evidence !== '') {
    actionItems.push('증거 보존 및 정리');
  }
  if (form.spreadDamage === '있음') {
    actionItems.push('주변인 연락·명예훼손 대응 검토');
  }
  if (form.pressureLevel === '사진유포·신상유포 등 위협이 있음') {
    actionItems.push('긴급 위협 대응 및 신고 검토');
  }
  if (overpaid > 0) {
    actionItems.push('초과 상환분 환수 가능성 검토');
  }
  actionItems.push('합의 가능성 및 대응 문구 정리');

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
    summary: `${form.damageType || '피해유형 미선택'} / ${form.pressureLevel || '추심단계 미선택'} / 증거 ${form.evidence || '미선택'}`,
  };
}

export function getCurrentStepValid(step, form) {
  if (step === 1) return !!form.damageType;
  if (step === 2) return !!form.pressureLevel;
  if (step === 3) return true;
  if (step === 4) return true;
  if (step === 5) return !!form.evidence;
  if (step === 6) return !!form.spreadDamage;
  return true;
}
