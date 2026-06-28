export default function SectionHead({ title }: { title: string }) {
  return (
    <div className="sect-head">
      <h2 className="sect-head__title">{title}</h2>
    </div>
  );
}
