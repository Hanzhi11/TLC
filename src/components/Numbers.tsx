import { PowerballNumbers } from "../App";
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
                        <b style={{ color: "#9a4edd", zIndex: "0" }}>
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
    const primaryCells = generateCells(35, primary);
    const secondaryCells = generateCells(20, [secondary]);

    return (
        <div>
            <section className="selectionContainer">
                {primary.map((number, index) => {
                    let className = "circle number";
                    if (number !== 0) {
                        className += " " + "primarySelected";
                    } else if (set.size === index + 1) {
                        className += " " + "selected";
                    } else {
                        className += " " + "notSelected";
                    }

                    return (
                        <div key={`selected_${index}`} className={className}>
                            <b>{number !== 0 && number}</b>
                        </div>
                    );
                })}
                <div
                    className={"circle number".concat(
                        secondary === 0 ? "" : " secondarySelected"
                    )}
                >
                    <b>{secondary ? secondary : "PB"}</b>
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
