"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import StepIndicator from "./StepIndicator";
import Step1Grades from "./Step1Grades";
import Step2Days from "./Step2Days";
import Step3Hours from "./Step3Hours";
import Step4Review from "./Step4Review";

interface WizardState {
  name: string;
  allowedGrades: number[];
  selectedDays: number[];
  hoursByDay: Record<number, number[]>;
  maxStudentsPerSlot: number;
}

const STEP_LABELS = ["שכבות", "ימים", "שעות", "סיכום"];

export default function CalendarWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [state, setState] = useState<WizardState>({
    name: "",
    allowedGrades: [],
    selectedDays: [],
    hoursByDay: {},
    maxStudentsPerSlot: 1,
  });

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return state.name.trim().length > 0 && state.allowedGrades.length > 0;
      case 2:
        return state.selectedDays.length > 0;
      case 3:
        return state.selectedDays.every(
          (day) => (state.hoursByDay[day] || []).length > 0
        ) && state.maxStudentsPerSlot >= 1;
      case 4:
        return true;
      default:
        return false;
    }
  }

  function handleNext() {
    if (step < 4) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const availabilitySlots = Object.entries(state.hoursByDay).flatMap(
      ([day, hours]) =>
        hours.map((hour) => ({
          dayOfWeek: Number(day),
          periodNumber: hour,
        }))
    );

    try {
      const res = await fetch("/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          allowedGrades: state.allowedGrades,
          maxStudentsPerSlot: state.maxStudentsPerSlot,
          availabilitySlots,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "יצירת הלוח נכשלה.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("משהו השתבש. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StepIndicator
        currentStep={step}
        totalSteps={4}
        labels={STEP_LABELS}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {step === 1 && (
        <Step1Grades
          name={state.name}
          allowedGrades={state.allowedGrades}
          onNameChange={(name) => setState({ ...state, name })}
          onGradesChange={(allowedGrades) =>
            setState({ ...state, allowedGrades })
          }
        />
      )}

      {step === 2 && (
        <Step2Days
          selectedDays={state.selectedDays}
          onDaysChange={(selectedDays) => {
            const hoursByDay = { ...state.hoursByDay };
            // Remove hours for unselected days
            Object.keys(hoursByDay).forEach((key) => {
              if (!selectedDays.includes(Number(key))) {
                delete hoursByDay[Number(key)];
              }
            });
            setState({ ...state, selectedDays, hoursByDay });
          }}
        />
      )}

      {step === 3 && (
        <Step3Hours
          selectedDays={state.selectedDays}
          hoursByDay={state.hoursByDay}
          maxStudentsPerSlot={state.maxStudentsPerSlot}
          onHoursChange={(hoursByDay) => setState({ ...state, hoursByDay })}
          onMaxStudentsChange={(maxStudentsPerSlot) =>
            setState({ ...state, maxStudentsPerSlot })
          }
        />
      )}

      {step === 4 && (
        <Step4Review
          name={state.name}
          allowedGrades={state.allowedGrades}
          selectedDays={state.selectedDays}
          hoursByDay={state.hoursByDay}
          maxStudentsPerSlot={state.maxStudentsPerSlot}
        />
      )}

      <div className="mt-8 flex justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={step === 1}
        >
          הקודם
        </Button>

        {step < 4 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            הבא
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading || !canProceed()}>
            {loading ? "יוצר..." : "צור לוח"}
          </Button>
        )}
      </div>
    </div>
  );
}
