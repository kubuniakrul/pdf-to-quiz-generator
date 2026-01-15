import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Question } from '@/lib/schemas'

interface QuizReviewProps {
  questions: Question[]
  userAnswers: number[] // Changed from string[] to number[] to match schema
}

export default function QuizReview({ questions, userAnswers }: QuizReviewProps) {
  const answerLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quiz Review</CardTitle>
        <p className="text-muted-foreground">
          Review all {questions.length} questions and your answers
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-8 last:mb-0">
              <div className="flex items-start gap-2 mb-4">
                <span className="text-sm font-semibold text-muted-foreground min-w-[60px]">
                  Q{questionIndex + 1}/{questions.length}
                </span>
                <h3 className="text-lg font-semibold flex-1">{question.question}</h3>
              </div>
              
              <div className="space-y-2 ml-[68px]">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === question.correctAnswer // Fixed: use correctAnswer
                  const isSelected = optionIndex === userAnswers[questionIndex] // Fixed: compare indices
                  const isIncorrectSelection = isSelected && !isCorrect

                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center p-4 rounded-lg transition-colors ${
                        isCorrect
                          ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                          : isIncorrectSelection
                          ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                          : 'border border-border bg-card'
                      }`}
                    >
                      <span className="text-lg font-medium mr-4 w-6">
                        {answerLabels[optionIndex]}
                      </span>
                      <span className="flex-grow">{option}</span>
                      {isCorrect && (
                        <div className="flex items-center gap-1 ml-2">
                          <Check className="text-green-600 dark:text-green-400" size={20} />
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            Correct
                          </span>
                        </div>
                      )}
                      {isIncorrectSelection && (
                        <div className="flex items-center gap-1 ml-2">
                          <X className="text-red-600 dark:text-red-400" size={20} />
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                            Your answer
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {/* Show explanation if available */}
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        Explanation:{' '}
                      </span>
                      <span className="text-blue-600 dark:text-blue-200">
                        {question.explanation}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
