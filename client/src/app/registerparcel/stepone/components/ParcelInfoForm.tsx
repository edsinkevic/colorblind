import styles from "../page.module.css";
import { useState } from "react";
import { DeliveryType } from "colorblind/shared/lib/models/models";
import { Button, Radio } from "antd";

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
          <Radio.Group value={state.size}
            onChange={(e) =>
              setState({
                ...state,
                size: e.target.value,
              })
            }>
            {sizes.map((size) => (
              <Radio.Button key={size} value={size}>{size}</Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </div>
      <h2>Delivery type</h2>
      <div className={styles.from_to_container}>
        <div>
          <div className={styles.leftSide}>
            <p>From</p>
          </div>
          <div className={styles.rightSide}>
            <Radio.Button onClick={() =>
              setState({
                ...state,
                deliveryType: { ...state.deliveryType, from: state.deliveryType.from === "terminal" ? "address" : "terminal" },
              })
            } value={state.deliveryType.from}>{state.deliveryType.from}</Radio.Button>
          </div>
          <div className={styles.leftSide} style={{ paddingLeft: "10px" }}>
            <p>To</p>
          </div>
          <Radio.Button onClick={() =>
            setState({
              ...state,
              deliveryType: { ...state.deliveryType, to: state.deliveryType.to === "terminal" ? "address" : "terminal" },
            })
          } value={state.deliveryType.to}>{state.deliveryType.to}</Radio.Button>

        </div>
      </div>

      <Button
        id={"next-button-1"}
        htmlType={"submit"}
        className={styles.bigButton}
      >
        Next
      </Button>
    </form >
  );
}
