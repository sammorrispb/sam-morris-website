import { ProgramsNav } from "@/components/ProgramsNav";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProgramsNav />
      {children}
    </>
  );
}
