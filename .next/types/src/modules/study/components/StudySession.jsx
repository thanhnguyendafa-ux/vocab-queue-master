import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../../../store/useQuizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Check, X, ArrowRight, BookOpen, Clock } from 'lucide-react';
export function StudySession() {
    var _a = useQuizStore(), currentSession = _a.currentSession, processAnswer = _a.processAnswer, quitSession = _a.quitSession, completeSession = _a.completeSession, getSessionStats = _a.getSessionStats;
    var _b = useState(null), currentQuestion = _b[0], setCurrentQuestion = _b[1];
    var _c = useState(null), selectedAnswer = _c[0], setSelectedAnswer = _c[1];
    var _d = useState(null), isCorrect = _d[0], setIsCorrect = _d[1];
    var _e = useState(Date.now()), timeStarted = _e[0], setTimeStarted = _e[1];
    // Generate question when session starts or progresses
    useEffect(function () {
        if (currentSession && currentSession.items.length > 0) {
            generateQuestion(currentSession.items[0]);
        }
    }, [currentSession]);
    var generateQuestion = function (item) {
        // Simplified question generation - in full implementation this would
        // use the modules system to create different question types
        var newQuestion = {
            id: "question_".concat(Date.now()),
            type: 'mcq',
            item: item,
            options: [
                item.meaning,
                'Incorrect option 1',
                'Incorrect option 2',
                'Incorrect option 3'
            ].sort(function () { return Math.random() - 0.5; }), // Shuffle options
            correctAnswer: item.meaning
        };
        setCurrentQuestion(newQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };
    var handleAnswer = function (answer) {
        if (!currentQuestion)
            return;
        var correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setSelectedAnswer(answer);
        // Process answer after brief feedback delay
        setTimeout(function () {
            if (currentSession && currentQuestion) {
                processAnswer(currentQuestion.id, answer, correct, Date.now() - timeStarted);
                // Move to next item or complete session
                if (currentSession.items.length > 0) {
                    generateQuestion(currentSession.items[0]);
                }
                else {
                    completeSession();
                }
            }
        }, 1000);
    };
    if (!currentSession || !currentQuestion) {
        return (<div className="p-6 text-center">
        <p>Loading session...</p>
      </div>);
    }
    return (<div className="p-6 max-w-2xl mx-auto">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Session</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4"/>
              {currentSession.items.length + 1} remaining
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4"/>
              {Math.floor((Date.now() - currentSession.startedAt) / 60000)}m
            </span>
          </div>
        </div>
        
        <Button variant="outline" onClick={quitSession} className="flex items-center gap-2">
          End Session
        </Button>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.item.term}</CardTitle>
          {currentQuestion.item.example && (<CardDescription>
              Example: {currentQuestion.item.example}
            </CardDescription>)}
        </CardHeader>
      </Card>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.options.map(function (option, index) { return (<Button key={index} variant={selectedAnswer === option
                ? isCorrect ? 'success' : 'destructive'
                : 'outline'} className={"w-full justify-start text-left h-auto py-3 ".concat(selectedAnswer ? 'pointer-events-none' : '')} onClick={function () { return handleAnswer(option); }}>
            <div className="flex items-center gap-3">
              {selectedAnswer === option ? (isCorrect ? (<Check className="h-5 w-5"/>) : (<X className="h-5 w-5"/>)) : (<span className="text-gray-500">{String.fromCharCode(65 + index)}.</span>)}
              <span>{option}</span>
            </div>
          </Button>); })}
      </div>

      {/* Progress Indicator */}
      {selectedAnswer && (<div className="mt-6 text-center">
          <Button variant="ghost" className="flex items-center gap-2 mx-auto" disabled>
            {isCorrect ? 'Correct! ' : 'Incorrect - '} Next question
            <ArrowRight className="h-4 w-4"/>
          </Button>
        </div>)}
    </div>);
}
//# sourceMappingURL=StudySession.jsx.map