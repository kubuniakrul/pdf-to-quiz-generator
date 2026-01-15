import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  FileText,
} from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import { Question } from "@/lib/schemas";

type QuizProps = {
  questions: Question[];
  clearPDF: () => void;
  title: string;
};

const QuestionCard: React.FC<{
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (answer: number) => void;
  showFeedback: boolean; // Added: control when to show feedback
}> = ({ question, selectedAnswer, onSelectAnswer, showFeedback }) => {
  const answerLabels = ["A", "B", "C", "D"];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold leading-tight">
        {question.question}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const isIncorrect = showFeedback && isSelected && !isCorrect;
          
          return (
            <Button
              key={index}
              variant={isSelected ? "secondary" : "outline"}
              disabled={showFeedback} // Disable after answering
              className={`h-auto py-6 px-4 justify-start text-left whitespace-normal transition-all ${
                showFeedback && isCorrect
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : isIncorrect
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                    : ""
              }`}
              onClick={() => onSelectAnswer(index)}
            >
              <span className="text-lg font-medium mr-4 shrink-0">
                {answerLabels[index]}
              </span>
              <span className="flex-grow">{option}</span>
              {showFeedback && isCorrect && (
                <Check className="ml-2 shrink-0 text-white" size={24} />
              )}
              {isIncorrect && (
                <X className="ml-2 shrink-0 text-white" size={24} />
              )}
            </Button>
          );
        })}
      </div>

      {/* INSTANT FEEDBACK - Shows immediately after selecting */}
      {showFeedback && selectedAnswer !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border-2 ${
            selectedAnswer === question.correctAnswer
              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
              : "bg-red-50 dark:bg-red-900/20 border-red-500"
          }`}
        >
          <div className="flex items-start gap-3">
            {selectedAnswer === question.correctAnswer ? (
              <Check className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            ) : (
              <X className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-2">
              <p className={`font-semibold text-lg ${
                selectedAnswer === question.correctAnswer
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}>
                {selectedAnswer === question.correctAnswer
                  ? "Correct!"
                  : "Incorrect"}
              </p>
              {question.explanation && (
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              )}
              {selectedAnswer !== question.correctAnswer && (
                <p className="text-sm font-medium">
                  Correct answer: <span className="text-green-600 dark:text-green-400">
                    {answerLabels[question.correctAnswer]}. {question.options[question.correctAnswer]}
                  </span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function Quiz({
  questions,
  clearPDF,
  title = "Quiz",
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(false); // Added: track feedback state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  const handleSelectAnswer = (answer: number) => {
    if (!showFeedback) { // Only allow selection if feedback not shown yet
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
      setShowFeedback(true); // Show feedback immediately
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false); // Hide feedback for next question
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowFeedback(false); // Hide feedback when going back
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // If previous question was answered, show its feedback
      if (answers[currentQuestionIndex - 1] !== null) {
        setTimeout(() => setShowFeedback(true), 100);
      }
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === answers[index] ? 1 : 0);
    }, 0);
    setScore(correctAnswers);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(null);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setShowFeedback(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          {title}
        </h1>
        <div className="relative">
          {!isSubmitted && (
            <div className="mb-8 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {answeredCount} of {questions.length} questions answered
              </p>
            </div>
          )}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSubmitted ? "results" : currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {!isSubmitted ? (
                  <div className="space-y-8">
                    <QuestionCard
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestionIndex]}
                      onSelectAnswer={handleSelectAnswer}
                      showFeedback={showFeedback}
                    />
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="ghost"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <span className="text-sm font-medium">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!showFeedback} // Only enable after answering
                        variant="ghost"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Submit"
                          : "Next"}{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={score ?? 0}
                      totalQuestions={questions.length}
                    />
                    <div className="space-y-12">
                      <QuizReview 
                        questions={questions} 
                        userAnswers={answers.map(a => a ?? -1)}
                      />
                    </div>
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                      </Button>
                      <Button
                        onClick={clearPDF}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" /> Try Another PDF
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
