"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { FormWithStatus } from "../components/FormWithStatus";
import { Button, Radio, Image } from "antd";
import { useEffect, useState } from "react";
import { register } from "colorblind/shared/requests/parcels";
import { ParcelRegistration, ParcelRegistrationResponse, Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { getFromStore } from "colorblind/shared/lib/state";

export default function StepThree() {
    const [paymentMethod, setPaymentMethod] = useState<number>(1);
    const [registration, setRegistration] = useState<ParcelRegistration>();
    const [problem, setProblem] = useState<Problem>();
    const router = useRouter();

    useEffect(() => {
        const reg = getFromStore<ParcelRegistration>("registration");
        if (!reg) {
            router.replace("/registerparcel/stepone");
            return;
        }

        setRegistration(reg);
    }, [router]);

    const onSubmit = async () => {
        if (!registration) {
            return;
        }
        const resp = await register(registration);
        const { status } = resp;

        if (status !== StatusCodes.OK) {
            const body = (await resp.json()) as Problem;
            setProblem(body);
            return;
        }

        const body = (await resp.json()) as ParcelRegistrationResponse;
        router.replace(`/track/${body.id}`);
    };

    return (
        <FormWithStatus current={3}>
            <div className={styles.form}>
                <h2>Payment</h2>
                <div className={styles.left}>
                    <span>Payment methods</span>
                </div>
                <div className={styles.left}>
                    <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <Radio value={1}>
                            <Image preview={false} alt="Visa" width={100} src="/visa.png" />
                        </Radio>
                        <Radio value={2}>
                            <Image preview={false} alt="Swedbank" width={100} src="/swedbank.png" />
                        </Radio>
                        <Radio value={3}>
                            <Image preview={false} alt="Paysera" width={100} src="/paysera.png" />
                        </Radio>
                    </Radio.Group>
                </div>
                <Button
                    id={"next-button-2"}
                    htmlType={"submit"}
                    className={styles.bigButton}
                    onClick={onSubmit}
                >
                    Pay
                </Button>
            </div>
        </FormWithStatus>
    );
}
