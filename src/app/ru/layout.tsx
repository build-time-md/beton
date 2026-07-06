import LocaleChrome from "@/components/LocaleChrome";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocaleChrome lang="ru" />
      {children}
      <WhatsAppFloat lang="ru" />
    </>
  );
}
