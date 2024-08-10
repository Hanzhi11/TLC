import bin from "./assets/bin.svg";
import lightning from "./assets/lightning.svg";
import "./App.css";
import Numbers from "./components/Numbers";
import { useState } from "react";

export interface PowerballNumbers {
    primary: number[];
    secondary: number;
}

const PRIMARY_TOTAL: number = 7;
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

function validNumbers(primary: number[], secondary: number): boolean {
    if (
        new Set(primary).size !== PRIMARY_TOTAL ||
        secondary < NUMBER_MIN ||
        secondary > SECONDARY_MAX
    ) {
        return false;
    }

    for (const num of primary) {
        if (num < NUMBER_MIN || num > PRIMARY_MAX) {
            return false;
        }
    }

    return true;
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
                    if (!validNumbers(primaryNumbers, secondaryNumbers)) {
                        return;
                    }
                    setNumbers({
                        primary: primaryNumbers,
                        secondary: secondaryNumbers,
                    });
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
        <div className="appContainer">
            <header className="titleContainer">
                <span className="title">Game </span>
                {INDEX}
            </header>
            <Numbers numbers={numbers} />
            <div className="buttonContainer">
                <button
                    className="selectButton circle"
                    onClick={retriveNumbers}
                >
                    <img src={lightning} alt="Select Icon" />
                </button>
                <button className="clearButton circle" onClick={clearNumbers}>
                    <img src={bin} alt="Clear Icon" />
                </button>
            </div>
        </div>
    );
}

export default App;
