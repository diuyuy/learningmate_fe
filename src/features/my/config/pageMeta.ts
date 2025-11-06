// 공통 메타 + UI 토큰 (모든 탭에서 재사용)
export const PAGE_META = {
  profile: {
    title: '프로필',
    desc: '계정 정보를 안전하고 깔끔하게 관리하세요.',
  },
  achievement: {
    title: '학습 성취도',
    desc: '지금까지의 학습 활동과 성취를 한눈에 확인해보세요.',
  },
  quiz: {
    title: '퀴즈',
    desc: '다양한 퀴즈로 학습 내용을 복습하고 실력을 확인하세요.',
  },
  review: {
    title: '내 리뷰',
    desc: '내가 남긴 학습 후기와 평가들을 다시 살펴볼 수 있어요.',
  },
  scrap: {
    title: '스크랩',
    desc: '나중에 다시 보고 싶은 콘텐츠를 한 곳에서 모아보세요.',
  },
} as const;

export type PageKey = keyof typeof PAGE_META;

// ✅ 모든 섹션에서 동일하게 쓰는 UI 토큰들
export const TOKENS = {
  // 섹션 상단 제목/설명 아래 기본 간격
  sectionGapY: 'space-y-4 md:space-y-6',
  // 카드 내부 패딩 (학습 성취도 카드와 동일)
  cardPadding: 'p-5 md:p-6',
  // 카드 공통 클래스
  card: 'rounded-2xl border border-neutral-200',
  // 본문 컨테이너 패딩 (상황 따라 선택적으로 사용)
  containerPad: 'p-4 md:p-6 lg:p-8',
};
