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
    <div className="mb-6 sm:mb-8 flex items-center justify-center gap-1 sm:gap-2 px-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold ${
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
                className={`mt-1 text-[10px] sm:text-xs text-center max-w-15 sm:max-w-none ${
                  isActive ? "font-medium text-foreground" : "text-muted"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`mb-4 h-0.5 w-4 sm:w-8 ${
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
