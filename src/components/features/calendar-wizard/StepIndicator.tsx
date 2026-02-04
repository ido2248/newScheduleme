interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : isCompleted
                      ? "bg-primary-light text-primary border-2 border-primary"
                      : "bg-gray-100 text-muted"
                }`}
              >
                {isCompleted ? "✓" : step}
              </div>
              <span
                className={`mt-1 text-xs ${
                  isActive ? "font-medium text-foreground" : "text-muted"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`mb-4 h-0.5 w-8 ${
                  isCompleted ? "bg-primary/40" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
