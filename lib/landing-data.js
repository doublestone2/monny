export const KAKAO_LINK = 'http://pf.kakao.com/_CUPCX/chat';
export const NAVER_CAFE_LINK = 'https://cafe.naver.com/coincheating';
export const LAWFIRM_SITE_LINK = 'https://xn--9z2b2xi4aba940lua.com/';

export const DAMAGE_TYPES = [
  '불법사채',
  '불법추심',
  '대리입금',
  '선이자·고금리 피해',
  '지인연락·직장연락 피해',
  '기타',
];

export const PRESSURE_LEVELS = [
  '연락은 있으나 심하지 않음',
  '반복 연락으로 스트레스가 큼',
  '욕설·협박성 연락이 있음',
  '가족·지인·직장에 연락함',
  '사진유포·신상유포 등 위협이 있음',
];

export const YES_NO = ['있음', '없음'];

export const EVIDENCE_OPTIONS = [
  '계좌내역 있음',
  '문자·카톡 있음',
  '녹취 있음',
  '캡처 일부만 있음',
  '거의 없음',
];

export const PRIVACY_POLICY_TEXT = `개인정보처리방침 안내

매일법률사무소(이하 “회사”)는 관련 법령에 따라 개인정보를 처리합니다.

1. 수집항목
이름, 연락처, 상담내용, 접속기록

2. 이용목적
상담 접수, 사실관계 확인, 법률서비스 안내, 민원 응대

3. 보유기간
상담 목적 달성 후 지체 없이 파기하되, 관련 법령상 보존 의무가 있는 경우 해당 기간 동안 보관합니다.

4. 문의
매일법률사무소 / 02-6283-1100 / maeil@lawmaeil.com`;

export const urgencyMessages = {
  low: {
    label: '초기 대응 단계',
    title: '지금부터 기록을 남기면 대응이 훨씬 유리합니다.',
    desc: '현재 단계에서는 증거 보존과 연락 대응 가이드만 제대로 잡아도 이후 절차가 훨씬 정리됩니다.',
  },
  medium: {
    label: '우선 상담 권장',
    title: '추심 강도가 올라가기 전에 대응 방향을 잡는 것이 좋습니다.',
    desc: '상대방의 연락 방식과 상환 구조를 함께 검토해 두는 것이 안전합니다.',
  },
  high: {
    label: '긴급 대응 필요',
    title: '주변인 연락·협박 정황이 있다면 빠른 법률 대응이 중요합니다.',
    desc: '증거 확보, 대응 문구 정리, 합의 가능성 검토, 환수 가능성 확인을 서둘러 진행하는 편이 좋습니다.',
  },
};
