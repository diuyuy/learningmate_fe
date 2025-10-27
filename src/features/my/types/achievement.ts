export type StudyAchievement = {
  studyCounts: number;
  reviewCounts: number;
  solvedQuizCounts: number;
  watchedVideoCounts: number;
};

export type StudyCategoryGraph = {
  [category: string]: number;
};
