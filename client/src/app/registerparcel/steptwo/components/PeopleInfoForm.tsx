import styles from "../page.module.css";
import { ColorblindPhoneInput } from "colorblind/shared/components/PhoneInput";
import {
  PersonInfo,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { useFormik } from "formik";
import { Button, Input, Select } from "antd";

interface Props {
  onSubmit: (data: PeopleInfo) => void;
  defaultValue: PeopleInfo;
  terminals: TerminalDetails[];
}

export interface PeopleInfo {
  senderDeliveryInfo?: PersonInfo;
  receiverDeliveryInfo?: PersonInfo;
}

export const PeopleInfoForm = ({
  defaultValue,
  onSubmit,
  terminals,
}: Props) => {
  const {
    values: form,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik<PeopleInfo>({
    initialValues: defaultValue,
    onSubmit: onSubmit,
  });

  const terminalOptions = terminals.map((terminal) => ({
    value: terminal.id,
    label: terminal.address,
  }));

  const onChangeFrom = (id: string) => {
    setFieldValue("senderDeliveryInfo.terminalId", id);
  };

  const onChangeTo = (id: string) => {
    setFieldValue("receiverDeliveryInfo.terminalId", id);
  };

  const handleSubmitWithValidation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { senderDeliveryInfo, receiverDeliveryInfo } = form;

    if (!senderDeliveryInfo?.terminalId || !receiverDeliveryInfo?.terminalId) {
      alert("Please select terminal");
      return;
    }

    if (senderDeliveryInfo?.terminalId === receiverDeliveryInfo?.terminalId) {
      alert("Pick different source and destination terminals");
      return;
    }
    handleSubmit(e);
  };

  const selectProps = {
    status:
      form.receiverDeliveryInfo?.terminalId ===
        form.senderDeliveryInfo?.terminalId &&
      form.receiverDeliveryInfo?.terminalId
        ? ("error" as "error")
        : undefined,
    showSearch: true,
    options: terminalOptions,
    placeholder: "Please select",
  };

  return (
    <form onSubmit={handleSubmitWithValidation}>
      <div className={styles.sender}>
        <h2>Sender</h2>
        <span>Full name</span>
        <Input
          value={form.senderDeliveryInfo?.fullname}
          name={"senderDeliveryInfo.fullname"}
          placeholder={"Full name"}
          onChange={handleChange}
        />
        <span>Email</span>
        <Input
          value={form?.senderDeliveryInfo?.email}
          name={"senderDeliveryInfo.email"}
          placeholder={"Email"}
          onChange={handleChange}
        />
        <ColorblindPhoneInput
          className={styles.telContainer}
          inputProps={{
            name: "senderDeliveryInfo.phoneNumber",
            value: form?.senderDeliveryInfo?.phoneNumber,
            placeholder: "Phone number",
            onChange: handleChange,
          }}
          country={"lt"}
          onChange={handleChange}
        />
        <span>Terminal</span>
        <Select
          id={"select-from"}
          optionFilterProp={"label"}
          className={styles.terminalSelect}
          {...selectProps}
          onChange={onChangeFrom}
          placeholder={"Select terminal"}
        />
      </div>
      <div className={styles.receiver}>
        <h2>Receiver</h2>
        <span>Full name</span>
        <Input
          value={form.receiverDeliveryInfo?.fullname}
          name={"receiverDeliveryInfo.fullname"}
          placeholder={"Full name"}
          onChange={handleChange}
        />

        <span>Email</span>
        <Input
          value={form.receiverDeliveryInfo?.email}
          name={"receiverDeliveryInfo.email"}
          placeholder={"Email"}
          onChange={handleChange}
        />
        <ColorblindPhoneInput
          className={styles.telContainer}
          inputProps={{
            name: "receiverDeliveryInfo.phoneNumber",
            value: form.receiverDeliveryInfo?.phoneNumber,
            onChange: handleChange,
            placeholder: "Phone number",
          }}
          country={"lt"}
        />
        <span>Terminal</span>
        <Select
          id={"select-to"}
          optionFilterProp={"label"}
          className={styles.terminalSelect}
          {...selectProps}
          onChange={onChangeTo}
          placeholder={"Select terminal"}
        />
      </div>
      <Button
        id={"next-button-2"}
        htmlType={"submit"}
        className={styles.bigButton}
      >
        Next
      </Button>
    </form>
  );
};
