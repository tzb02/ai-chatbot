// Example: How to implement a structured survey flow

// 1. Define your survey questions
export const SURVEY_QUESTIONS = [
  {
    id: "q1",
    question: "How would you rate your overall experience with our service?",
    type: "rating",
    scale: "1-10",
  },
  {
    id: "q2",
    question: "What did you like most about our service?",
    type: "text",
  },
  {
    id: "q3",
    question: "What could we improve?",
    type: "text",
  },
  {
    id: "q4",
    question: "Would you recommend us to a friend or colleague?",
    type: "boolean",
    options: ["Yes", "No"],
  },
  {
    id: "q5",
    question: "How likely are you to use our service again?",
    type: "multiple_choice",
    options: ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"],
  },
];

// 2. System prompt for structured survey
export const STRUCTURED_SURVEY_PROMPT = `You are a professional survey assistant conducting a customer satisfaction survey.

Your task:
1. Ask questions one at a time from the survey
2. Wait for the user's response before moving to the next question
3. Acknowledge each answer briefly and naturally
4. Keep track of which questions have been answered
5. Thank the user when the survey is complete

Survey Questions:
${SURVEY_QUESTIONS.map((q, i) => `${i + 1}. ${q.question}`).join("\n")}

Guidelines:
- Be friendly and conversational
- Don't rush the user
- If an answer is unclear, politely ask for clarification
- Validate responses (e.g., ratings should be 1-10)
- Keep your responses brief (1-2 sentences)

Start by greeting the user and asking the first question.`;

// 3. Example: Parse and save survey responses
export function parseSurveyResponse(
  messageText: string,
  currentQuestionId: string
): {
  questionId: string;
  answer: string;
  isValid: boolean;
} {
  const question = SURVEY_QUESTIONS.find((q) => q.id === currentQuestionId);

  if (!question) {
    return { questionId: currentQuestionId, answer: messageText, isValid: false };
  }

  // Validate based on question type
  switch (question.type) {
    case "rating":
      const rating = parseInt(messageText);
      const isValidRating = !isNaN(rating) && rating >= 1 && rating <= 10;
      return {
        questionId: currentQuestionId,
        answer: messageText,
        isValid: isValidRating,
      };

    case "boolean":
      const normalizedAnswer = messageText.toLowerCase();
      const isValidBoolean =
        normalizedAnswer.includes("yes") ||
        normalizedAnswer.includes("no") ||
        normalizedAnswer.includes("yeah") ||
        normalizedAnswer.includes("nope");
      return {
        questionId: currentQuestionId,
        answer: messageText,
        isValid: isValidBoolean,
      };

    case "multiple_choice":
      const isValidChoice = question.options?.some((option) =>
        messageText.toLowerCase().includes(option.toLowerCase())
      );
      return {
        questionId: currentQuestionId,
        answer: messageText,
        isValid: isValidChoice || false,
      };

    case "text":
      const isValidText = messageText.trim().length > 0;
      return {
        questionId: currentQuestionId,
        answer: messageText,
        isValid: isValidText,
      };

    default:
      return {
        questionId: currentQuestionId,
        answer: messageText,
        isValid: true,
      };
  }
}

// 4. Example: Track survey progress
export interface SurveyProgress {
  chatId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isComplete: boolean;
}

export function updateSurveyProgress(
  progress: SurveyProgress,
  questionId: string,
  answer: string
): SurveyProgress {
  const newAnswers = { ...progress.answers, [questionId]: answer };
  const currentIndex = progress.currentQuestionIndex + 1;
  const isComplete = currentIndex >= SURVEY_QUESTIONS.length;

  return {
    ...progress,
    currentQuestionIndex: currentIndex,
    answers: newAnswers,
    isComplete,
  };
}

// 5. Example: Generate survey summary
export function generateSurveySummary(answers: Record<string, string>): string {
  let summary = "Survey Summary:\n\n";

  SURVEY_QUESTIONS.forEach((question) => {
    const answer = answers[question.id] || "Not answered";
    summary += `${question.question}\nAnswer: ${answer}\n\n`;
  });

  return summary;
}

// 6. Example: Calculate survey metrics
export function calculateSurveyMetrics(answers: Record<string, string>) {
  const metrics = {
    overallRating: 0,
    npsScore: 0,
    completionRate: 0,
    recommendationRate: 0,
  };

  // Overall rating (Q1)
  const rating = parseInt(answers.q1);
  if (!isNaN(rating)) {
    metrics.overallRating = rating;
  }

  // NPS Score (Q5)
  const likelihood = answers.q5?.toLowerCase();
  if (likelihood?.includes("very likely")) {
    metrics.npsScore = 10;
  } else if (likelihood?.includes("likely")) {
    metrics.npsScore = 8;
  } else if (likelihood?.includes("neutral")) {
    metrics.npsScore = 7;
  } else if (likelihood?.includes("unlikely")) {
    metrics.npsScore = 4;
  } else if (likelihood?.includes("very unlikely")) {
    metrics.npsScore = 0;
  }

  // Completion rate
  const answeredQuestions = Object.keys(answers).length;
  metrics.completionRate = (answeredQuestions / SURVEY_QUESTIONS.length) * 100;

  // Recommendation rate (Q4)
  const wouldRecommend = answers.q4?.toLowerCase();
  metrics.recommendationRate = wouldRecommend?.includes("yes") ? 100 : 0;

  return metrics;
}

// 7. Example usage in API route:
/*
import { STRUCTURED_SURVEY_PROMPT, parseSurveyResponse } from "@/examples/survey-example";

export async function POST(request: Request) {
  // ... existing code ...
  
  const result = streamText({
    model: myProvider.languageModel("gpt-4o-mini"),
    system: STRUCTURED_SURVEY_PROMPT, // Use structured survey prompt
    messages: convertToModelMessages(uiMessages),
    // ... rest of config
  });
  
  // ... rest of code ...
}
*/
