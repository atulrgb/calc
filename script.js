const display = document.getElementById('display');
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let shouldResetDisplay = false;

// Scientific mode toggle
const sciToggle = document.getElementById('toggle-scientific');
const sciButtons = document.querySelector('.scientific-buttons');
const calculator = document.querySelector('.calculator');
let scientificMode = false;
let powerMode = false;
let baseForPower = null;
let modMode = false;
let baseForMod = null;

// Ensure scientific mode is off by default
sciButtons.classList.remove('show-scientific');
calculator.classList.remove('scientific');
scientificMode = false;
sciToggle.textContent = 'Show Scientific Mode';

const currencyPanel = document.querySelector('.currency-panel');
currencyPanel.style.display = 'none';

const conversionPanels = document.querySelector('.conversion-panels');
conversionPanels.style.display = 'none';

sciToggle.addEventListener('click', () => {
  scientificMode = !scientificMode;
  sciButtons.classList.toggle('show-scientific', scientificMode);
  calculator.classList.toggle('scientific', scientificMode);
  sciToggle.textContent = scientificMode ? 'Hide Scientific Mode' : 'Show Scientific Mode';
  updateDisplay('0');
  currencyPanel.style.display = scientificMode ? 'block' : 'none';
  currencySection.style.display = scientificMode ? 'flex' : 'none';
  conversionPanels.style.display = scientificMode ? 'flex' : 'none';
});

sciButtons.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn')) return;
  const action = e.target.getAttribute('data-action');
  let value = parseFloat(display.textContent);

  function factorial(n) {
    if (n < 0) return 'Error';
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  switch (action) {
    case 'sin': {
      const result = String(Math.sin(value * Math.PI / 180));
      updateDisplay(result);
      addToHistory(`sin(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'cos': {
      const result = String(Math.cos(value * Math.PI / 180));
      updateDisplay(result);
      addToHistory(`cos(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'tan': {
      const result = String(Math.tan(value * Math.PI / 180));
      updateDisplay(result);
      addToHistory(`tan(${value})`, result);
      shouldResetResetDisplay = true;
      break;
    }
    case 'log': {
      const result = value > 0 ? String(Math.log10(value)) : 'Error';
      updateDisplay(result);
      addToHistory(`log(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'ln': {
      const result = value > 0 ? String(Math.log(value)) : 'Error';
      updateDisplay(result);
      addToHistory(`ln(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'sqrt': {
      const result = value >= 0 ? String(Math.sqrt(value)) : 'Error';
      updateDisplay(result);
      addToHistory(`√(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'cbrt': {
      const result = String(Math.cbrt(value));
      updateDisplay(result);
      addToHistory(`∛(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'abs': {
      const result = String(Math.abs(value));
      updateDisplay(result);
      addToHistory(`|${value}|`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'factorial': {
      const result = String(factorial(Math.floor(value)));
      updateDisplay(result);
      addToHistory(`${value}!`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'sinh': {
      const result = String(Math.sinh(value));
      updateDisplay(result);
      addToHistory(`sinh(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'cosh': {
      const result = String(Math.cosh(value));
      updateDisplay(result);
      addToHistory(`cosh(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'tanh': {
      const result = String(Math.tanh(value));
      updateDisplay(result);
      addToHistory(`tanh(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'square': {
      const result = String(value * value);
      updateDisplay(result);
      addToHistory(`sqr(${value})`, result);
      shouldResetDisplay = true;
      break;
    }
    case 'mod':
      baseForMod = value;
      modMode = true;
      shouldResetDisplay = true;
      break;
    case 'power':
      baseForPower = value;
      powerMode = true;
      shouldResetDisplay = true;
      break;
    case 'pi': {
      const result = String(Math.PI);
      updateDisplay(result);
      addToHistory('π', result);
      shouldResetDisplay = true;
      break;
    }
    case 'e': {
      const result = String(Math.E);
      updateDisplay(result);
      addToHistory('e', result);
      shouldResetDisplay = true;
      break;
    }
  }
});

function inputDigit(digit) {
  if (display.textContent === '0' || shouldResetDisplay) {
    updateDisplay(digit);
    shouldResetDisplay = false;
  } else {
    updateDisplay(display.textContent + digit);
  }
}

function inputDecimal() {
  if (shouldResetDisplay) {
    updateDisplay('0.');
    shouldResetDisplay = false;
    return;
  }
  if (!display.textContent.includes('.')) {
    updateDisplay(display.textContent + '.');
  }
}

function clearDisplay() {
  updateDisplay('0');
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  shouldResetDisplay = false;
}

let lastOperator = null;
let lastFirstOperand = null;

function handleOperator(nextOperator) {
  const inputValue = parseFloat(display.textContent);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  // Track for history BEFORE updating firstOperand
  if (firstOperand == null) {
    lastFirstOperand = inputValue;
    firstOperand = inputValue;
  } else if (operator) {
    lastFirstOperand = firstOperand;
    const result = performCalculation[operator](firstOperand, inputValue);
    const resultStr = String(result).length > 12 ? result.toExponential(6) : result;
    updateDisplay(resultStr);
    firstOperand = result;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
  shouldResetDisplay = true;

  lastOperator = nextOperator;
}

const performCalculation = {
  'add': (a, b) => a + b,
  'subtract': (a, b) => a - b,
  'multiply': (a, b) => a * b,
  'divide': (a, b) => b === 0 ? 'Error' : a / b
};

const historyList = document.getElementById('history-list');
let lastExpression = '';

function addToHistory(expression, result) {
  const item = document.createElement('div');
  item.className = 'history-item';
  item.textContent = `${expression} = ${result}`;
  item.title = 'Click to use result';
  item.addEventListener('click', () => {
    updateDisplay(result);
    shouldResetDisplay = true;
  });
  if (historyList.firstChild) {
    historyList.insertBefore(item, historyList.firstChild);
  } else {
    historyList.appendChild(item);
  }
}

function handleEquals() {
  const prevValue = display.textContent;
  if (operator && !waitingForSecondOperand) {
    const secondOperand = parseFloat(display.textContent);
    handleOperator(operator);
    operator = null;
    waitingForSecondOperand = false;
    if (prevValue !== display.textContent && !isNaN(Number(display.textContent))) {
      // Build expression string
      let opSymbol = '';
      switch (lastOperator) {
        case 'add': opSymbol = '+'; break;
        case 'subtract': opSymbol = '−'; break;
        case 'multiply': opSymbol = '×'; break;
        case 'divide': opSymbol = '÷'; break;
        default: opSymbol = lastOperator || '';
      }
      if (lastFirstOperand !== null && opSymbol) {
        addToHistory(`${lastFirstOperand} ${opSymbol} ${secondOperand}`, display.textContent);
      } else {
        addToHistory(prevValue, display.textContent);
      }
    }
  }
}

function handleSign() {
  if (display.textContent !== '0') {
    updateDisplay(String(parseFloat(display.textContent) * -1));
  }
}

function handlePercent() {
  updateDisplay(String(parseFloat(display.textContent) / 100));
}

// Handle power mode in main button handler
const origButtonHandler = document.querySelector('.calculator-buttons').onclick;
document.querySelector('.calculator-buttons').addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn')) return;

  if (e.target.hasAttribute('data-number')) {
    inputDigit(e.target.getAttribute('data-number'));
    waitingForSecondOperand = false;
    return;
  }

  switch (e.target.getAttribute('data-action')) {
    case 'decimal':
      inputDecimal();
      break;
    case 'clear':
      clearDisplay();
      break;
    case 'sign':
      handleSign();
      break;
    case 'percent':
      handlePercent();
      break;
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      handleOperator(e.target.getAttribute('data-action'));
      break;
    case 'equals':
      if (powerMode) {
        const exponent = parseFloat(display.textContent);
        updateDisplay(String(Math.pow(baseForPower, exponent)));
        powerMode = false;
        shouldResetDisplay = true;
        addToHistory(`${baseForPower} ^ ${exponent}`, display.textContent);
        return;
      }
      if (modMode) {
        const divisor = parseFloat(display.textContent);
        updateDisplay(divisor === 0 ? 'Error' : String(baseForMod % divisor));
        modMode = false;
        shouldResetDisplay = true;
        addToHistory(`${baseForMod} % ${divisor}`, display.textContent);
        return;
      }
      handleEquals();
      break;
  }
});

// Add button press animation on click
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
  btn.addEventListener('click', function() {
    btn.classList.remove('pressed'); // reset if needed
    void btn.offsetWidth; // force reflow for retrigger
    btn.classList.add('pressed');
  });
  btn.addEventListener('animationend', function() {
    btn.classList.remove('pressed');
  });
});

function autoScaleDisplay() {
  const maxFont = 2.5; // rem
  const minFont = 1.1; // rem
  const maxLen = 10;
  const len = display.textContent.length;
  let fontSize = maxFont;
  if (len > maxLen) {
    fontSize = Math.max(minFont, maxFont - 0.13 * (len - maxLen));
  }
  display.style.fontSize = fontSize + 'rem';
}

// Wrap display updates in a function
function updateDisplay(value) {
  display.textContent = value;
  autoScaleDisplay();
  display.scrollLeft = display.scrollWidth;
}

const colorScheme = document.getElementById('color-scheme');
const displayBox = document.getElementById('display');

function setTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove('theme-default', 'theme-light', 'theme-solarized');
  calculator.classList.remove('theme-default', 'theme-light', 'theme-solarized');
  displayBox.classList.remove('theme-default', 'theme-light', 'theme-solarized');
  document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.remove('theme-default', 'theme-light', 'theme-solarized');
  });
  // Add selected theme
  document.body.classList.add('theme-' + theme);
  calculator.classList.add('theme-' + theme);
  displayBox.classList.add('theme-' + theme);
  document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.add('theme-' + theme);
  });
  // Save to localStorage
  localStorage.setItem('calculator-theme', theme);
}

colorScheme.addEventListener('change', (e) => {
  setTheme(e.target.value);
});

// Set theme on load from localStorage if available
const savedTheme = localStorage.getItem('calculator-theme') || 'default';
setTheme(savedTheme);
colorScheme.value = savedTheme;

const clearHistoryBtn = document.getElementById('clear-history');
clearHistoryBtn.addEventListener('click', () => {
  historyList.innerHTML = '';
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const key = e.key;
  if (key >= '0' && key <= '9') {
    inputDigit(key);
    waitingForSecondOperand = false;
    e.preventDefault();
    return;
  }
  switch (key) {
    case '+':
      handleOperator('add'); e.preventDefault(); break;
    case '-':
      handleOperator('subtract'); e.preventDefault(); break;
    case '*':
      handleOperator('multiply'); e.preventDefault(); break;
    case '/':
      handleOperator('divide'); e.preventDefault(); break;
    case 'Enter':
    case '=':
      if (powerMode) {
        const exponent = parseFloat(display.textContent);
        updateDisplay(String(Math.pow(baseForPower, exponent)));
        powerMode = false;
        shouldResetDisplay = true;
        addToHistory(`${baseForPower} ^ ${exponent}`, display.textContent);
        e.preventDefault();
        return;
      }
      if (modMode) {
        const divisor = parseFloat(display.textContent);
        updateDisplay(divisor === 0 ? 'Error' : String(baseForMod % divisor));
        modMode = false;
        shouldResetDisplay = true;
        addToHistory(`${baseForMod} % ${divisor}`, display.textContent);
        e.preventDefault();
        return;
      }
      handleEquals(); e.preventDefault(); break;
    case 'Backspace':
      if (display.textContent.length > 1) {
        updateDisplay(display.textContent.slice(0, -1));
      } else {
        updateDisplay('0');
      }
      e.preventDefault();
      break;
    case 'Delete':
    case 'Escape':
      clearDisplay(); e.preventDefault(); break;
    case '.':
      inputDecimal(); e.preventDefault(); break;
    case '%':
      handlePercent(); e.preventDefault(); break;
    // Scientific keys
    case 's':
      sciButtons.querySelector('[data-action="sin"]').click(); e.preventDefault(); break;
    case 'c':
      sciButtons.querySelector('[data-action="cos"]').click(); e.preventDefault(); break;
    case 't':
      sciButtons.querySelector('[data-action="tan"]').click(); e.preventDefault(); break;
    case 'l':
      sciButtons.querySelector('[data-action="log"]').click(); e.preventDefault(); break;
    case 'n':
      sciButtons.querySelector('[data-action="ln"]').click(); e.preventDefault(); break;
    case 'r':
      sciButtons.querySelector('[data-action="sqrt"]').click(); e.preventDefault(); break;
    case 'q':
      sciButtons.querySelector('[data-action="square"]').click(); e.preventDefault(); break;
    case 'm':
      sciButtons.querySelector('[data-action="mod"]').click(); e.preventDefault(); break;
    case 'p':
      sciButtons.querySelector('[data-action="pi"]').click(); e.preventDefault(); break;
    case 'e':
      sciButtons.querySelector('[data-action="e"]').click(); e.preventDefault(); break;
    case 'h':
      sciButtons.querySelector('[data-action="sinh"]').click(); e.preventDefault(); break;
    case 'o':
      sciButtons.querySelector('[data-action="cosh"]').click(); e.preventDefault(); break;
    case 'a':
      sciButtons.querySelector('[data-action="tanh"]').click(); e.preventDefault(); break;
    case 'f':
      sciButtons.querySelector('[data-action="factorial"]').click(); e.preventDefault(); break;
    case 'b':
      sciButtons.querySelector('[data-action="abs"]').click(); e.preventDefault(); break;
    case 'y':
      sciButtons.querySelector('[data-action="power"]').click(); e.preventDefault(); break;
  }
});

function saveHistory() {
  const items = Array.from(historyList.children).map(item => item.textContent);
  localStorage.setItem('calculator-history', JSON.stringify(items));
}

function loadHistory() {
  const items = JSON.parse(localStorage.getItem('calculator-history') || '[]');
  historyList.innerHTML = '';
  for (const text of items) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = text;
    item.title = 'Click to use result';
    item.addEventListener('click', () => {
      const result = text.split('=')[1]?.trim();
      if (result) {
        updateDisplay(result);
        shouldResetDisplay = true;
      }
    });
    historyList.appendChild(item);
  }
}

// Patch addToHistory and clearHistoryBtn to save history
const origAddToHistory = addToHistory;
addToHistory = function(expression, result) {
  origAddToHistory(expression, result);
  saveHistory();
};

clearHistoryBtn.addEventListener('click', () => {
  historyList.innerHTML = '';
  saveHistory();
});

// Load history on page load
loadHistory();

const currencySection = document.querySelector('.scientific-currency');
currencySection.style.display = 'none';
const sourceCurrency = document.getElementById('source-currency');
const targetCurrency = document.getElementById('target-currency');
const sourceUnit = document.getElementById('source-unit');
const targetUnit = document.getElementById('target-unit');

// Add back unitFactors for unit conversion
const unitFactors = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
};

// Currency conversion arrow button
const convertCurrencyArrow = document.getElementById('convert-currency-arrow');
convertCurrencyArrow.addEventListener('click', async () => {
  const value = parseFloat(display.textContent);
  const from = sourceCurrency.value;
  const to = targetCurrency.value;
  if (isNaN(value)) {
    updateDisplay('Error');
    return;
  }
  updateDisplay('Loading...');
  try {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${value}&access_key=1cecf68b1f2e5b0569c73fe74a0d64bf`;
    console.log('Currency API URL:', url);
    const res = await fetch(url);
    console.log('Currency API status:', res.status);
    const data = await res.json();
    console.log('Currency API data:', data);
    if (typeof data.result !== 'number' || isNaN(data.result)) throw new Error('API error');
    updateDisplay(data.result.toFixed(4));
    addToHistory(`${value} ${from} → ${to}`, data.result.toFixed(4));
    shouldResetDisplay = true;
  } catch (err) {
    updateDisplay('Error');
    console.error('Currency conversion error:', err);
  }
});

// Unit conversion arrow button
const convertUnitArrow = document.getElementById('convert-unit-arrow');
convertUnitArrow.addEventListener('click', () => {
  const value = parseFloat(display.textContent);
  const from = sourceUnit.value;
  const to = targetUnit.value;
  if (isNaN(value)) {
    updateDisplay('Error');
    return;
  }
  const meters = value * unitFactors[from];
  const result = meters / unitFactors[to];
  updateDisplay(result.toFixed(6));
  addToHistory(`${value} ${from} → ${to}`, result.toFixed(6));
  shouldResetDisplay = true;
}); 