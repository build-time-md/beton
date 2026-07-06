import LocaleChrome from "@/components/LocaleChrome";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function RoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocaleChrome lang="ro" />
      {children}
      <WhatsAppFloat lang="ro" />
    </>
  );
}
