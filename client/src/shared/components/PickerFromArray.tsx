export const PickerFromArray = ({
  array,
  onSubmit,
}: {
  array: string[];
  onSubmit: (str: string) => void;
}) => {
  return (
    <select onChange={(event) => onSubmit(event.target.value)}>
      {array.map((item, idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
