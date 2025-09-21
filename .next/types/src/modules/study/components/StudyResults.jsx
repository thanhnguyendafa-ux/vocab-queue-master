import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react';
export function StudyResults(_a) {
    var session = _a.session, onClose = _a.onClose, onStartNew = _a.onStartNew;
    var accuracy = session.totalQuestions > 0
        ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
        : 0;
    var timeSpentMinutes = Math.floor((Date.now() - session.startedAt) / 60000);
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Session Results</CardTitle>
              <CardDescription>
                Summary of your study session
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600"/>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correct</p>
                <p className="font-medium">{session.correctAnswers}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-5 w-5 text-red-600"/>
              </div>
              <div>
                <p className="text-sm text-gray-500">Incorrect</p>
                <p className="font-medium">
                  {session.totalQuestions - session.correctAnswers}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600"/>
              </div>
              <div>
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="font-medium">{accuracy}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-600"/>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Spent</p>
                <p className="font-medium">{timeSpentMinutes} min</p>
              </div>
            </div>
          </div>
          
          {/* Mastery Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Mastery Progress</p>
              <p className="text-sm text-gray-500">
                {session.correctAnswers} of {session.totalQuestions} mastered
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "".concat(accuracy, "%") }}></div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onStartNew} className="flex-1">
              Start New Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
}
//# sourceMappingURL=StudyResults.jsx.map