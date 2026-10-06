# Ayman Calc

<p align="center">
  <img src="logo.png" alt="Ayman Calc logo" width="180">
</p>

<p align="center">
  A modern, responsive calculator built with HTML, CSS, and vanilla JavaScript.
</p>

<p align="center">
  <a href="https://aymanbouanouj.github.io/ayman-calc/"><strong>Live Demo</strong></a>
</p>

## Preview

<p align="center">
  <img src="assets/preview.svg" alt="Ayman Calc interface preview" width="650">
</p>

## About

**Ayman Calc** is a lightweight calculator project focused on clean UI, responsive design, and clear JavaScript logic without using `eval()`.

The calculator supports mouse, touch, and keyboard input and includes common calculator behaviors such as chained operations, percentages, decimals, history display, and division-by-zero handling.

## Features

- Addition, subtraction, multiplication, and division
- Percentage calculations
- Decimal number support
- Clear (`AC`) and delete (`DEL`) controls
- Calculation history display
- Chained calculations
- Division-by-zero handling
- Keyboard support
- Responsive layout for desktop and mobile
- Custom Ayman Calc branding
- Calculation logic implemented without `eval()`
- Result formatting to reduce common floating-point display issues

## Keyboard Controls

| Key | Action |
| --- | --- |
| `0-9` | Enter numbers |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Percentage |
| `.` | Decimal point |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last character |
| `Delete` or `Escape` | Clear calculator |

## Technologies

- **HTML5** — structure and semantic markup
- **CSS3** — responsive layout and visual design
- **JavaScript** — calculator state, operations, keyboard input, and UI behavior

## Project Structure

```text
ayman-calc/
├── assets/
│   └── preview.svg
├── index.html
├── style.css
├── script.js
├── logo.png
├── README.md
└── .gitignore
```

## Run Locally

No build step or package installation is required.

1. Clone the repository:

```bash
git clone https://github.com/aymanbouanouj/ayman-calc.git
```

2. Open the project folder:

```bash
cd ayman-calc
```

3. Open `index.html` in your browser.

## Example Calculations

```text
10 + 5 = 15
10 - 4 = 6
8 × 5 = 40
20 ÷ 4 = 5
0.1 + 0.2 = 0.3
200 + 10% = 220
200 × 10% = 20
```

## Author

**Ayman Bounaouj**

GitHub: [@aymanbouanouj](https://github.com/aymanbouanouj)
