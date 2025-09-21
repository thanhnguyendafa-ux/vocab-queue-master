import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Check, X } from "lucide-react";
export function QuizCard(_a) {
    var term = _a.term, definition = _a.definition, onAnswer = _a.onAnswer;
    var _b = useState(false), showAnswer = _b[0], setShowAnswer = _b[1];
    var _c = useState(null), selectedOption = _c[0], setSelectedOption = _c[1];
    // In a real app, these would come from your data
    var options = [
        definition,
        "Incorrect Option 1",
        "Incorrect Option 2",
        "Incorrect Option 3"
    ].sort(function () { return Math.random() - 0.5; });
    var handleSelect = function (option) {
        if (showAnswer)
            return;
        setSelectedOption(option);
        setShowAnswer(true);
        onAnswer(option === definition);
    };
    return (<Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{term}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {options.map(function (option) {
            var isCorrect = option === definition;
            var isSelected = selectedOption === option;
            var variant = "outline";
            if (showAnswer) {
                if (isCorrect)
                    variant = "default";
                else if (isSelected)
                    variant = "destructive";
            }
            else if (isSelected) {
                variant = "secondary";
            }
            return (<Button key={option} variant={variant} className="justify-start h-auto py-3 text-left whitespace-normal" onClick={function () { return handleSelect(option); }}>
                <div className="flex items-center gap-2">
                  {showAnswer && (isCorrect ?
                    <Check className="h-4 w-4 text-green-500"/> :
                    <X className="h-4 w-4 text-red-500"/>)}
                  {option}
                </div>
              </Button>);
        })}
        </div>
      </CardContent>
      {showAnswer && (<CardFooter className="flex justify-between">
          <Button variant="outline" onClick={function () { return onAnswer(false); }}>
            I was wrong
          </Button>
          <Button onClick={function () { return onAnswer(true); }}>
            I was right
          </Button>
        </CardFooter>)}
    </Card>);
}
//# sourceMappingURL=QuizCard.jsx.map