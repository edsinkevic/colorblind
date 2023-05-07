import { TerminalDetails } from "../lib/models/models";

export const TerminalPicker = ({
    terminals,
    onSubmit,
    hidden,
    nonOption,
}: {
    terminals: TerminalDetails[];
    onSubmit: (str: string) => void;
    hidden?: boolean;
    nonOption?: string;
}) => {
    return (
        <select hidden={hidden} onChange={(event) => onSubmit(event.target.value)}>
            {nonOption && <option disabled>{nonOption}</option>}
            {terminals.map((terminal, idx) => (
                <option key={idx} value={terminal.id}>
                    {terminal.address}
                </option>
            ))}
        </select>
    );
};
