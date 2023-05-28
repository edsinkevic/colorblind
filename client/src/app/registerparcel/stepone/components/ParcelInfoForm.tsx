import styles from "../page.module.css";
import { useState } from "react";
import { DeliveryType } from "colorblind/shared/lib/models/models";
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
          <Select
            defaultValue={sizes[0]}
            options={sizes.map((size) => ({
              label: size,
              value: size,
            }))}
            onChange={(size) =>
              setState({
                ...state,
                size,
              })
            }
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
            <Select
              defaultValue={deliveryTypes[0]}
              options={deliveryTypes.map((size) => ({
                label: size,
                value: size,
              }))}
              onChange={(from) =>
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
            <Select
              defaultValue={deliveryTypes[0]}
              options={deliveryTypes.map((size) => ({
                label: size,
                value: size,
              }))}
              onChange={(to) =>
                setState({
                  ...state,
                  deliveryType: { ...state.deliveryType, to },
                })
              }
            />
          </div>
        </div>
      </div>

      <Button htmlType={"submit"} className={styles.bigButton}>
        Next
      </Button>
    </form>
  );
}
