export const PickerFromArray = ({
  array,
  onSubmit,
  hidden,
  nonOption,
}: {
  array: string[];
  onSubmit: (str: string) => void;
  hidden?: boolean;
  nonOption?: string;
}) => {
  return (
    <select hidden={hidden} onChange={(event) => onSubmit(event.target.value)}>
      {nonOption && <option disabled>{nonOption}</option>}
      {array.map((item, idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
