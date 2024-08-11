import { PRIMARY_MAX, PowerballNumbers, SECONDARY_MAX } from "../App";
import cross from "./../assets/cross.svg";

interface Props {
    numbers: PowerballNumbers;
}

function generateCells(
    totalNumber: number,
    selectedNumbers: number[]
): JSX.Element {
    return (
        <section className="grid">
            {new Array(totalNumber).fill(null).map((_element, index) => {
                let className = "cell";
                if (selectedNumbers.includes(index + 1)) {
                    className += " " + "cellSelected";
                }
                return (
                    <div key={index} className={className}>
                        <div
                            hidden={!selectedNumbers.includes(index + 1)}
                            className="crossContainer"
                        >
                            <img src={cross} alt="Cross Icon" />
                        </div>
                        <b className="cellNumber">
                            {index + 1}
                        </b>
                    </div>
                );
            })}
        </section>
    );
}

export default function Numbers(props: Props): JSX.Element {
    const { primary, secondary } = props.numbers;
    const set = new Set(primary);
    const primaryCells = generateCells(PRIMARY_MAX, primary);
    const secondaryCells = generateCells(SECONDARY_MAX, [secondary]);

    return (
        <div>
            <section className="selectionContainer">
                {primary.map((number, index) => {
                    let className = "circle number";
                    if (number) {
                        className += " " + "primarySelected";
                    } else if (set.size === index + 1) {
                        className += " " + "selected";
                    }

                    return (
                        <div key={`selected_${index}`} className={className}>
                            {number ? <b>{number}</b> : null}
                        </div>
                    );
                })}
                <div
                    className={"circle number".concat(
                        secondary ? " secondarySelected" : ""
                    )}
                >
                    <b className={secondary ? "" : "black"}>{secondary ? secondary : "PB"}</b>
                </div>
            </section>
            {primaryCells}
            <p className="runner">
                <b>SELECT YOUR POWERBALL</b>
            </p>
            {secondaryCells}
        </div>
    );
}
