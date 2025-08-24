import './index.css'

let display = document.getElementById('display')

let ans
let text

display.innerText = ''

let firstoperand = null
let operator = null
let waiting = false

document.addEventListener('keydown', (e) => {
    const k = e.key
    let selector = null

    if (/^[0-9]$/.test(k) || k === '.') {
        selector = `[data-num="${k}"]`
    } else if (['+', '-', '*', '/'].includes(k)) {
        selector = `[data-op="${k}"]`
    } else if (k === 'Enter' || k === '=') {
        selector = '#equals'
    } else if (k === 'Backspace' || k.toLowerCase() === 'c') {
        selector = '#clear'
    }

    if (selector) {
        e.preventDefault()
        const btn = document.querySelector(selector)
        if (btn) btn.click()
    }
})

let calculator = document.getElementById('calculator')
let buttons = document.querySelector('.buttons')

buttons.addEventListener('click', (e) => {
    const btn = e.target

    if (btn.dataset.num != null) {
        if (waiting) {
            display.innerText = ''
            waiting = false
        }

        if (btn.dataset.num === '.' && display.innerText.includes('.')) return
        display.innerText += btn.dataset.num
        return
    }
    //   if (btn.dataset.num === ".") {
    //     if (!display.innerText.includes(".")) {
    //       display.innerText += ".";
    //     }
    //     return;
    //   }
    if (btn.dataset.op) {
        if (firstoperand !== null && operator && !waiting) {
            const result = operate(
                firstoperand,
                operator,
                display.innerText.slice(0, -1)
            )
            display.innerText = result
            firstoperand = result
        } else {
            firstoperand = display.innerText
            display.innerText += 'x'
        }
        operator = btn.dataset.op
        waiting = true
        return
    }

    if (btn.id === 'equals') {
        if (firstoperand !== null && operator) {
            const result = operate(firstoperand, operator, display.innerText)
            display.innerText = result

            firstoperand = null
            operator = null
            waiting = false
        }
        return
    }

    if (btn.id === 'clear') {
        display.innerText = ''

        firstoperand = null
        operator = null
        waiting = false
    }
})

function add(a, b) {
    return a + b
}
function subtract(a, b) {
    return a - b
}
function multiply(a, b) {
    return a * b
}
function divide(a, b) {
    return a / b
}

function operate(a, op, b) {
    a = Number(a)
    b = Number(b)
    switch (op) {
        case '+':
            return add(a, b)
        case '-':
            return subtract(a, b)
        case '*':
            return multiply(a, b)
        case '/':
            if (b === 0) {
                alert('Cannot divide by 0!')
                return a // or return 0, your choice
            }
            return divide(a, b)
    }
}
