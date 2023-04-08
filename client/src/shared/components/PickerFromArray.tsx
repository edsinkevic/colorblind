export const PickerFromArray = ({
  array,
  onSubmit,
  hidden,
}: {
  array: string[];
  onSubmit: (str: string) => void;
  hidden: boolean;
}) => {
  return (
    <select hidden={hidden} onChange={(event) => onSubmit(event.target.value)}>
      {array.map((item, idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
