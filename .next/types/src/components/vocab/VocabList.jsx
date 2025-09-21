import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DBService } from "@/services/db-service";
import { PlusCircle } from "lucide-react";
export function VocabList() {
    var _a = useQuery({
        queryKey: ['vocabItems'],
        queryFn: function () { return DBService.getVocabItems(); }
    }), _b = _a.data, items = _b === void 0 ? [] : _b, isLoading = _a.isLoading;
    if (isLoading)
        return <div>Loading...</div>;
    return (<Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vocabulary Items</CardTitle>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4"/>
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map(function (item) { return (<div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
              <div>
                <h4 className="font-medium">{item.term}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.definition}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Study</Button>
              </div>
            </div>); })}
        </div>
      </CardContent>
    </Card>);
}
//# sourceMappingURL=VocabList.jsx.map