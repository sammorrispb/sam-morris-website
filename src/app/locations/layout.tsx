import { MobileCTA } from "@/components/MobileCTA";

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MobileCTA />
    </>
  );
}
