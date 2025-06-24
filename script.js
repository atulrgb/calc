let display = document.getElementById('display');
let current = '';
let resetNext = false;

function updateDisplay(val) {
  display.textContent = val;
}
function inputNum(num) {
  if (resetNext) {
    current = '';
    resetNext = false;
  }
  if (current === '0') current = '';
  current += num;
  updateDisplay(current);
}
function inputOp(op) {
  if (current === '') return;
  if (/[-+*/]$/.test(current)) {
    current = current.slice(0, -1) + op;
  } else {
    current += op;
  }
  resetNext = false;
  updateDisplay(current);
}
function inputDot() {
  if (resetNext) {
    current = '';
    resetNext = false;
  }
  let parts = current.split(/[-+*/]/);
  let last = parts[parts.length - 1];
  if (!last.includes('.')) {
    current += current === '' ? '0.' : '.';
    updateDisplay(current);
  }
}
function clearDisplay() {
  current = '';
  updateDisplay('0');
}
function backspace() {
  if (resetNext) {
    current = '';
    resetNext = false;
    updateDisplay('0');
    return;
  }
  current = current.slice(0, -1);
  updateDisplay(current === '' ? '0' : current);
}
function inputPercent() {
  if (current === '') return;
  let parts = current.split(/([-+*/])/);
  let last = parts[parts.length - 1];
  if (!isNaN(last) && last !== '') {
    let percent = parseFloat(last) / 100;
    current = current.slice(0, -last.length) + percent;
    updateDisplay(current);
  }
}
function calculate() {
  try {
    let result = eval(current.replace(/÷/g, '/').replace(/×/g, '*'));
    if (result === undefined) return;
    updateDisplay(result);
    current = result.toString();
    resetNext = true;
  } catch {
    updateDisplay('Error');
    current = '';
    resetNext = true;
  }
}
// Keyboard support
// Wait for DOMContentLoaded to ensure display is available
window.addEventListener('DOMContentLoaded', () => {
  display = document.getElementById('display');
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputNum(e.key);
    else if (['+', '-', '*', '/'].includes(e.key)) inputOp(e.key);
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape') clearDisplay();
    else if (e.key === '.') inputDot();
    else if (e.key === '%') inputPercent();
  });
}); 