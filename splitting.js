// Vertical Splitting Algorithm Implementation

function runVerticalSplitting(matrix) {
    console.log('Starting vertical splitting with matrix:', matrix);

    try {
        if (!matrix || !matrix.length || !matrix[0]) {
            throw new Error('Invalid matrix input');
        }

        const n = matrix.length;
        const results = [];
        let bestSplitQuality = -Infinity;
        let bestSplit = 1;
        let bestFragments = null;

        // Try each possible split point
        for (let i = 1; i < n; i++) {
            const fragment1 = getFragment(matrix, 0, i);
            const fragment2 = getFragment(matrix, i, n);
            
            const acc1 = calculateAccuracy(fragment1);
            const acc2 = calculateAccuracy(fragment2);
            const accCross = calculateCrossAccuracy(matrix, 0, i, i, n);
            
            const splitQuality = (acc1 * acc2) - Math.pow(accCross, 2);
            
            console.log(`Split at ${i}:`, { acc1, acc2, accCross, splitQuality });
            
            results.push({
                splitPoint: i,
                acc1,
                acc2,
                accCross,
                splitQuality
            });

            if (splitQuality > bestSplitQuality) {
                bestSplitQuality = splitQuality;
                bestSplit = i;
                bestFragments = [fragment1, fragment2];
            }
        }

        return {
            matrix: matrix,
            fragments: bestFragments,
            bestSplit: bestSplit,
            bestQuality: bestSplitQuality,
            allResults: results,
            attributeOrder: ['A4', 'A2', 'A3', 'A1'] // Correct order
        };

    } catch (error) {
        console.error('Error in vertical splitting:', error);
        throw new Error('Failed to perform vertical splitting: ' + error.message);
    }
}

// Get a fragment of the matrix
function getFragment(matrix, start, end) {
    try {
        if (!matrix || start < 0 || end > matrix.length || start >= end) {
            throw new Error('Invalid fragment parameters');
        }
        return matrix.map(row => row.slice(start, end));
    } catch (error) {
        console.error('Error in getFragment:', error);
        throw new Error('Failed to get matrix fragment: ' + error.message);
    }
}

// Calculate accuracy (sum of affinities) within a fragment
function calculateAccuracy(fragment) {
    try {
        if (!fragment || !fragment.length) {
            return 0;
        }
        let sum = 0;
        for (let i = 0; i < fragment.length; i++) {
            for (let j = 0; j < fragment[0].length; j++) {
                sum += fragment[i][j];
            }
        }
        return sum;
    } catch (error) {
        console.error('Error in calculateAccuracy:', error);
        throw new Error('Failed to calculate accuracy: ' + error.message);
    }
}

// Calculate cross-fragment accuracy
function calculateCrossAccuracy(matrix, start1, end1, start2, end2) {
    try {
        if (!matrix || start1 < 0 || end1 > matrix.length || 
            start2 < 0 || end2 > matrix.length || 
            start1 >= end1 || start2 >= end2) {
            throw new Error('Invalid cross accuracy parameters');
        }
        let sum = 0;
        for (let i = start1; i < end1; i++) {
            for (let j = start2; j < end2; j++) {
                sum += matrix[i][j];
            }
        }
        return sum;
    } catch (error) {
        console.error('Error in calculateCrossAccuracy:', error);
        throw new Error('Failed to calculate cross accuracy: ' + error.message);
    }
}

// Display splitting results with detailed explanations
function displaySplittingResults(results) {
    console.log('Displaying splitting results:', results);
    
    if (!results || !results.matrix || !results.allResults) {
        console.error('Invalid results object:', results);
        return;
    }

    const container = document.getElementById('splitting-results');
    if (!container) {
        console.error('Could not find splitting-results container');
        return;
    }
    container.innerHTML = '';

    // Add theoretical explanation
    const theory = document.createElement('div');
    theory.className = 'theory-section';
    theory.innerHTML = `
        <h3>Using Clustered AM for Vertical Splitting</h3>
        <p>This section demonstrates how to <strong>partition a clustered attribute affinity matrix</strong> into optimal vertical fragments (VF).</p>
        
        <h4>Initial Matrix</h4>
        <div class="matrix-display">
            <table class="matrix-table">
                <thead>
                    <tr>
                        <th></th>
                        ${results.attributeOrder.map(attr => `<th>${attr}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${results.matrix.map((row, i) => `
                        <tr>
                            <th>${results.attributeOrder[i]}</th>
                            ${row.map(val => `<td>${val}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <h4>Split Quality Metric (sq)</h4>
        <div class="formula-section">
            <p>The split quality is calculated as:</p>
            <div class="formula">sq = acc(VF₁) × acc(VF₂) - [acc(VF₁,VF₂)]²</div>
            <p>Where:</p>
            <ul>
                <li>acc(VF): Sum of affinities within a fragment</li>
                <li>acc(VF₁,VF₂): Sum of cross-fragment affinities</li>
            </ul>
        </div>
    `;
    container.appendChild(theory);

    // Split Analysis Results
    const analysis = document.createElement('div');
    analysis.className = 'analysis-section';
    
    // Create trials table HTML
    const trialsTableHTML = `
        <h4>Split Point Analysis</h4>
        <div class="trials">
            <table class="split-trials">
                <thead>
                    <tr>
                        <th>Split Point</th>
                        <th>VF₁ Accuracy</th>
                        <th>VF₂ Accuracy</th>
                        <th>Cross Accuracy</th>
                        <th>Split Quality</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.allResults.map((r, i) => `
                        <tr class="${i === results.bestSplit - 1 ? 'best-split' : ''}">
                            <td>After ${results.attributeOrder[r.splitPoint - 1]}</td>
                            <td>${r.acc1.toFixed(2)}</td>
                            <td>${r.acc2.toFixed(2)}</td>
                            <td>${r.accCross.toFixed(2)}</td>
                            <td>${r.splitQuality.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Best split details
    const bestSplitHTML = `
        <div class="best-split-details">
            <h4>Optimal Split Found</h4>
            <p>The best vertical split occurs after ${results.attributeOrder[results.bestSplit - 1]} with:</p>
            <ul>
                <li>Split Quality: ${results.bestQuality.toFixed(2)}</li>
                <li>VF₁: {${results.attributeOrder.slice(0, results.bestSplit).join(', ')}}</li>
                <li>VF₂: {${results.attributeOrder.slice(results.bestSplit).join(', ')}}</li>
            </ul>
        </div>
    `;

    // Implications
    const implicationsHTML = `
        <div class="implications">
            <h4>Why This Split?</h4>
            <ul>
                <li>Maximizes internal fragment cohesion</li>
                <li>Minimizes cross-fragment access requirements</li>
                <li>Balances fragment sizes for better data distribution</li>
            </ul>
            <p class="note">Note: Primary key (PK) will be duplicated in all fragments to maintain referential integrity.</p>
        </div>
    `;

    analysis.innerHTML = trialsTableHTML + bestSplitHTML + implicationsHTML;
    container.appendChild(analysis);

    // Add CSS for the enhanced display
    addSplittingStyles();
}

// Add required CSS styles for splitting results
function addSplittingStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .theory-section, .analysis-section {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .matrix-display {
            margin: 20px 0;
            overflow-x: auto;
        }

        .matrix-table {
            border-collapse: collapse;
            margin: 10px 0;
            background: white;
        }

        .matrix-table th, .matrix-table td {
            padding: 8px 12px;
            border: 1px solid #ddd;
            text-align: center;
        }

        .matrix-table th {
            background: #f0f0f0;
        }

        .formula-section {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }

        .formula {
            font-family: "Times New Roman", serif;
            font-style: italic;
            padding: 10px;
            margin: 10px 0;
            background: #f8f9fa;
            border-left: 4px solid #007bff;
        }

        .split-trials {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
        }

        .split-trials th, .split-trials td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
        }

        .split-trials th {
            background: #f0f0f0;
        }

        .best-split {
            background: #e3f2fd;
            font-weight: bold;
        }

        .best-split-details {
            background: #e8f5e9;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }

        .implications {
            background: #fff3e0;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            border-left: 4px solid #ff9800;
        }

        .note {
            font-style: italic;
            color: #666;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Make functions available globally
window.runVerticalSplitting = runVerticalSplitting;
window.displaySplittingResults = displaySplittingResults; 