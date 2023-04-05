import { FormInput } from "colorblind/app/components/FormInput";
import { ColorblindPhoneInput } from "colorblind/app/components/PhoneInput";
import { PeopleInfo } from "colorblind/app/page";
import { useFormik } from "formik";

interface Props {
  onSubmit: (data: PeopleInfo) => void;
  defaultValue: PeopleInfo;
}

export const PeopleInfoForm = ({ defaultValue, onSubmit }: Props) => {
  const {
    values: form,
    handleChange,
    handleSubmit,
  } = useFormik<PeopleInfo>({
    initialValues: defaultValue,
    onSubmit: onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sender</h1>
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
      <h1>Receiver</h1>
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
        key={5}
        inputProps={{
          name: "receiverDeliveryInfo.phoneNumber",
          value: form.receiverDeliveryInfo?.phoneNumber,
          onChange: handleChange,
          placeholder: "Phone number",
        }}
        country={"lt"}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
