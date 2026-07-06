import LocaleChrome from "@/components/LocaleChrome";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocaleChrome lang="en" />
      {children}
      <WhatsAppFloat lang="en" />
    </>
  );
}
