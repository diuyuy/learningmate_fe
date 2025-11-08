// 퀴즈 통계
export type QuizStatistics = {
  correctCounts: number; // 정답 수
  totalCounts: number; // 시도(총) 문제 수
};

// 틀린 문제 아이템
export type IncorrectQuizItem = {
  id: number;
  article: {
    id: number;
    title: string;
    keyword: {
      id: number;
      name: string;
      description: string;
      date: string;
    };
  };
  description: string; // 문제 내용
  explanation: string; // 해설
  answer: string; // 정답: "1"~"4"
  memberAnswer: string; // 내 답: "1"~"4"
  answerCreatedAt: string;
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
};

// 페이지 응답
export type IncorrectQuizPage = {
  items: IncorrectQuizItem[];
  page: number;
  size: number;
  hasNext: boolean;
  totalElements: number;
  totalPages: number;
};
