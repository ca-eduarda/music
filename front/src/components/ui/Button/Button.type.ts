import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "./Button.styles";

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ComponentProps<"button"> &
  ButtonVariantProps & {
    asChild?: boolean;
  };
