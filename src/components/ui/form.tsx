import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const formVariants = cva(
  'space-y-4',
  {
    variants: {
      variant: {
        default: 'w-full',
        inline: 'flex flex-col space-y-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  asChild?: boolean;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'form';
    return (
      <Comp
        className={cn(formVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Form.displayName = 'Form';

const FormGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
));
FormGroup.displayName = 'FormGroup';

export { Form, FormGroup };
