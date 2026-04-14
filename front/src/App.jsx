import { AppHeader } from "@/components/app/AppHeader";
import { MoodCard } from "@/components/app/MoodCard";
import { fetchMoodRecommendation } from "@/services/moodApi";
import { useState } from "react";

export default function App() {
  const [mood, setMood] = useState("");
  const [step, setStep] = useState("input");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedMood = mood.trim();

    if (!trimmedMood) {
      setError("Please describe your mood before submitting.");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const payload = await fetchMoodRecommendation(trimmedMood);
      setData(payload);
      setStep("result");
    } catch (submissionError) {
      setError(submissionError.message || "Something went wrong.");
      setStep("input");
    }
  }

  function handleTryAgain() {
    setMood("");
    setStep("input");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-7">
          <AppHeader />
          <MoodCard
            step={step}
            mood={mood}
            error={error}
            data={data}
            onMoodChange={setMood}
            onSubmit={handleSubmit}
            onTryAgain={handleTryAgain}
          />
        </div>
      </div>
    </main>
  );
}
