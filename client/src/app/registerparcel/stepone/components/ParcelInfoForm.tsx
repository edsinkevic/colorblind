// import styles from "./ParcelInfoForm.module.css";
import styles from "../page.module.css";
import { useState } from "react";
import { DeliveryType } from "../../../../shared/lib/models/models";
import { PickerFromArray } from "colorblind/shared/components/PickerFromArray";
import { Button, Select } from "antd";

interface ParcelInfo {
  deliveryType: DeliveryType;
  size: string;
}

interface Props {
  defaultValue: ParcelInfo;
  onSubmit: (data: ParcelInfo) => void;
}

const sizes = ["S", "M", "L", "XL", "XXL"];
const deliveryTypes = ["Terminal", "Address"];

const sizeOptions = sizes.map((size) => ({
  value: size,
  label: size,
}));
const deliveryTypeOptions = deliveryTypes.map((deliveryType) => ({
  value: deliveryType,
  label: deliveryType,
}));

export function ParcelInfoForm({ defaultValue, onSubmit }: Props) {
  const [state, setState] = useState<ParcelInfo>(defaultValue);
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(state);
      }}
    >
      <h2>Package information</h2>
      <div>
        <div className={styles.leftSide}>
          <p>Size</p>
        </div>
        <div className={styles.rightSide}>
          <PickerFromArray
            array={sizes}
            onSubmit={(size) => setState({ ...state, size })}
          />
        </div>
      </div>
      <h2>Delivery type</h2>
      <div className={styles.from_to_container}>
        <div>
          <div className={styles.leftSide}>
            <p>From</p>
          </div>
          <div className={styles.rightSide}>
            <PickerFromArray
              array={deliveryTypes}
              onSubmit={(from) =>
                setState({
                  ...state,
                  deliveryType: { ...state.deliveryType, from },
                })
              }
            />
          </div>
        </div>
        <div>
          <div className={styles.leftSide}>
            <p>To</p>
          </div>
          <div className={styles.rightSide}>
            <PickerFromArray
              array={deliveryTypes}
              onSubmit={(to) =>
                setState({
                  ...state,
                  deliveryType: { ...state.deliveryType, to },
                })
              }
            />
          </div>
        </div>
      </div>

      <button type={"submit"} className={styles.bigButton}>Next</button>
    </form>
  );
}
