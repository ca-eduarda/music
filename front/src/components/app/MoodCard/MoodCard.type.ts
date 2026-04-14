import type { ComponentProps } from "react";

import type { MoodRecommendation } from "@/types/mood";
import type { Step } from "@/types/app";

export interface MoodCardProps {
  step: Step;
  mood: string;
  error: string;
  data: MoodRecommendation | null;
  onMoodChange: (value: string) => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
  onTryAgain: () => void;
}
