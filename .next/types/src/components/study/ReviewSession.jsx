import { __assign } from "tslib";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, RotateCw, Home, TrendingUp, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
export function ReviewSession() {
    var location = useLocation();
    var navigate = useNavigate();
    var _a = useState({ correct: 0, total: 0, accuracy: 0 }), stats = _a[0], setStats = _a[1];
    var _b = useState(true), isLoading = _b[0], setIsLoading = _b[1];
    // Calculate session statistics
    useEffect(function () {
        var _a, _b;
        var sessionStats = ((_a = location.state) === null || _a === void 0 ? void 0 : _a.stats) || { correct: 0, total: 0 };
        var accuracy = sessionStats.total > 0
            ? Math.round((sessionStats.correct / sessionStats.total) * 100)
            : 0;
        setStats(__assign(__assign({}, sessionStats), { accuracy: accuracy, timeSpent: ((_b = location.state) === null || _b === void 0 ? void 0 : _b.timeSpent) || 0 }));
        setIsLoading(false);
    }, [location.state]);
    var handleRestart = function () {
        navigate('/study', { replace: true });
    };
    var handleHome = function () {
        navigate('/');
    };
    if (isLoading) {
        return <div className="flex justify-center p-8">Loading session results...</div>;
    }
    return (<div className="container max-w-3xl mx-auto py-8 px-4">
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
            <StatCard title="Correct" value={stats.correct} total={stats.total} icon={<CheckCircle2 className="h-6 w-6 text-green-500"/>} color="green"/>
            
            <StatCard title="Incorrect" value={stats.total - stats.correct} total={stats.total} icon={<XCircle className="h-6 w-6 text-red-500"/>} color="red"/>
            
            <StatCard title="Time Spent" value={stats.timeSpent ? Math.floor(stats.timeSpent / 60) : 0} total={stats.timeSpent ? Math.ceil(stats.timeSpent / 60) + 1 : 1} icon={<Clock className="h-6 w-6 text-blue-500"/>} unit="min"/>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mastery Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats.correct} of {stats.total} mastered
                </span>
              </div>
              <Progress value={(stats.correct / stats.total) * 100} className="h-2"/>
            </div>

            <Separator className="my-4"/>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4"/>
              <span>
                {stats.accuracy > 70
            ? "Great job! You're making excellent progress."
            : stats.accuracy > 40
                ? "Keep practicing! You'll improve with more sessions."
                : "Review challenging items and try again!"}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleHome}>
            <Home className="mr-2 h-4 w-4"/>
            Back to Home
          </Button>
          
          <Button className="w-full sm:w-auto" onClick={handleRestart}>
            <RotateCw className="mr-2 h-4 w-4"/>
            Study Again
          </Button>
        </CardFooter>
      </Card>
    </div>);
}
function StatCard(_a) {
    var title = _a.title, value = _a.value, total = _a.total, icon = _a.icon, _b = _a.unit, unit = _b === void 0 ? '' : _b;
    var percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return (<div className="flex flex-col items-center p-4 border rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
        {icon}
      </div>
      <div className="text-sm font-medium text-center">{title}</div>
      <div className="text-2xl font-bold">
        {value}{unit && " ".concat(unit)}
      </div>
      <div className="text-xs text-muted-foreground">
        {percentage}% of session
      </div>
    </div>);
}
//# sourceMappingURL=ReviewSession.jsx.map