// Initial Variables
let passwordLength = 10;
let password = "";

// DOM Elements
let lengthDisplay = document.querySelector("[lengthDisplay]");
let slider = document.querySelector("input[type=range]");
let indicator = document.querySelector(".indicator");
let uppercase = document.querySelector("#uppercase");
let lowercase = document.querySelector("#lowercase");
let numbers = document.querySelector("#numbers");
let symbols = document.querySelector("#symbols");
let passwordDisplay = document.querySelector("input[passwordDisplay]");
let copyMessage = document.querySelector("[copyMessage]");
let copyBtn = document.querySelector(".copyBtn");
let generateBtn = document.querySelector("#generateBtn");

// Symbol Set
const symbol = "~`!@#$%^&*()_-+={[}]|:;<,>.?/";

// Helper Functions
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomLowercase() {
    return String.fromCharCode(generateRandom(97, 123));
}

function generateRandomUppercase() {
    return String.fromCharCode(generateRandom(65, 91));
}

function generateRandomNumber() {
    return generateRandom(0, 10).toString();
}

function generateRandomSymbol() {
    let index = generateRandom(0, symbol.length);
    return symbol[index];
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5).join("");
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function handleSlider() {
    slider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function calcStrength() {
    let hasUpper = uppercase.checked;
    let hasLower = lowercase.checked;
    let hasNumber = numbers.checked;
    let hasSymbol = symbols.checked;

    let diversityScore = hasUpper + hasLower + hasNumber + hasSymbol;
    let lengthScore = Math.min(passwordLength / 10, 1);

    let totalScore = (diversityScore * 2 + lengthScore * 3) / 5;

    if (totalScore > 0.8) {
        setIndicator("#0f0");
    } else if (totalScore > 0.5) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied!";
    } catch (e) {
        copyMessage.innerText = "Failed to Copy!";
    }
    copyMessage.classList.add("active");
    setTimeout(() => copyMessage.classList.remove("active"), 2000);
}

// Event Listeners
slider.addEventListener("input", (event) => {
    let newValue = parseInt(event.target.value, 10);
    if (newValue >= checkCount) {
        passwordLength = newValue;
        handleSlider();
    }
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

let checkBoxes = document.querySelectorAll("input[type=checkbox]");
let checkCount = 0;

function handleCheckBoxChange() {
    checkCount = Array.from(checkBoxes).filter((checkbox) => checkbox.checked).length;

    if (checkCount === 0) {
        alert("At least one checkbox must be selected.");
        this.checked = true;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

checkBoxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

function adjustSliderForScreenSize() {
    if (window.innerWidth <= 480) {
        slider.max = 20;
    } else {
        slider.max = 100;
    }
}
window.addEventListener("resize", adjustSliderForScreenSize);
adjustSliderForScreenSize();

function validatePassword(password) {
    if (/([a-zA-Z0-9])\1{2,}/.test(password)) {
        alert("Password contains consecutive repeated characters!");
    }
}

generateBtn.addEventListener("click", () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let arrayOfCheckedFunction = [];

    if (uppercase.checked) arrayOfCheckedFunction.push(generateRandomUppercase);
    if (lowercase.checked) arrayOfCheckedFunction.push(generateRandomLowercase);
    if (numbers.checked) arrayOfCheckedFunction.push(generateRandomNumber);
    if (symbols.checked) arrayOfCheckedFunction.push(generateRandomSymbol);

    arrayOfCheckedFunction.forEach((func) => (password += func()));

    for (let i = 0; i < passwordLength - arrayOfCheckedFunction.length; i++) {
        let randIndex = generateRandom(0, arrayOfCheckedFunction.length);
        password += arrayOfCheckedFunction[randIndex]();
    }

    password = shuffle(Array.from(password));
    passwordDisplay.value = password;
    validatePassword(password);
    calcStrength();
});

handleSlider();
