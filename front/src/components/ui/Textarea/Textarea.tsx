import * as React from "react";

import { classNameFunction } from "@/lib/utils";

import { textareaStyles } from "./Textarea.styles";
import type { TextareaProps } from "./Textarea.type";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return <textarea className={classNameFunction(textareaStyles, className)} ref={ref} {...props} />;
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
