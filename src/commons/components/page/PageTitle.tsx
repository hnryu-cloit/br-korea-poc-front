interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const PageTitle = ({ title, description, children }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {children}
      </div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
};
