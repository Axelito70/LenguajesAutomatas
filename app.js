// app.js

function processEquation() {
    const equationInput = document.getElementById('equationInput').value;
    const treeContainer = document.getElementById('treeContainer');
    const errorAlert = document.getElementById('errorAlert');

    // Formatear la ecuación para corregir multiplicaciones implícitas
    const formattedEquation = formatEquation(equationInput);

    // Validar la ecuación
    if (!validateEquation(formattedEquation)) {
        errorAlert.classList.remove('d-none');
        treeContainer.innerHTML = '';
        return;
    }

    errorAlert.classList.add('d-none');
    treeContainer.innerHTML = '';

    // Procesar la ecuación
    const equationTree = buildExpressionTree(formattedEquation);

    // Mostrar el árbol gráficamente
    displayTree(equationTree, treeContainer);
}

function formatEquation(equation) {
    // Añade un operador de multiplicación implícito antes de un paréntesis o entre un número y un paréntesis
    return equation.replace(/(\d)\(/g, '$1*(').replace(/\)(\d)/g, ')*$1');
}

function validateEquation(equation) {
    // Verificar que la ecuación no contenga números negativos
    if (/\-\d+/.test(equation)) return false;

    // Verificar que los paréntesis estén balanceados
    const stack = [];
    for (let char of equation) {
        if (char === '(') stack.push(char);
        if (char === ')') {
            if (stack.length === 0) return false;
            stack.pop();
        }
    }
    if (stack.length > 0) return false;

    return true;
}

function buildExpressionTree(expression) {
    const operators = ['+', '-', '*', '/'];
    let tokens = tokenize(expression);
    let nodeStack = [];
    let operatorStack = [];

    // Precedencia de los operadores
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    function createNode(operator) {
        let right = nodeStack.pop();
        let left = nodeStack.pop();
        return { value: operator, left: left, right: right };
    }

    for (let token of tokens) {
        if (!isNaN(token)) {
            nodeStack.push({ value: token });  // Si es un número, lo añadimos como nodo
        } else if (operators.includes(token)) {
            while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                nodeStack.push(createNode(operatorStack.pop()));
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                nodeStack.push(createNode(operatorStack.pop()));
            }
            operatorStack.pop();  // Elimina el paréntesis de apertura '('
        }
    }

    // Procesa operadores restantes
    while (operatorStack.length) {
        nodeStack.push(createNode(operatorStack.pop()));
    }

    return nodeStack[0];  // El nodo raíz del árbol
}

function tokenize(expression) {
    // Extraer números, operadores y paréntesis de la expresión
    return expression.match(/(\d+|\+|\-|\*|\/|\(|\))/g);
}

function displayTree(tree, container) {
    // Función recursiva para mostrar el árbol gráficamente
    function createTreeElement(node) {
        if (!node) return null;

        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.innerText = node.value;

        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        wrapper.appendChild(nodeElement);

        if (node.left || node.right) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'horizontal-wrapper';

            if (node.left) {
                childrenContainer.appendChild(createTreeElement(node.left));
            }

            if (node.right) {
                childrenContainer.appendChild(createTreeElement(node.right));
            }

            wrapper.appendChild(childrenContainer);
        }

        return wrapper;
    }

    const rootElement = createTreeElement(tree);
    container.appendChild(rootElement);
}

function changeTitleColor() {
    const title = document.querySelector('h1');
    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];
    let currentColorIndex = 0;

    setInterval(() => {
        title.classList.remove(colors[currentColorIndex]);
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        title.classList.add(colors[currentColorIndex]);
    }, 1000); // Cambia cada 3 segundos
}

// Llama a la función cuando la página cargue
document.addEventListener('DOMContentLoaded', (event) => {
    changeTitleColor();
});
