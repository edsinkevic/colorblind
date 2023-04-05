import styles from "colorblind/app/components/ParcelInfo.module.css";

export const PickerFromArray = ({
  array,
  onSubmit,
}: {
  array: string[];
  onSubmit: (str: string) => void;
}) => {
  return (
    <select
      className={styles.slide}
      onChange={(event) => onSubmit(event.target.value)}
    >
      {array.map((item, idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
