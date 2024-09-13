function processEquation() {
    const equationInput = document.getElementById('equationInput').value; //
    const treeContainer = document.getElementById('treeContainer');
    const errorAlert = document.getElementById('errorAlert');
    const preOrderTable = document.getElementById('preOrderTable');
    const inOrderTable = document.getElementById('inOrderTable');
    const postOrderTable = document.getElementById('postOrderTable');

    // Limpiar las tablas antes de mostrar los resultados
    preOrderTable.innerHTML = '';
    inOrderTable.innerHTML = '';
    postOrderTable.innerHTML = '';

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

    // Mostrar recorridos en preorden, inorden y postorden
    displayTraversals(equationTree);
}

function displayTraversals(tree) {
    const preOrderTable = document.getElementById('preOrderTable');
    const inOrderTable = document.getElementById('inOrderTable');
    const postOrderTable = document.getElementById('postOrderTable');

    // Obtener los recorridos
    const preOrder = preOrderTraversal(tree);
    const inOrder = inOrderTraversal(tree);
    const postOrder = postOrderTraversal(tree);

    // Mostrar preorden
    preOrderTable.innerHTML = createTraversalTable('Preorden', preOrder);
    // Mostrar inorden
    inOrderTable.innerHTML = createTraversalTable('Inorden', inOrder);
    // Mostrar postorden
    postOrderTable.innerHTML = createTraversalTable('Postorden', postOrder);
}

function createTraversalTable(title, traversal) {
    return `
        <h4>${title}</h4>
        <table class="table table-bordered">
            <tr>
                <th>Recorrido</th>
            </tr>
            <tr>
                <td>${traversal.join(' ')}</td>
            </tr>
        </table>
    `;
}

// Recorridos
function preOrderTraversal(node) {
    if (!node) return [];
    return [node.value].concat(preOrderTraversal(node.left), preOrderTraversal(node.right));
}

function inOrderTraversal(node) {
    if (!node) return [];
    return inOrderTraversal(node.left).concat([node.value], inOrderTraversal(node.right));
}

function postOrderTraversal(node) {
    if (!node) return [];
    return postOrderTraversal(node.left).concat(postOrderTraversal(node.right), [node.value]);
}

// Función para formatear la ecuación
function formatEquation(equation) {
    return equation.replace(/(\d|\))\(/g, '$1*(').replace(/\)(\d|\w)/g, ')*$1');
}

// Función para validar la ecuación
function validateEquation(equation) {
    if (/\-\d+/.test(equation)) return false;
    const stack = [];
    for (let char of equation) {
        if (char === '(') stack.push(char);
        if (char === ')') {
            if (stack.length === 0) return false;
            stack.pop();
        }
    }
    if (stack.length > 0) return false;
    if (/[^a-zA-Z0-9\+\-\*\/\(\)\s]/.test(equation)) return false;
    if (/[+\-*/]{2,}/.test(equation)) return false;
    return true;
}

// Función para construir el árbol de expresión
function buildExpressionTree(expression) {
    const operators = ['+', '-', '*', '/'];
    let tokens = tokenize(expression);
    let nodeStack = [];
    let operatorStack = [];

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
        if (!isNaN(token) || /^[a-zA-Z]+$/.test(token)) {
            nodeStack.push({ value: token });
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
            operatorStack.pop();
        }
    }

    while (operatorStack.length) {
        nodeStack.push(createNode(operatorStack.pop()));
    }

    return nodeStack[0];
}

function tokenize(expression) {
    return expression.match(/([a-zA-Z]|\d+|\+|\-|\*|\/|\(|\))/g);
}

// Función para mostrar el árbol gráficamente
function displayTree(tree, container) {
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
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    changeTitleColor();
});
