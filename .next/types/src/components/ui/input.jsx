import { __rest } from "tslib";
import * as React from 'react';
import { cn } from '@/lib/utils';
var Input = React.forwardRef(function (_a, ref) {
    var className = _a.className, type = _a.type, error = _a.error, startIcon = _a.startIcon, endIcon = _a.endIcon, props = __rest(_a, ["className", "type", "error", "startIcon", "endIcon"]);
    return (<div className="relative w-full">
        {startIcon && (<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>)}
        <input type={type} className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', error && 'border-red-500 focus-visible:ring-red-500', startIcon && 'pl-10', endIcon && 'pr-10', className)} ref={ref} {...props}/>
        {endIcon && (<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endIcon}
          </div>)}
      </div>);
});
Input.displayName = 'Input';
export { Input };
//# sourceMappingURL=input.jsx.map