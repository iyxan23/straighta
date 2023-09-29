// using zod types are probably better

export type Subject = {
  id: number;
  title: string;
  overallScore: number;
};

export type StudySession = {
  id: number;
  timestamp: {
    start: number;
    end?: number;
  };
  materialId: number;
};

export type Material = {
  id: number;
  title: string;
  overallScore: number;
  subjectId: number;
};
