import styles from "./ParcelInfoForm.module.css";
import { useState } from "react";
import { DeliveryType } from "../../../../shared/lib/models/models";
import { PickerFromArray } from "colorblind/shared/components/PickerFromArray";

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

export function ParcelInfoForm({ defaultValue, onSubmit }: Props) {
  const [state, setState] = useState<ParcelInfo>(defaultValue);
  return (
    <form className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(state);
      }}
    >
      <label>Package information</label>
      <div>
        <span>Size</span>
        <PickerFromArray
          array={sizes}
          onSubmit={(size) => setState({ ...state, size })}
        />
      </div>
      <label>Delivery type</label>
      <div className={styles.from_to_container}>
        <div>
          <span>From</span>
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
        <div>
          <span>To</span>
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
      
      <button type={"submit"}>Next</button>
    </form>
  );
}
