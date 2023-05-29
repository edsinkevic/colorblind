"use client";

import { ParcelDetails, ParcelDetailsForTerminal, Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { detailsGetByTerminalId, getOneByCode, ship } from "colorblind/shared/requests/parcels";
import { notFound } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import styles from "./page.module.css";

interface Props {
    params: {
        id: string;
        courierId: string;
    };
}

export default function TerminalParcels({ params: { id, courierId } }: Props) {
    const [parcels, setParcels] = useState<ParcelDetailsForTerminal[]>([]);
    const [error, setError] = useState<string>();

    const [selectedParcel, setSelectedParcel] = useState<ParcelDetails>();
    const [lockerNumber, setLockerNumber] = useState<number>();

    useEffect(() => {
        const initParcels = async () => {
            const response = await detailsGetByTerminalId(id);
            if (response.status !== StatusCodes.OK) {
                notFound();
            }

            const parcels = await response.json();
            setParcels(parcels);
        }

        initParcels();
    }, [id]);

    const onShip: MouseEventHandler = async (e) => {
        e.preventDefault();
        if (error || !selectedParcel) return;
        const response = await ship(selectedParcel.code, courierId, selectedParcel.version);
        if (response.status !== StatusCodes.OK) {
            const problem = (await response.json()) as Problem;
            setError(problem.detail);
            return;
        }

        const { lockerNumber } = await response.json() as { lockerNumber: number };

        setLockerNumber(lockerNumber);
    };

    const onSelect: MouseEventHandler = async (e) => {
        e.preventDefault();
        const parcelResponse = await getOneByCode(e.currentTarget.id);
        if (parcelResponse.status !== StatusCodes.OK) {
            const problem = (await parcelResponse.json()) as Problem;
            setError(problem.detail);
            return;
        }

        const parcel = (await parcelResponse.json()) as ParcelDetails;

        setSelectedParcel(parcel);
    };

    const onDone: MouseEventHandler = async (e) => {
        e.preventDefault();
        if (!lockerNumber) return;

        const response = await detailsGetByTerminalId(id);
        if (response.status !== StatusCodes.OK) {
            notFound();
        }

        const parcels = await response.json();
        setParcels(parcels);
        setLockerNumber(undefined);
        setSelectedParcel(undefined);
    };

    return (<div className={styles.info}>{
        parcels.length === 0 ?
            <h1>No parcels in terminal</h1>
            : <div>
                <h1>Parcels in terminal</h1>
                {selectedParcel
                    ? <div>
                        <span>Order {selectedParcel.code} selected</span>
                        {lockerNumber
                            ? <div>
                                <span>Locker {lockerNumber} opened.</span>
                                <br />
                                <button  className={styles.bigButton} onClick={onDone}>Parcel retrieved</button>
                            </div>
                            : <><br/><button  className={styles.bigButton} onClick={onShip}>Ship</button></>
                        }
                    </div>
                    : <ul>
                        {parcels.map((parcel) => <li key={parcel.id}>
                            <span>Parcel id: </span>
                            {parcel.id}
                            <br />
                            <span>Delivery address: </span>
                            {parcel.deliveryTerminalAddress}
                            <br />
                            <button className={styles.bigButton} onClick={onSelect} id={parcel.code}>Select</button>
                        </li>)}
                    </ul>
                }
            </div>
    }</div>);
}