import styles from "../page.module.css"

import { FormInput } from "colorblind/shared/components/FormInput";
import { ColorblindPhoneInput } from "colorblind/shared/components/PhoneInput";
import { TerminalPicker } from "colorblind/shared/components/TerminalPicker";
import { PersonInfo, TerminalDetails } from "colorblind/shared/lib/models/models";
import { useFormik } from "formik";

interface Props {
  onSubmit: (data: PeopleInfo) => void;
  defaultValue: PeopleInfo;
  terminals: TerminalDetails[];
}

export interface PeopleInfo {
  senderDeliveryInfo?: PersonInfo;
  receiverDeliveryInfo?: PersonInfo;
}

export const PeopleInfoForm = ({ defaultValue, onSubmit, terminals }: Props) => {
  const {
    values: form,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik<PeopleInfo>({
    initialValues: defaultValue,
    onSubmit: onSubmit,
  });

  const handleSubmitWithValidation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.senderDeliveryInfo?.terminalId) {
      alert("Please select terminal")
      return;
    }
    if (!form.receiverDeliveryInfo?.terminalId) {
      alert("Please select terminal");
      return;
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmitWithValidation}>
      <div className={styles.sender}>
        <h2>Sender</h2>
        <FormInput
          key={0}
          value={form.senderDeliveryInfo?.fullname}
          name={"senderDeliveryInfo.fullname"}
          placeholder={"Full name"}
          onChange={handleChange}
        />
        <FormInput
          key={1}
          value={form?.senderDeliveryInfo?.email}
          name={"senderDeliveryInfo.email"}
          placeholder={"Email"}
          onChange={handleChange}
        />
        <ColorblindPhoneInput
          className={styles.telContainer}
          key={2}
          inputProps={{
            name: "senderDeliveryInfo.phoneNumber",
            value: form?.senderDeliveryInfo?.phoneNumber,
            placeholder: "Phone number",
            onChange: handleChange,
          }}
          country={"lt"}
          onChange={handleChange}
        />
        <label>Terminal</label>
        <TerminalPicker
          nonOption="Select terminal"
          terminals={terminals}
          onSubmit={(id) => {
            setFieldValue("senderDeliveryInfo.terminalId", id);
          }} />
      </div>
      <div className={styles.receiver}>
        <h2>Receiver</h2>
        <FormInput
          key={3}
          value={form.receiverDeliveryInfo?.fullname}
          name={"receiverDeliveryInfo.fullname"}
          placeholder={"Full name"}
          onChange={handleChange}
        />
        <FormInput
          key={4}
          value={form.receiverDeliveryInfo?.email}
          name={"receiverDeliveryInfo.email"}
          placeholder={"Email"}
          onChange={handleChange}
        />
        <ColorblindPhoneInput
          className={styles.telContainer}
          key={5}
          inputProps={{
            name: "receiverDeliveryInfo.phoneNumber",
            value: form.receiverDeliveryInfo?.phoneNumber,
            onChange: handleChange,
            placeholder: "Phone number",
          }}
          country={"lt"}
        />
        <label>Terminal</label>
        <TerminalPicker
          nonOption="Select terminal"
          terminals={terminals}
          onSubmit={(id) => {
            setFieldValue("receiverDeliveryInfo.terminalId", id);
          }} />
      </div>
      <button type="submit">Next</button>
    </form>
  );
};
