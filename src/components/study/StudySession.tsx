import { useQuery } from "@tanstack/react-query"
import { DBService } from "@/services/db-service"
import { QuizCard } from "./QuizCard"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function StudySession() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0
  })

  const { data: items = [] } = useQuery({
    queryKey: ['dueItems'],
    queryFn: () => DBService.getDueItems(10)
  })

  const handleAnswer = (isCorrect: boolean) => {
    setSessionStats(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }))
    
    // Update item in database
    const currentItem = items[currentIndex]
    if (currentItem) {
      DBService.updateVocabItem(currentItem.id!, { 
        lastReviewedAt: Date.now(),
        [isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed']: 
          (currentItem[isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed'] || 0) + 1
      })
    }

    // Move to next or end session
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Save session results
      DBService.saveStudySession({
        startedAt: Date.now(),
        duration: 0, // Calculate actual duration
        correct: sessionStats.correct + (isCorrect ? 1 : 0),
        total: sessionStats.total + 1,
        items: items.map(item => item.id!)
      })
      
      navigate('/review', { state: { stats: sessionStats } })
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No items to review!</h2>
        <p className="text-muted-foreground mb-4">
          Come back later or add more vocabulary items.
        </p>
        <Button onClick={() => navigate('/vocabulary')}>
          View Vocabulary
        </Button>
      </div>
    )
  }

  const currentItem = items[currentIndex]
  const progress = ((currentIndex) / items.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {items.length}
        </span>
        <div className="w-1/2">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm font-medium">
          {sessionStats.correct} / {sessionStats.total} correct
        </span>
      </div>

      {currentItem && (
        <QuizCard
          term={currentItem.term}
          definition={currentItem.definition}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  )
}
