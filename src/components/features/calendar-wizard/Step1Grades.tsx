import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";
import { GRADES, formatGrade } from "@/lib/utils";

interface Step1Props {
  name: string;
  allowedGrades: number[];
  onNameChange: (name: string) => void;
  onGradesChange: (grades: number[]) => void;
}

export default function Step1Grades({
  name,
  allowedGrades,
  onNameChange,
  onGradesChange,
}: Step1Props) {
  function toggleGrade(grade: number) {
    if (allowedGrades.includes(grade)) {
      onGradesChange(allowedGrades.filter((g) => g !== grade));
    } else {
      onGradesChange([...allowedGrades, grade].sort());
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-medium">שם הלוח</h3>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="לדוגמה, שיעורי מתמטיקה אביב 2026"
        />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">שכבות מורשות</h3>
        <p className="mb-3 text-sm text-muted">
          בחר אילו שכבות יכולות להזמין שיעורים בלוח זה.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {GRADES.map((grade) => (
            <Checkbox
              key={grade}
              label={formatGrade(grade)}
              checked={allowedGrades.includes(grade)}
              onChange={() => toggleGrade(grade)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
