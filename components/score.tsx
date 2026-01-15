import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, TrendingUp } from "lucide-react"

interface QuizScoreProps {
  correctAnswers: number
  totalQuestions: number
}

export default function QuizScore({ correctAnswers, totalQuestions }: QuizScoreProps) {
  const score = (correctAnswers / totalQuestions) * 100
  const roundedScore = Math.round(score)
  const incorrectAnswers = totalQuestions - correctAnswers

  const getGrade = () => {
    if (score === 100) return { letter: "A+", color: "text-green-600 dark:text-green-400" }
    if (score >= 90) return { letter: "A", color: "text-green-600 dark:text-green-400" }
    if (score >= 80) return { letter: "B", color: "text-blue-600 dark:text-blue-400" }
    if (score >= 70) return { letter: "C", color: "text-yellow-600 dark:text-yellow-400" }
    if (score >= 60) return { letter: "D", color: "text-orange-600 dark:text-orange-400" }
    return { letter: "F", color: "text-red-600 dark:text-red-400" }
  }

  const getMessage = () => {
    if (score === 100) return "Perfect score! Congratulations!"
    if (score >= 90) return "Outstanding! Excellent work!"
    if (score >= 80) return "Great job! You did excellently!"
    if (score >= 70) return "Good work! You're on the right track."
    if (score >= 60) return "Decent effort! Keep practicing."
    if (score >= 40) return "Not bad, but there's room for improvement."
    return "Keep practicing, you'll get better!"
  }

  const grade = getGrade()

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Your Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Main Score Display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Trophy className={`h-12 w-12 ${grade.color}`} />
            <div>
              <p className={`text-5xl font-bold ${grade.color}`}>
                {roundedScore}%
              </p>
              <p className={`text-2xl font-semibold ${grade.color}`}>
                Grade: {grade.letter}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            {correctAnswers} out of {totalQuestions} questions correct
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={score} className="h-3" />
        </div>

        {/* Message */}
        <p className="text-center font-medium text-lg">{getMessage()}</p>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Target className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {correctAnswers}
            </p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="h-6 w-6 mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl text-red-600 dark:text-red-400">✕</span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {incorrectAnswers}
            </p>
            <p className="text-xs text-muted-foreground">Incorrect</p>
          </div>
          <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {roundedScore}%
            </p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
