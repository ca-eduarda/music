import type * as React from "react";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "./Badge.styles";

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

export type BadgeProps = React.ComponentProps<"div"> & BadgeVariantProps;
