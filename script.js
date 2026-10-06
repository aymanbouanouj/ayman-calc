"use strict";


/* =========================
   Elements
========================= */

const display = document.getElementById("inputbox");
const historyDisplay = document.getElementById("history");

const buttons = document.querySelectorAll(".button");


/* =========================
   Calculator State
========================= */

let currentValue = "0";

let firstOperand = null;

let currentOperator = null;

let waitingForSecondOperand = false;

let calculationFinished = false;

let hasError = false;


/* =========================
   Display
========================= */

function updateDisplay() {

    display.value = currentValue;
}


function updateHistory(text = "") {

    historyDisplay.textContent = text;
}


/* =========================
   Reset
========================= */

function clearCalculator() {

    currentValue = "0";

    firstOperand = null;

    currentOperator = null;

    waitingForSecondOperand = false;

    calculationFinished = false;

    hasError = false;

    updateHistory();

    updateDisplay();
}


/* =========================
   Error
========================= */

function showError(message = "Error") {

    currentValue = message;

    firstOperand = null;

    currentOperator = null;

    waitingForSecondOperand = false;

    calculationFinished = true;

    hasError = true;

    updateHistory();

    updateDisplay();
}


/* =========================
   Numbers
========================= */

function inputNumber(number) {

    if (hasError) {

        clearCalculator();
    }


    /*
        Start a new calculation if a result
        was previously displayed.
    */

    if (
        calculationFinished &&
        currentOperator === null
    ) {

        currentValue = "0";

        calculationFinished = false;

        updateHistory();
    }


    /*
        Start the second operand after
        choosing an operator.
    */

    if (waitingForSecondOperand) {

        currentValue =
            number === "00"
                ? "0"
                : number;

        waitingForSecondOperand = false;

        updateDisplay();

        return;
    }


    /*
        Avoid unnecessary leading zeros.
    */

    if (currentValue === "0") {

        if (number === "00") {

            return;
        }

        currentValue = number;

    } else {

        /*
            Prevent extremely long values.
        */

        const rawLength =
            currentValue
                .replace("-", "")
                .replace(".", "")
                .length;

        if (rawLength >= 14) {

            return;
        }

        currentValue += number;
    }


    updateDisplay();
}


/* =========================
   Decimal
========================= */

function inputDecimal() {

    if (hasError) {

        clearCalculator();
    }


    if (calculationFinished) {

        currentValue = "0";

        calculationFinished = false;

        updateHistory();
    }


    if (waitingForSecondOperand) {

        currentValue = "0.";

        waitingForSecondOperand = false;

        updateDisplay();

        return;
    }


    if (!currentValue.includes(".")) {

        currentValue += ".";

        updateDisplay();
    }
}


/* =========================
   Delete
========================= */

function deleteLastCharacter() {

    if (
        hasError ||
        calculationFinished
    ) {

        clearCalculator();

        return;
    }


    if (waitingForSecondOperand) {

        return;
    }


    if (
        currentValue.length <= 1 ||
        (
            currentValue.startsWith("-") &&
            currentValue.length === 2
        )
    ) {

        currentValue = "0";

    } else {

        currentValue =
            currentValue.slice(0, -1);
    }


    updateDisplay();
}


/* =========================
   Calculation
========================= */

function calculate(
    first,
    second,
    operator
) {

    let result;


    switch (operator) {

        case "+":

            result = first + second;

            break;


        case "-":

            result = first - second;

            break;


        case "*":

            result = first * second;

            break;


        case "/":

            if (second === 0) {

                return null;
            }

            result = first / second;

            break;


        default:

            return second;
    }


    /*
        Reduce common floating-point errors.

        Example:
        0.1 + 0.2
        normally becomes
        0.30000000000000004
    */

    return Number(
        result.toPrecision(12)
    );
}


/* =========================
   Result Formatting
========================= */

function formatResult(number) {

    if (!Number.isFinite(number)) {

        return "Error";
    }


    const absoluteValue =
        Math.abs(number);


    /*
        Scientific notation for values
        that are too large or too small.
    */

    if (
        absoluteValue >= 1e12 ||
        (
            absoluteValue !== 0 &&
            absoluteValue < 1e-9
        )
    ) {

        return number.toExponential(8);
    }


    return String(
        Number(
            number.toFixed(10)
        )
    );
}


/* =========================
   Operator Symbols
========================= */

function getOperatorSymbol(operator) {

    switch (operator) {

        case "*":

            return "×";


        case "/":

            return "÷";


        case "-":

            return "−";


        default:

            return operator;
    }
}


/* =========================
   Operator
========================= */

function chooseOperator(nextOperator) {

    if (hasError) {

        return;
    }


    const inputValue =
        Number(currentValue);


    /*
        Change operator if user presses
        multiple operators consecutively.

        Example:
        5 + ×
    */

    if (
        currentOperator &&
        waitingForSecondOperand
    ) {

        currentOperator =
            nextOperator;

        updateHistory(
            `${formatResult(firstOperand)} ${getOperatorSymbol(currentOperator)}`
        );

        return;
    }


    /*
        First operator selection.
    */

    if (firstOperand === null) {

        firstOperand =
            inputValue;

    } else if (currentOperator) {

        /*
            Handle chained operations.

            Example:
            10 + 5 ×
        */

        const result =
            calculate(
                firstOperand,
                inputValue,
                currentOperator
            );


        if (result === null) {

            showError(
                "Cannot divide by zero"
            );

            return;
        }


        currentValue =
            formatResult(result);

        firstOperand =
            result;

        updateDisplay();
    }


    currentOperator =
        nextOperator;

    waitingForSecondOperand =
        true;

    calculationFinished =
        false;


    updateHistory(
        `${formatResult(firstOperand)} ${getOperatorSymbol(currentOperator)}`
    );
}


/* =========================
   Percentage
========================= */

function applyPercentage() {

    if (hasError) {

        return;
    }


    const value =
        Number(currentValue);


    let percentage;


    /*
        Calculator-style percentage logic.

        200 + 10% = 220
        200 - 10% = 180

        200 × 10% = 20
        200 ÷ 10% = 2000
    */

    if (
        firstOperand !== null &&
        currentOperator &&
        !waitingForSecondOperand
    ) {

        if (
            currentOperator === "+" ||
            currentOperator === "-"
        ) {

            percentage =
                firstOperand *
                (value / 100);

        } else {

            percentage =
                value / 100;
        }

    } else {

        percentage =
            value / 100;
    }


    currentValue =
        formatResult(percentage);

    updateDisplay();
}


/* =========================
   Equals
========================= */

function performEquals() {

    if (
        hasError ||
        currentOperator === null ||
        firstOperand === null
    ) {

        return;
    }


    const secondOperand =
        Number(currentValue);


    const firstValue =
        firstOperand;


    const operator =
        currentOperator;


    const result =
        calculate(
            firstValue,
            secondOperand,
            operator
        );


    if (result === null) {

        showError(
            "Cannot divide by zero"
        );

        return;
    }


    updateHistory(
        `${formatResult(firstValue)} ` +
        `${getOperatorSymbol(operator)} ` +
        `${formatResult(secondOperand)} =`
    );


    currentValue =
        formatResult(result);


    firstOperand =
        null;

    currentOperator =
        null;

    waitingForSecondOperand =
        false;

    calculationFinished =
        true;


    updateDisplay();
}


/* =========================
   Button Events
========================= */

buttons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const value =
                button.dataset.value;

            const action =
                button.dataset.action;


            /*
                Numbers
            */

            if (
                button.classList.contains("number") &&
                action !== "decimal"
            ) {

                inputNumber(value);

                return;
            }


            /*
                Actions
            */

            switch (action) {

                case "clear":

                    clearCalculator();

                    break;


                case "delete":

                    deleteLastCharacter();

                    break;


                case "decimal":

                    inputDecimal();

                    break;


                case "percent":

                    applyPercentage();

                    break;


                case "operator":

                    chooseOperator(value);

                    break;


                case "equals":

                    performEquals();

                    break;
            }

        }
    );

});


/* =========================
   Keyboard Support
========================= */

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key;


        /*
            Numbers
        */

        if (/^[0-9]$/.test(key)) {

            inputNumber(key);

            return;
        }


        /*
            Decimal
        */

        if (key === ".") {

            inputDecimal();

            return;
        }


        /*
            Operators
        */

        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            event.preventDefault();

            chooseOperator(key);

            return;
        }


        /*
            Percentage
        */

        if (key === "%") {

            applyPercentage();

            return;
        }


        /*
            Equals
        */

        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            performEquals();

            return;
        }


        /*
            Delete
        */

        if (key === "Backspace") {

            deleteLastCharacter();

            return;
        }


        /*
            Clear
        */

        if (
            key === "Escape" ||
            key === "Delete"
        ) {

            clearCalculator();
        }

    }
);


/* =========================
   Initial Display
========================= */

updateDisplay();