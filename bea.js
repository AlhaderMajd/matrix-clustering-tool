// Bond Energy Algorithm Implementation

function runBEA(matrix) {
    console.log('=== START runBEA ===');
    console.log('Input matrix:', JSON.stringify(matrix));

    if (!matrix || !matrix.length) {
        console.error('Invalid input matrix');
        throw new Error('Invalid input matrix');
    }

    const n = matrix.length;
    const steps = [];
    
    // Initialize with first column
    console.log('Extracting first column...');
    let clustered = matrix.map(row => [row[0]]);
    console.log('Initial clustered matrix:', JSON.stringify(clustered));
    
    let currentColumnOrder = ['A1'];
    console.log('Initial column order:', currentColumnOrder);
    
    // Create initial step
    console.log('Creating initial step...');
    const initialStep = {
        description: 'Starting with first column (A1)',
        matrix: clustered.map(row => [...row]),
        details: 'Initial placement of A1',
        columnOrder: [...currentColumnOrder]
    };
    console.log('Initial step matrix:', JSON.stringify(initialStep.matrix));
    steps.push(initialStep);

    // Column mapping for clarity
    const columnNames = ['A1', 'A2', 'A3', 'A4'];

    // Place remaining columns
    for (let i = 1; i < n; i++) {
        console.log(`\n=== Processing column ${i} ===`);
        
        // Extract current column
        const currentColumn = matrix.map(row => row[i]);
        const currentColumnName = columnNames[i];
        console.log('Current column:', JSON.stringify(currentColumn));
        console.log('Current column name:', currentColumnName);
        
        let bestPosition = 0;
        let maxContribution = Number.NEGATIVE_INFINITY;
        const contributions = [];

        // Try each possible position
        console.log('\nTesting positions...');
        for (let pos = 0; pos <= clustered[0].length; pos++) {
            console.log(`\nTesting position ${pos}:`);
            
            // Calculate contribution for this position
            const contribution = calculateContribution(clustered, currentColumn, pos);
            console.log(`Position ${pos} contribution:`, contribution);
            
            contributions.push({
                position: pos,
                contribution: contribution,
                resultingOrder: [
                    ...currentColumnOrder.slice(0, pos),
                    currentColumnName,
                    ...currentColumnOrder.slice(pos)
                ]
            });

            if (contribution > maxContribution) {
                maxContribution = contribution;
                bestPosition = pos;
                console.log(`New best position found: ${pos} with contribution ${contribution}`);
            }
        }

        console.log('\nInserting column at best position...');
        console.log('Best position:', bestPosition);
        console.log('Clustered matrix before insertion:', JSON.stringify(clustered));
        
        // Create temporary matrix and insert column
        let tempMatrix = clustered.map(row => [...row]);
        insertColumn(tempMatrix, currentColumn, bestPosition);
        console.log('Matrix after insertion:', JSON.stringify(tempMatrix));

        // Update clustered matrix
        clustered = tempMatrix.map(row => [...row]);
        currentColumnOrder.splice(bestPosition, 0, currentColumnName);
        console.log('Updated column order:', currentColumnOrder);

        // Create step details
        let details = `Placing column ${currentColumnName}:\n\n`;
        contributions.forEach(({position, contribution, resultingOrder}) => {
            details += `Position ${position + 1} (${resultingOrder.join(', ')}): `;
            details += `contribution = ${contribution.toFixed(2)}`;
            if (position === bestPosition) details += ' ← BEST';
            details += '\n';
        });

        details += `\nBond calculations for best position (${bestPosition + 1}):\n`;
        if (bestPosition === 0) {
            const bond = calculateBond(currentColumn, clustered.map(row => row[0]));
            details += `bond(${currentColumnName}, ${currentColumnOrder[1]}) = ${bond.toFixed(2)}`;
        } else if (bestPosition === clustered[0].length - 1) {
            const bond = calculateBond(clustered.map(row => row[bestPosition-1]), currentColumn);
            details += `bond(${currentColumnOrder[bestPosition-1]}, ${currentColumnName}) = ${bond.toFixed(2)}`;
        } else {
            const leftBond = calculateBond(clustered.map(row => row[bestPosition-1]), currentColumn);
            const rightBond = calculateBond(currentColumn, clustered.map(row => row[bestPosition]));
            const existingBond = calculateBond(clustered.map(row => row[bestPosition-1]), clustered.map(row => row[bestPosition]));
            details += `bond(${currentColumnOrder[bestPosition-1]}, ${currentColumnName}) = ${leftBond.toFixed(2)}\n`;
            details += `bond(${currentColumnName}, ${currentColumnOrder[bestPosition]}) = ${rightBond.toFixed(2)}\n`;
            details += `bond(${currentColumnOrder[bestPosition-1]}, ${currentColumnOrder[bestPosition]}) = ${existingBond.toFixed(2)}\n`;
            details += `\nTotal contribution = ${leftBond.toFixed(2)} + ${rightBond.toFixed(2)} - ${existingBond.toFixed(2)} = ${maxContribution.toFixed(2)}`;
        }

        // Create step
        console.log('\nCreating step...');
        const step = {
            description: `Placed column ${currentColumnName} at position ${bestPosition + 1}`,
            matrix: clustered.map(row => [...row]),
            details: details,
            columnOrder: [...currentColumnOrder]
        };
        console.log('Step matrix:', JSON.stringify(step.matrix));
        steps.push(step);
    }

    // Reorder rows
    console.log('\n=== Reordering rows ===');
    console.log('Matrix before reordering:', JSON.stringify(clustered));
    const finalMatrix = reorderRows(clustered, currentColumnOrder);
    console.log('Matrix after reordering:', JSON.stringify(finalMatrix));
    
    // Create final step
    console.log('\nCreating final step...');
    const finalStep = {
        description: 'Final clustered matrix',
        matrix: finalMatrix.map(row => [...row]),
        details: `Final column order: ${currentColumnOrder.join(', ')}\nRows reordered to match column order`,
        columnOrder: [...currentColumnOrder]
    };
    console.log('Final step matrix:', JSON.stringify(finalStep.matrix));
    steps.push(finalStep);

    console.log('\n=== END runBEA ===');
    return {
        matrix: finalMatrix,
        steps: steps
    };
}

// Helper function to create a deep copy of a matrix
function deepCopyMatrix(matrix) {
    return matrix.map(row => [...row]);
}

// Calculate contribution for placing a column
function calculateContribution(clustered, column, position) {
    if (!clustered || !column || clustered.length === 0) {
        console.error('Invalid input to calculateContribution');
        return 0;
    }

    let contribution = 0;

    if (position === 0) {
        // First position
        contribution = calculateBond(column, clustered.map(row => row[0]));
    } else if (position === clustered[0].length) {
        // Last position
        contribution = calculateBond(clustered.map(row => row[position-1]), column);
    } else {
        // Middle position
        contribution = calculateBond(clustered.map(row => row[position-1]), column) +
                      calculateBond(column, clustered.map(row => row[position])) -
                      calculateBond(clustered.map(row => row[position-1]), clustered.map(row => row[position]));
    }

    return contribution;
}

// Calculate bond between two columns
function calculateBond(col1, col2) {
    if (!Array.isArray(col1) || !Array.isArray(col2) || col1.length !== col2.length) {
        console.error('Invalid columns for bond calculation:', { col1, col2 });
        return 0;
    }
    return col1.reduce((sum, val, idx) => sum + val * col2[idx], 0);
}

// Insert column at specified position
function insertColumn(matrix, column, position) {
    if (!matrix || !column || !Array.isArray(matrix) || !Array.isArray(column)) {
        console.error('Invalid input to insertColumn');
        return;
    }
    for (let i = 0; i < matrix.length; i++) {
        matrix[i].splice(position, 0, column[i]);
    }
}

// Reorder rows to match column order
function reorderRows(matrix, columnOrder) {
    if (!matrix || !columnOrder || matrix.length === 0 || columnOrder.length === 0) {
        console.error('Invalid input to reorderRows');
        return matrix;
    }

    const rowOrder = ['A1', 'A2', 'A3', 'A4'];
    const reorderedMatrix = [];
    
    columnOrder.forEach(colName => {
        const rowIndex = rowOrder.indexOf(colName);
        if (rowIndex >= 0 && rowIndex < matrix.length) {
            reorderedMatrix.push([...matrix[rowIndex]]);
        } else {
            console.error(`Invalid column name: ${colName}`);
        }
    });
    
    return reorderedMatrix;
}

// Display BEA steps
function displayBEASteps(steps) {
    console.log('=== START displayBEASteps ===');
    
    if (!steps || !Array.isArray(steps)) {
        console.error('Invalid steps data:', steps);
        return;
    }

    const stepsContainer = document.getElementById('bea-steps');
    if (!stepsContainer) {
        console.error('Could not find bea-steps container');
        return;
    }

    console.log('Number of steps:', steps.length);
    console.log('First step:', JSON.stringify(steps[0]));
    console.log('Last step:', JSON.stringify(steps[steps.length - 1]));

    stepsContainer.innerHTML = '';

    steps.forEach((step, stepIndex) => {
        console.log(`\n=== Processing Step ${stepIndex + 1} ===`);
        
        // Validate step data
        if (!step.matrix || !Array.isArray(step.matrix) || !step.columnOrder || !Array.isArray(step.columnOrder)) {
            console.error(`Invalid step data at step ${stepIndex}:`, step);
            return;
        }

        console.log('Step description:', step.description);
        console.log('Step matrix:', JSON.stringify(step.matrix));
        console.log('Column order:', step.columnOrder);

        // Create step container
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';

        // Add step header
        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `<h3>Step ${stepIndex + 1}: ${step.description}</h3>`;
        stepDiv.appendChild(header);

        // Create matrix container
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-container';

        // Create table
        const table = document.createElement('table');
        table.className = 'matrix-table';

        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Add corner cell
        const cornerCell = document.createElement('th');
        cornerCell.className = 'corner-cell';
        headerRow.appendChild(cornerCell);

        // Add column headers
        step.columnOrder.forEach(colName => {
            const th = document.createElement('th');
            th.className = 'matrix-header';
            th.textContent = colName;
            headerRow.appendChild(th);
            console.log('Added column header:', colName);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');

        // Calculate max value for color scaling
        const allValues = step.matrix.flat().map(v => Math.abs(Number(v) || 0));
        const maxValue = Math.max(...allValues, 1);

        // Add matrix rows
        step.matrix.forEach((row, i) => {
            console.log(`Processing row ${i}:`, JSON.stringify(row));
            
            const tr = document.createElement('tr');
            
            // Add row label
            const rowLabel = document.createElement('th');
            rowLabel.className = 'row-label';
            rowLabel.textContent = step.columnOrder[i] || ['A1', 'A2', 'A3', 'A4'][i];
            tr.appendChild(rowLabel);
            console.log('Added row label:', rowLabel.textContent);

            // Add matrix values
            row.forEach((value, j) => {
                console.log(`Processing cell (${i},${j}):`, value);
                
                const td = document.createElement('td');
                td.className = 'matrix-cell';
                
                // Format the value
                const numValue = Number(value);
                td.textContent = isNaN(numValue) ? '0' : numValue.toString();
                console.log('Cell value set to:', td.textContent);

                // Calculate color intensity and apply as a pseudo-element
                const intensity = Math.abs(numValue) / maxValue;
                td.style.setProperty('--intensity', intensity.toString());
                td.style.backgroundColor = `rgba(33, 150, 243, ${intensity * 0.2})`;

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        matrixContainer.appendChild(table);
        stepDiv.appendChild(matrixContainer);

        // Add step details
        if (step.details) {
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'step-details';
            
            // Format details text
            let formattedDetails = step.details
                .replace(/Position \d+/g, match => `<strong>${match}</strong>`)
                .replace(/contribution = ([\d.-]+)/g, (_, value) => {
                    const numValue = parseFloat(value);
                    const className = step.details.includes('← BEST') && 
                                    step.details.includes(`contribution = ${value}`) 
                                    ? 'best-contribution' 
                                    : 'contribution';
                    return `contribution = <span class="${className}">${numValue.toFixed(2)}</span>`;
                })
                .replace(/bond\((.*?)\)/g, '<em>bond($1)</em>')
                .replace(/← BEST/g, '<span class="best-contribution">← BEST</span>')
                .replace(/\n/g, '<br>');

            detailsDiv.innerHTML = `<pre>${formattedDetails}</pre>`;
            stepDiv.appendChild(detailsDiv);
        }

        stepsContainer.appendChild(stepDiv);
        console.log(`Completed processing step ${stepIndex + 1}`);
    });

    console.log('=== END displayBEASteps ===');
}

// Helper function to create header cells
function createHeaderCell(text) {
    const th = document.createElement('th');
    th.className = 'matrix-header';
    th.textContent = text;
    return th;
}

// Utility function for deep copying arrays
function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
}

// Make functions available globally
window.runBEA = runBEA;
window.displayBEASteps = displayBEASteps; 