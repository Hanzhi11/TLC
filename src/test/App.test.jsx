import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";
import "@testing-library/jest-dom";
import App, { PRIMARY_MAX, PRIMARY_TOTAL, SECONDARY_MAX } from "../App";
import { StrictMode } from "react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";

function testAppComponents(screen) {
    const application = screen.getByRole("application");
    const heading = screen.getByRole("heading");
    const main = screen.getByRole("main");
    const buttonContainer = screen.getByRole("buttonContainer");
    const buttons = within(buttonContainer).getAllByRole("button");

    expect(application).toBeTruthy();
    expect(heading).toBeTruthy();
    expect(heading).toHaveTextContent(1);
    expect(main).toBeTruthy();
    expect(buttonContainer).toBeTruthy();
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass("selectButton");
    expect(buttons[1]).toHaveClass("clearButton");
}

function testMainComponents(screen) {
    const group = screen.getByRole("group");
    const groupCells = screen.getAllByRole("cell");
    const primary = screen.getByRole("primary");
    const primaryCells = within(primary).getAllByRole("gridcell");
    const secondary = screen.getByRole("secondary");
    const secondaryCells = within(secondary).getAllByRole("gridcell");
    const banner = screen.getByRole("banner");

    expect(group).toBeTruthy();
    expect(groupCells).toHaveLength(8);
    expect(primary).toBeTruthy();
    expect(primaryCells).toHaveLength(PRIMARY_MAX);
    primaryCells.forEach((_cell, index) => {
        expect(primaryCells[index]).toHaveTextContent(index + 1);
    });

    expect(secondary).toBeTruthy();
    expect(secondaryCells).toHaveLength(SECONDARY_MAX);
    secondaryCells.forEach((_cell, index) => {
        expect(primaryCells[index]).toHaveTextContent(index + 1);
    });

    expect(banner).toBeTruthy();
    expect(banner).toHaveTextContent("SELECT YOUR POWERBALL");
}

function testEmptyMain(screen) {
    const groupCells = screen.getAllByRole("cell");
    const primary = screen.getByRole("primary");
    const secondary = screen.getByRole("secondary");
    const primaryImages = within(primary).queryAllByRole("image");
    const secondaryImages = within(secondary).queryAllByRole("image");
    expect(groupCells[PRIMARY_TOTAL]).toHaveTextContent("PB");
    groupCells.slice(0, PRIMARY_TOTAL).forEach((cell, index) => {
        expect(groupCells[index]).toBeEmptyDOMElement();
    });

    expect(primaryImages).toHaveLength(0);
    expect(secondaryImages).toHaveLength(0);
}

function testFilledMain(screen, results) {
    const groupCells = screen.getAllByRole("cell");
    const primary = screen.getByRole("primary");
    const secondary = screen.getByRole("secondary");
    const primaryImages = within(primary).queryAllByRole("image");
    const secondaryImages = within(secondary).queryAllByRole("image");
    expect(groupCells[PRIMARY_TOTAL]).toHaveTextContent(
        results.SecondaryNumbers[0]
    );
    groupCells.slice(0, PRIMARY_TOTAL).forEach((_cell, index) => {
        expect(groupCells[index]).toHaveTextContent(
            results.PrimaryNumbers[index]
        );
    });

    expect(primaryImages).toHaveLength(PRIMARY_TOTAL);
    expect(secondaryImages).toHaveLength(1);
}

function testComponents(screen, results = null) {
    testAppComponents(screen);
    testMainComponents(screen);
    if (results) {
        testFilledMain(screen, results);
    } else {
        testEmptyMain(screen);
    }
}

const mockResponseSuccess = {
    DrawResults: [
        {
            PrimaryNumbers: [1, 2, 3, 4, 5, 6, 7],
            SecondaryNumbers: [9],
            ProductId: "Powerball",
        },
    ],
    ErrorInfo: null,
    Success: true,
};

const mockResponseFail = {
    DrawResults: [
        {
            PrimaryNumbers: [1, 2, 3, 4, 5, 6, 7],
            SecondaryNumbers: [9],
            ProductId: "Powerball",
        },
    ],
    ErrorInfo: null,
    Success: false,
};

const mockInvalidNumbers = {
    DrawResults: [
        {
            PrimaryNumbers: [1, 2, 3, 4, 5, 6, 7],
            SecondaryNumbers: [30],
            ProductId: "Powerball",
        },
    ],
    ErrorInfo: null,
    Success: true,
};

describe("load app", () => {
    it("display one heading, one main body and two buttons", () => {
        render(
            <StrictMode>
                <App />
            </StrictMode>
        );
        testComponents(screen);
    });
});

describe("user clicks buttons", () => {
    let user;

    beforeEach(function () {
        render(
            <StrictMode>
                <App />
            </StrictMode>
        );

        user = userEvent.setup();
        testComponents(screen);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("fill with numbers with the select button, then empty numbers with the clear button ", async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockResponseSuccess),
            })
        );
        const buttonContainer = screen.getByRole("buttonContainer");
        const buttons = within(buttonContainer).getAllByRole("button");

        // click the select button
        await user.click(buttons[0]);
        expect(global.fetch).toHaveBeenCalled();
        testComponents(screen, mockResponseSuccess.DrawResults[0]);

        // click the select button again after filling the numbers
        await user.click(buttons[0]);
        expect(global.fetch).toHaveBeenCalledTimes(1);

        // click the clear button
        await user.click(buttons[1]);
        testComponents(screen);

        // click the clear button again after clearing up the numbers
        await user.click(buttons[1]);
        testComponents(screen);
    });

    it("not diplay numbers when reponse fails", async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockResponseFail),
            })
        );
        const alertMock = vi
            .spyOn(global, "alert")
            .mockImplementation(() => {});

        const buttonContainer = screen.getByRole("buttonContainer");
        const buttons = within(buttonContainer).getAllByRole("button");
        await user.click(buttons[0]);
        testComponents(screen);
        expect(buttons[0]).toHaveFocus();
        expect(alertMock).toHaveBeenCalledWith(
            new Error("Server error. Please try again later.")
        );
        alertMock.mockRestore();
    });

    it("not diplay numbers when server down", async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
            })
        );
        const alertMock = vi
            .spyOn(global, "alert")
            .mockImplementation(() => {});

        const buttonContainer = screen.getByRole("buttonContainer");
        const buttons = within(buttonContainer).getAllByRole("button");
        await user.click(buttons[0]);
        testComponents(screen);
        expect(buttons[0]).toHaveFocus();
        expect(alertMock).toHaveBeenCalledWith(
            new Error("Data fetch failed! Status: 404")
        );
        alertMock.mockRestore();
    });

    it("not diplay numbers when numbers are invalid", async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockInvalidNumbers),
            })
        );
        const alertMock = vi
            .spyOn(global, "alert")
            .mockImplementation(() => {});

        const buttonContainer = screen.getByRole("buttonContainer");
        const buttons = within(buttonContainer).getAllByRole("button");
        await user.click(buttons[0]);
        testComponents(screen);
        expect(buttons[0]).toHaveFocus();
        expect(alertMock).toHaveBeenCalledWith(
            new Error(
                "Numbers are not available right now! Please try again later!"
            )
        );
        alertMock.mockRestore();
    });
});
