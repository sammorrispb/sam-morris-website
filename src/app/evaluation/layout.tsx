import { ProgramsNav } from "@/components/ProgramsNav";
import { MobileCTA } from "@/components/MobileCTA";

export default function EvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProgramsNav />
      {children}
      <MobileCTA />
    </>
  );
}
