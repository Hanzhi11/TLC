import bin from "./assets/bin.svg";
import lightning from "./assets/lightning.svg";
import "./App.css";
import Numbers from "./components/Numbers";
import { useState } from "react";

export interface PowerballNumbers {
    primary: number[];
    secondary: number;
}

export const PRIMARY_TOTAL: number = 7;
const NUMBER_MIN: number = 1;
export const PRIMARY_MAX: number = 35;
export const SECONDARY_MAX: number = 20;
const initialSelectedNumbers: number[] = new Array(PRIMARY_TOTAL).fill(0);
const INDEX: number = 1;

const payload = {
    CompanyId: "GoldenCasket",
    MaxDrawCountPerProduct: 1,
    OptionalProductFilter: ["Powerball"],
};

const initialNumbers = {
    primary: initialSelectedNumbers,
    secondary: 0,
};

function isValidInteger(number: number, min: number, max: number): boolean {
    return Number.isInteger(number) && number >= min && number <= max;
}

function isValidPrimaryNumbers(primary: number[]): boolean {
    if (new Set(primary).size !== PRIMARY_TOTAL) {
        return false;
    }

    return primary.every((num) => isValidInteger(num, NUMBER_MIN, PRIMARY_MAX));
}

function App(): JSX.Element {
    const [numbers, setNumbers] = useState<PowerballNumbers>(initialNumbers);

    const retriveNumbers = (): void => {
        const currentPrimaryNumbers = new Set(numbers.primary);
        if (currentPrimaryNumbers.size === PRIMARY_TOTAL) {
            return;
        }
        fetch(
            "https://data.api.thelott.com/sales/vmax/web/data/lotto/latestresults",
            {
                method: "Post",
                body: JSON.stringify(payload),
            }
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Data fetch failed! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                const result = data.DrawResults[0];
                if (data.Success && result?.ProductId === "Powerball") {
                    const primaryNumbers = result.PrimaryNumbers;
                    const secondaryNumbers = result.SecondaryNumbers[0];
                    if (
                        !isValidPrimaryNumbers(primaryNumbers) ||
                        !isValidInteger(
                            secondaryNumbers,
                            NUMBER_MIN,
                            SECONDARY_MAX
                        )
                    ) {
                        throw new Error(
                            "Numbers are not available right now! Please try again later!"
                        );
                    }
                    setNumbers({
                        primary: primaryNumbers,
                        secondary: secondaryNumbers,
                    });
                } else {
                    throw new Error("Server error. Please try again later.");
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    const clearNumbers = (): void => {
        const currentPrimaryNumbers = new Set(numbers.primary);
        if (
            currentPrimaryNumbers.size === 1 &&
            currentPrimaryNumbers.values().next().value === 0
        ) {
            return;
        }
        setNumbers(initialNumbers);
    };

    return (
        <div className="appContainer" role="application">
            <header className="titleContainer" role="heading">
                <b className="title black">Game </b>
                <b className="black">{INDEX}</b>
            </header>
            <Numbers numbers={numbers} />
            <div className="buttonContainer" role="buttonContainer">
                <button
                    className="selectButton circle"
                    onClick={retriveNumbers}
                    role="button"
                >
                    <img src={lightning} alt="Select Icon" />
                </button>
                <button
                    className="clearButton circle"
                    onClick={clearNumbers}
                    role="button"
                >
                    <img src={bin} alt="Clear Icon" />
                </button>
            </div>
        </div>
    );
}

export default App;
