export type SectionHeaderProps = {
  title: string;
  description: string;
};

export const SectionHeader = (props: SectionHeaderProps) => {
  return (
    <div className="box-border caret-transparent text-center mb-12">
      <h3 className="text-gray-900 text-3xl font-bold box-border caret-transparent leading-9 mb-4">
        {props.title}
      </h3>
      <p className="text-gray-600 text-lg box-border caret-transparent leading-7 max-w-2xl mx-auto">
        {props.description}
      </p>
    </div>
  );
};
