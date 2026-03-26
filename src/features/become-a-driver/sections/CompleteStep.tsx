import { HiCheckCircle } from "react-icons/hi";
import Button from "@/src/components/ui/Button";

interface CompleteStepProps {
  onGoToDashboard: () => void;
}

export function CompleteStep({ onGoToDashboard }: CompleteStepProps) {
  return (
    <div className="premium-card p-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
        <HiCheckCircle />
      </div>
      <h2 className="text-3xl font-black text-dark-text mb-4">
        You're all set!
      </h2>
      <p className="text-gray-500 font-medium mb-8">
        We've received your application and vehicle details. Our team will
        review them shortly. You can track your status on the dashboard.
      </p>
      <Button size="lg" onClick={onGoToDashboard}>
        Go to Dashboard
      </Button>
    </div>
  );
}
