import bin from "./assets/bin.svg";
import lightning from "./assets/lightning.svg";
import "./App.css";
import Numbers from "./components/Numbers";
import { useState } from "react";

export interface PowerballNumbers {
    primary: number[];
    secondary: number;
}

const initialSelectedNumbers: number[] = new Array(7).fill(0);
const index: number = 1;

const payload = {
    CompanyId: "GoldenCasket",
    MaxDrawCountPerProduct: 1,
    OptionalProductFilter: ["Powerball"],
};

const initialNumbers = {
    primary: initialSelectedNumbers,
    secondary: 0,
};

function validNumbers(numbers: Set<number>): boolean {
    let isValid = true;
    for (const num of numbers) {
        if (num < 1 || num > 35) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

function App(): JSX.Element {
    const [numbers, setNumbers] = useState<PowerballNumbers>(initialNumbers);

    const retriveNumbers = (): void => {
        const currentPrimaryNumbers = new Set(numbers.primary);
        if (currentPrimaryNumbers.size === 7) {
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
                    const primaryNumbers: Set<number> = new Set(
                        result.PrimaryNumbers
                    );
                    if (
                        primaryNumbers.size !== 7 ||
                        !validNumbers(primaryNumbers)
                    ) {
                        return;
                    }
                    setNumbers({
                        primary: result.PrimaryNumbers,
                        secondary: result.SecondaryNumbers[0],
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
                {index}
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
