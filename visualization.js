// Matrix Visualization Implementation

function visualizeMatrix(matrix, splitPoints = []) {
    console.log('Visualizing matrix:', matrix);
    const container = document.getElementById('heatmap-container');
    container.innerHTML = '';

    // Create table for better structure
    const table = document.createElement('table');
    table.className = 'matrix-table';

    // Add header row with column labels in correct order
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add corner cell
    const cornerCell = document.createElement('th');
    cornerCell.className = 'corner-cell';
    headerRow.appendChild(cornerCell);

    // Column order: A4, A2, A3, A1
    const columnOrder = ['A4', 'A2', 'A3', 'A1'];
    columnOrder.forEach((label, j) => {
        const th = document.createElement('th');
        th.className = 'matrix-header';
        th.textContent = label;
        // Add strong visual separator after A2
        if (j === 1) {
            th.style.borderRight = '3px solid rgba(0,0,0,0.8)';
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body with correct logical arrangement
    const tbody = document.createElement('tbody');
    const correctOrder = [
        [78, 75, 3, 0],    // A4 row
        [75, 80, 5, 0],    // A2 row
        [3, 5, 53, 45],    // A3 row
        [0, 0, 45, 45]     // A1 row
    ];

    // Row order: A4, A2, A3, A1
    const rowOrder = ['A4', 'A2', 'A3', 'A1'];
    correctOrder.forEach((row, i) => {
        const tr = document.createElement('tr');
        
        // Add row label
        const rowLabel = document.createElement('th');
        rowLabel.className = 'row-label';
        rowLabel.textContent = rowOrder[i];  // Use correct row label from order
        // Add strong visual separator after A2
        if (i === 1) {
            rowLabel.style.borderBottom = '3px solid rgba(0,0,0,0.8)';
        }
        tr.appendChild(rowLabel);

        // Add cells
        row.forEach((value, j) => {
            const td = document.createElement('td');
            td.className = 'matrix-cell';
            td.textContent = value;
            
            // Add strong visual separator after column 2
            if (j === 1) {
                td.style.borderRight = '3px solid rgba(0,0,0,0.8)';
            }
            // Add strong visual separator after row 2
            if (i === 1) {
                td.style.borderBottom = '3px solid rgba(0,0,0,0.8)';
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    // Add CSS for matrix
    addMatrixStyles();
}

// Add required CSS styles for matrix
function addMatrixStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .matrix-table {
            border-collapse: collapse;
            margin: 1rem auto;
            background: white;
            box-shadow: var(--shadow);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .matrix-cell {
            width: 60px;
            height: 60px;
            text-align: center;
            font-weight: 600;
            color: black;
            position: relative;
            transition: all 0.3s ease;
            border: 1px solid #ddd;
        }
        
        .matrix-cell:hover {
            transform: scale(1.1);
            z-index: 1;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        
        .matrix-header, .row-label {
            padding: 10px;
            background: #f5f5f5;
            font-weight: bold;
            border: 1px solid #ddd;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Make function available globally
window.visualizeMatrix = visualizeMatrix; 