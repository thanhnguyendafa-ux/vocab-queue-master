import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Check, X } from "lucide-react"

type QuizCardProps = {
  term: string
  definition: string
  onAnswer: (isCorrect: boolean) => void
}

export function QuizCard({ term, definition, onAnswer }: QuizCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  
  // In a real app, these would come from your data
  const options = [
    definition,
    "Incorrect Option 1",
    "Incorrect Option 2",
    "Incorrect Option 3"
  ].sort(() => Math.random() - 0.5)

  const handleSelect = (option: string) => {
    if (showAnswer) return
    setSelectedOption(option)
    setShowAnswer(true)
    onAnswer(option === definition)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{term}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => {
            const isCorrect = option === definition
            const isSelected = selectedOption === option
            let variant: "default" | "secondary" | "destructive" = "outline"
            
            if (showAnswer) {
              if (isCorrect) variant = "default"
              else if (isSelected) variant = "destructive"
            } else if (isSelected) {
              variant = "secondary"
            }
            
            return (
              <Button
                key={option}
                variant={variant}
                className="justify-start h-auto py-3 text-left whitespace-normal"
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center gap-2">
                  {showAnswer && (
                    isCorrect ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />
                  )}
                  {option}
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
      {showAnswer && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onAnswer(false)}>
            I was wrong
          </Button>
          <Button onClick={() => onAnswer(true)}>
            I was right
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
