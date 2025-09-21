import { useQuery } from "@tanstack/react-query";
import { DBService } from "@/services/db-service";
import { QuizCard } from "./QuizCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export function StudySession() {
    var navigate = useNavigate();
    var _a = useState(0), currentIndex = _a[0], setCurrentIndex = _a[1];
    var _b = useState({
        correct: 0,
        total: 0
    }), sessionStats = _b[0], setSessionStats = _b[1];
    var _c = useQuery({
        queryKey: ['dueItems'],
        queryFn: function () { return DBService.getDueItems(10); }
    }).data, items = _c === void 0 ? [] : _c;
    var handleAnswer = function (isCorrect) {
        var _a;
        setSessionStats(function (prev) { return ({
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            total: prev.total + 1
        }); });
        // Update item in database
        var currentItem = items[currentIndex];
        if (currentItem) {
            DBService.updateVocabItem(currentItem.id, (_a = {
                    lastReviewedAt: Date.now()
                },
                _a[isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed'] = (currentItem[isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed'] || 0) + 1,
                _a));
        }
        // Move to next or end session
        if (currentIndex < items.length - 1) {
            setCurrentIndex(function (prev) { return prev + 1; });
        }
        else {
            // Save session results
            DBService.saveStudySession({
                startedAt: Date.now(),
                duration: 0, // Calculate actual duration
                correct: sessionStats.correct + (isCorrect ? 1 : 0),
                total: sessionStats.total + 1,
                items: items.map(function (item) { return item.id; })
            });
            navigate('/review', { state: { stats: sessionStats } });
        }
    };
    if (items.length === 0) {
        return (<div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No items to review!</h2>
        <p className="text-muted-foreground mb-4">
          Come back later or add more vocabulary items.
        </p>
        <Button onClick={function () { return navigate('/vocabulary'); }}>
          View Vocabulary
        </Button>
      </div>);
    }
    var currentItem = items[currentIndex];
    var progress = ((currentIndex) / items.length) * 100;
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {items.length}
        </span>
        <div className="w-1/2">
          <Progress value={progress} className="h-2"/>
        </div>
        <span className="text-sm font-medium">
          {sessionStats.correct} / {sessionStats.total} correct
        </span>
      </div>

      {currentItem && (<QuizCard term={currentItem.term} definition={currentItem.definition} onAnswer={handleAnswer}/>)}
    </div>);
}
//# sourceMappingURL=StudySession.jsx.map