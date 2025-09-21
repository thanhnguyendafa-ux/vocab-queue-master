import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, Clock, RotateCw, Home, TrendingUp, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

type SessionStats = {
  correct: number
  total: number
  timeSpent?: number // in seconds
  accuracy: number
}

export function ReviewSession() {
  const location = useLocation()
  const navigate = useNavigate()
  const [stats, setStats] = useState<SessionStats>({ correct: 0, total: 0, accuracy: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Calculate session statistics
  useEffect(() => {
    const sessionStats = location.state?.stats || { correct: 0, total: 0 }
    const accuracy = sessionStats.total > 0 
      ? Math.round((sessionStats.correct / sessionStats.total) * 100) 
      : 0
    
    setStats({
      ...sessionStats,
      accuracy,
      timeSpent: location.state?.timeSpent || 0
    })
    setIsLoading(false)
  }, [location.state])

  const handleRestart = () => {
    navigate('/study', { replace: true })
  }

  const handleHome = () => {
    navigate('/')
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading session results...</div>
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Session Complete!</CardTitle>
              <CardDescription>
                Review your performance and next steps
              </CardDescription>
            </div>
            <div className="text-4xl font-bold text-primary">
              {stats.accuracy}%
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Correct" 
              value={stats.correct} 
              total={stats.total}
              icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
              color="green"
            />
            
            <StatCard 
              title="Incorrect" 
              value={stats.total - stats.correct} 
              total={stats.total}
              icon={<XCircle className="h-6 w-6 text-red-500" />}
              color="red"
            />
            
            <StatCard 
              title="Time Spent" 
              value={stats.timeSpent ? Math.floor(stats.timeSpent / 60) : 0} 
              total={stats.timeSpent ? Math.ceil(stats.timeSpent / 60) + 1 : 1}
              icon={<Clock className="h-6 w-6 text-blue-500" />}
              unit="min"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mastery Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats.correct} of {stats.total} mastered
                </span>
              </div>
              <Progress value={(stats.correct / stats.total) * 100} className="h-2" />
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                {stats.accuracy > 70 
                  ? "Great job! You're making excellent progress."
                  : stats.accuracy > 40 
                    ? "Keep practicing! You'll improve with more sessions."
                    : "Review challenging items and try again!"
                }
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={handleHome}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Button 
            className="w-full sm:w-auto"
            onClick={handleRestart}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Study Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

type StatCardProps = {
  title: string
  value: number
  total: number
  icon: React.ReactNode
  color?: string
  unit?: string
}

function StatCard({ title, value, total, icon, unit = '' }: StatCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
        {icon}
      </div>
      <div className="text-sm font-medium text-center">{title}</div>
      <div className="text-2xl font-bold">
        {value}{unit && ` ${unit}`}
      </div>
      <div className="text-xs text-muted-foreground">
        {percentage}% of session
      </div>
    </div>
  )
}
