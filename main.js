// DOM Elements
const csvUpload = document.getElementById('csv-upload');
const matrixSizeInput = document.getElementById('matrix-size');
const createMatrixBtn = document.getElementById('create-matrix');
const processMatrixBtn = document.getElementById('process-matrix');
const matrixInputGrid = document.getElementById('matrix-input-grid');
const beaSection = document.getElementById('bea-section');
const splittingSection = document.getElementById('splitting-section');
const visualizationSection = document.getElementById('visualization-section');

// State
let currentMatrix = [];
let clusteredMatrix = [];
let fragments = [];

// Default matrix data
const defaultMatrix = [
    [78, 75, 3, 0],    // A4
    [75, 80, 5, 0],    // A2
    [3, 5, 53, 45],    // A3
    [0, 0, 45, 45]     // A1
];

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    csvUpload.addEventListener('change', handleCSVUpload);
    createMatrixBtn.addEventListener('click', createMatrixGrid);
    processMatrixBtn.addEventListener('click', processMatrix);
    initializeWithDefaultMatrix();
});

// Process Matrix
function processMatrix() {
    console.log('Processing matrix...'); // Debug log

    // Get matrix from input grid
    const matrix = getMatrixFromGrid();
    if (!matrix || !matrix.length) {
        console.error('Matrix is empty or invalid');
        showError('Invalid matrix data. Please check your input.');
        return;
    }

    console.log('Current matrix:', matrix); // Debug log

    if (!validateMatrix(matrix)) {
        showError('Invalid matrix. Please check your input.');
        return;
    }

    try {
        // Create a deep copy of the matrix for BEA
        const inputMatrix = matrix.map(row => [...row]);
        console.log('Input matrix for BEA:', inputMatrix);

        // Run BEA
        console.log('Running BEA...'); // Debug log
        const beaResult = runBEA(inputMatrix);
        console.log('BEA Result:', beaResult); // Debug log

        if (!beaResult || !beaResult.matrix || !beaResult.steps) {
            throw new Error('Invalid BEA result structure');
        }

        // Display BEA results
        displayBEASteps(beaResult.steps);
        beaSection.classList.remove('hidden');

        // Run Vertical Splitting
        console.log('Running vertical splitting...'); // Debug log
        const splittingResult = runVerticalSplitting(beaResult.matrix);
        console.log('Splitting Result:', splittingResult); // Debug log

        displaySplittingResults(splittingResult);
        splittingSection.classList.remove('hidden');

        // Show visualizations
        console.log('Creating visualizations...'); // Debug log
        visualizeMatrix(beaResult.matrix, splittingResult.splitPoints);
        visualizationSection.classList.remove('hidden');

    } catch (error) {
        console.error('Error during processing:', error);
        showError('An error occurred while processing the matrix: ' + error.message);
    }
}

// Get Matrix from Grid
function getMatrixFromGrid() {
    const inputs = matrixInputGrid.querySelectorAll('input');
    if (!inputs.length) {
        console.error('No input elements found');
        return null;
    }

    const size = Math.sqrt(inputs.length);
    if (!Number.isInteger(size)) {
        console.error('Invalid number of inputs for square matrix');
        return null;
    }

    const matrix = [];
    let row = [];
    
    inputs.forEach((input, index) => {
        const value = parseFloat(input.value) || 0;
        row.push(value);
        
        if ((index + 1) % size === 0) {
            matrix.push([...row]); // Create a new array for each row
            row = [];
        }
    });

    console.log('Extracted matrix:', matrix); // Debug log
    return matrix;
}

// Display Matrix
function displayMatrix(matrix) {
    const size = matrix.length;
    matrixSizeInput.value = size;
    
    // Clear existing grid
    matrixInputGrid.innerHTML = '';
    
    // Set grid columns
    matrixInputGrid.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    
    // Create input cells
    matrix.forEach((row, i) => {
        row.forEach((value, j) => {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = value;
            input.dataset.row = i;
            input.dataset.col = j;
            matrixInputGrid.appendChild(input);
        });
    });
}

// Create Matrix Grid
function createMatrixGrid() {
    const size = parseInt(matrixSizeInput.value);
    if (size < 2 || size > 10) {
        showError('Matrix size must be between 2 and 10');
        return;
    }

    // Clear existing grid
    matrixInputGrid.innerHTML = '';
    
    // Set grid columns
    matrixInputGrid.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    
    // Create input cells
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.dataset.row = i;
            input.dataset.col = j;
            matrixInputGrid.appendChild(input);
        }
    }
}

// Initialize with default matrix
function initializeWithDefaultMatrix() {
    console.log('Initializing with default matrix:', defaultMatrix);
    currentMatrix = defaultMatrix;
    displayMatrix(defaultMatrix);
}

// CSV Upload Handler
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const matrix = parseCSV(text);
            
            if (validateMatrix(matrix)) {
                currentMatrix = matrix;
                displayMatrix(matrix);
            } else {
                showError('Invalid CSV format. Please check your file.');
            }
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showError('Error reading CSV file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Parse CSV
function parseCSV(text) {
    const rows = text.trim().split('\n');
    return rows.map(row => 
        row.trim().split(',').map(value => {
            const num = parseFloat(value.trim());
            if (isNaN(num)) throw new Error('Invalid number in CSV');
            return num;
        })
    );
}

// Validate Matrix
function validateMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) return false;
    
    const size = matrix.length;
    return matrix.every(row => 
        Array.isArray(row) && 
        row.length === size && 
        row.every(val => typeof val === 'number' && !isNaN(val))
    );
}

// Show Error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
} 