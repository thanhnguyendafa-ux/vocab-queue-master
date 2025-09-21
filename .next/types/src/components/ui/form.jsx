import { __rest } from "tslib";
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
var formVariants = cva('space-y-4', {
    variants: {
        variant: {
            default: 'w-full',
            inline: 'flex flex-col space-y-4',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
var Form = React.forwardRef(function (_a, ref) {
    var className = _a.className, variant = _a.variant, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "variant", "asChild"]);
    var Comp = asChild ? Slot : 'form';
    return (<Comp className={cn(formVariants({ variant: variant, className: className }))} ref={ref} {...props}/>);
});
Form.displayName = 'Form';
var FormGroup = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={cn('space-y-2', className)} {...props}/>);
});
FormGroup.displayName = 'FormGroup';
export { Form, FormGroup };
//# sourceMappingURL=form.jsx.map