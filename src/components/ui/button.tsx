import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  `
    inline-flex items-center justify-center rounded-3xl text-sm font-medium ring-offset-background transition-colors
    disabled:pointer-events-none disabled:opacity-50
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  `,
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'size-7',
        lg: 'h-11 rounded-md px-8',
        sm: 'h-9 rounded-md px-3',
      },
      variant: {
        danger: 'border border-danger-border bg-danger text-danger-foreground hover:bg-danger-hover hover:text-white',
        default: 'bg-green-700 text-white hover:bg-green-900',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-beige-50 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        roundedIcon: 'rounded-full bg-gradient-to-b from-gray-700 to-black text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-beige-100 text-black hover:bg-beige-300',
        table: 'pl-0 pr-4',
      },
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, isLoading = false, size, variant, ...props }, ref) => {
    const t = useTranslations('common');
    const Comp = asChild ? Slot : 'button';

    return isLoading ? (
      <Button className={cn(buttonVariants({ className, size, variant }))} disabled ref={ref} {...props}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t('loading')}
      </Button>
    ) : (
      <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
