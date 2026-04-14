import { classNameFunction } from "@/lib/utils";

import { badgeVariants } from "./Badge.styles";
import type { BadgeProps } from "./Badge.type";

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={classNameFunction(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
export type { BadgeProps };
