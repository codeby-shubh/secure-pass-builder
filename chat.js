const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input [type=checkbox]");
let symbols = '~`!@#$%^&*()_-+={}[]:";<>/?,.';



let password = "";
let passwordLength = 10;
let checkCount = 0;
handSlider();

function handSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
}
function getRndInteger(min , max){
    return Math.floor(Math.random() * (max - min )) + min;  
}
function generateRandomNumber(){
    return_getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));    //  number change into string value//
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbols(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrenght(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
 async function copyContet(){
     try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";

        
     } catch (e) {
        copyMsg.innerText = "Failed";
 
     }
     copyMsg.classList.add("active");
     setTimeout(()=>{
        copyMsg.classList.remove("active");
     },2000);

}

 function shufflePassword(array){
    for(let i = Array.length - 1; i >= 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el)=> (str += el));
    return str;

 }
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();

    }
    
}


inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
        copyContet();
})
 
generateBtn.addEventListener('click', ()=>{
    if(checkCount==0)
         return;
    if(passwordLength > 0){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    //  if(uppercaseCheck.checked){
    //         password += generateUpperCase();
    //     }
     
    //  if(lowercaseCheck.checked){
    //         password += generateLowerCase();
    //     }
     
    //  if(numbersCheck.checked){
    //         password += generateRandomNumber();
    //     }
     
    //  if(symbolsCheck.checked){
    //         password += generateSymbols();
    //     }
     
    let funcArr = [];
    if(uppercaseCheck.checked)
         funcArr.push(generateUpperCase);
        
    if(lowercaseCheck.checked) 
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrenght();


});


