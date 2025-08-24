import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98] transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:from-blue-600/95 hover:to-indigo-600/95 active:shadow-md active:shadow-blue-500/10 focus-visible:ring-blue-500/50",
        destructive:
          "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md hover:shadow-lg hover:shadow-rose-500/20 hover:from-rose-600/95 hover:to-red-600/95 focus-visible:ring-rose-500/50",
        outline:
          "border border-input bg-background/0 backdrop-blur-sm shadow-sm hover:bg-accent/50 hover:text-accent-foreground focus-visible:ring-ring/50 dark:bg-background/40 dark:hover:bg-accent/50 dark:border-border/50",
        secondary:
          "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md hover:shadow-lg hover:shadow-slate-500/20 hover:from-slate-600/95 hover:to-slate-700/95 focus-visible:ring-slate-500/50",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground focus-visible:ring-ring/50 dark:hover:bg-accent/30",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90 focus-visible:ring-ring/50",
      },
      size: {
        default: "h-10 px-5 py-2.5 rounded-lg has-[>svg]:px-3 text-base",
        sm: "h-9 rounded-lg gap-2 px-4 has-[>svg]:px-2.5 text-sm",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-4 text-lg",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
