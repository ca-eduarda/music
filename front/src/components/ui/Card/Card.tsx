import * as React from "react";

import { classNameFunction } from "@/lib/utils";

import { cardStyles } from "./Card.styles";
import type {
  CardBaseProps,
  CardDescriptionProps,
  CardTitleProps
} from "./Card.type";

const Card = React.forwardRef<HTMLDivElement, CardBaseProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={classNameFunction(cardStyles.root, className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardBaseProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNameFunction(cardStyles.header, className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={classNameFunction(cardStyles.title, className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={classNameFunction(cardStyles.description, className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, CardBaseProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNameFunction(cardStyles.content, className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, CardBaseProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNameFunction(cardStyles.footer, className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
