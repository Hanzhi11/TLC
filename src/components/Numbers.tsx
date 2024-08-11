import { PRIMARY_MAX, PowerballNumbers, SECONDARY_MAX } from "../App";
import cross from "./../assets/cross.svg";

interface Props {
    numbers: PowerballNumbers;
}

function generateCells(
    totalNumber: number,
    selectedNumbers: number[]
): JSX.Element {
    const role = totalNumber === PRIMARY_MAX ? "primary" : "secondary";

    return (
        <section className="grid" role={role}>
            {new Array(totalNumber).fill(null).map((_element, index) => {
                let className = "cell";
                if (selectedNumbers.includes(index + 1)) {
                    className += " " + "cellSelected";
                }
                return (
                    <div key={index} className={className} role="gridcell">
                        <div
                            hidden={!selectedNumbers.includes(index + 1)}
                            className="crossContainer"
                        >
                            <img src={cross} alt="Cross Icon" role="image" />
                        </div>
                        <b className="cellNumber">{index + 1}</b>
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
        <main role="main">
            <section className="selectionContainer" role="group">
                {primary.map((number, index) => {
                    let className = "circle number";
                    if (number) {
                        className += " " + "primarySelected";
                    } else if (set.size === index + 1) {
                        className += " " + "selected";
                    }

                    return (
                        <div
                            key={`selected_${index}`}
                            className={className}
                            role="cell"
                        >
                            {number ? <b>{number}</b> : null}
                        </div>
                    );
                })}
                <div
                    className={"circle number".concat(
                        secondary ? " secondarySelected" : ""
                    )}
                >
                    <b className={secondary ? "" : "black"} role="cell">
                        {secondary ? secondary : "PB"}
                    </b>
                </div>
            </section>
            {primaryCells}
            <p className="banner" role="banner">
                <b>SELECT YOUR POWERBALL</b>
            </p>
            {secondaryCells}
        </main>
    );
}
