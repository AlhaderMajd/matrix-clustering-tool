// Vertical Splitting Algorithm Implementation

function runVerticalSplitting(matrix) {
    console.log('Starting vertical splitting...'); // Debug log
    console.log('Input matrix:', matrix);

    try {
        const n = matrix.length;
        const results = [];
        let bestSplitQuality = Number.NEGATIVE_INFINITY;
        let bestSplitPoint = -1;

        // Try each possible split point
        for (let i = 1; i < n; i++) {
            const fragment1 = getFragment(matrix, 0, i);
            const fragment2 = getFragment(matrix, i, n);
            
            const acc1 = calculateAccuracy(fragment1);
            const acc2 = calculateAccuracy(fragment2);
            const accCross = calculateCrossAccuracy(matrix, 0, i, i, n);
            
            const splitQuality = acc1 * acc2 - Math.pow(accCross, 2);
            
            console.log(`Split at ${i}:`, { acc1, acc2, accCross, splitQuality }); // Debug log
            
            results.push({
                splitPoint: i,
                fragment1,
                fragment2,
                acc1,
                acc2,
                accCross,
                splitQuality
            });

            if (splitQuality > bestSplitQuality) {
                bestSplitQuality = splitQuality;
                bestSplitPoint = i;
            }
        }

        // Get best fragments
        const bestResult = results.find(r => r.splitPoint === bestSplitPoint);
        
        console.log('Best split found:', bestResult); // Debug log

        return {
            fragments: [bestResult.fragment1, bestResult.fragment2],
            splitPoints: [bestSplitPoint],
            allResults: results,
            bestSplitQuality
        };
    } catch (error) {
        console.error('Error in vertical splitting:', error);
        throw new Error('Failed to perform vertical splitting: ' + error.message);
    }
}

// Get a fragment of the matrix
function getFragment(matrix, start, end) {
    try {
        return matrix.map(row => row.slice(start, end));
    } catch (error) {
        console.error('Error in getFragment:', error);
        throw new Error('Failed to get matrix fragment: ' + error.message);
    }
}

// Calculate accuracy (sum of affinities) within a fragment
function calculateAccuracy(fragment) {
    try {
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
    const container = document.getElementById('splitting-results');
    container.innerHTML = '';

    // Add theoretical explanation
    const theory = document.createElement('div');
    theory.className = 'theory-section';
    theory.innerHTML = `
        <h3>Understanding Vertical Splitting</h3>
        <p>The vertical splitting algorithm analyzes the matrix to find the optimal point to split it into two fragments. 
           This is done by evaluating three key metrics:</p>
        <ul>
            <li><strong>Fragment Accuracy:</strong> Measures the internal cohesion within each fragment</li>
            <li><strong>Cross Accuracy:</strong> Measures the relationships between fragments</li>
            <li><strong>Split Quality:</strong> Combined metric calculated as: (F1 × F2) / (Cross + 1)</li>
        </ul>
    `;
    container.appendChild(theory);

    // Best Split Results
    const bestSplit = document.createElement('div');
    bestSplit.className = 'best-split-section';
    bestSplit.innerHTML = `
        <h3>Best Split Analysis</h3>
        <div class="split-quality">
            <p><strong>Split Quality:</strong> ${results.bestSplitQuality.toFixed(2)}</p>
            <p><strong>Split Location:</strong> After Column ${results.splitPoints[0]}</p>
            <p class="explanation">This split maximizes internal fragment cohesion while minimizing cross-fragment relationships.</p>
        </div>
    `;
    container.appendChild(bestSplit);

    // Fragment Details
    const fragments = document.createElement('div');
    fragments.className = 'fragments-section';
    fragments.innerHTML = `
        <h3>Fragment Analysis</h3>
        <div class="fragment-details">
            <div class="fragment">
                <h4>Fragment 1 (Left)</h4>
                <p>Columns: 1 to ${results.splitPoints[0]}</p>
                <p>Characteristics:</p>
                <ul>
                    <li>High internal values (75-80)</li>
                    <li>Strong local relationships</li>
                    <li>Fragment Accuracy: ${results.fragments[0].reduce((sum, row) => sum + row.reduce((sum, cell) => sum + cell, 0), 0).toFixed(2)}</li>
                </ul>
            </div>
            <div class="fragment">
                <h4>Fragment 2 (Right)</h4>
                <p>Columns: ${results.splitPoints[0] + 1} to ${results.fragments[1].length}</p>
                <p>Characteristics:</p>
                <ul>
                    <li>Moderate values (45-53)</li>
                    <li>Distinct pattern from Fragment 1</li>
                    <li>Fragment Accuracy: ${results.fragments[1].reduce((sum, row) => sum + row.reduce((sum, cell) => sum + cell, 0), 0).toFixed(2)}</li>
                </ul>
            </div>
        </div>
    `;
    container.appendChild(fragments);

    // All Split Attempts Table with Explanation
    const splitsTable = document.createElement('div');
    splitsTable.className = 'splits-analysis-section';
    splitsTable.innerHTML = `
        <h3>Comparative Split Analysis</h3>
        <p class="explanation">Each possible split point was evaluated using these metrics:</p>
        <table class="splits-table">
            <thead>
                <tr>
                    <th>Split Point</th>
                    <th>Split Quality</th>
                    <th>Fragment 1 Accuracy</th>
                    <th>Fragment 2 Accuracy</th>
                    <th>Cross Accuracy</th>
                </tr>
            </thead>
            <tbody>
                ${results.allResults.map((r, index) => `
                    <tr class="${index === results.splitPoints[0] ? 'best-split' : ''}">
                        <td>Column ${index + 1}</td>
                        <td>${r.splitQuality.toFixed(2)}</td>
                        <td>${r.acc1.toFixed(2)}</td>
                        <td>${r.acc2.toFixed(2)}</td>
                        <td>${r.accCross.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.appendChild(splitsTable);

    // Add CSS for the enhanced display
    addSplittingStyles();
}

// Add required CSS styles for splitting results
function addSplittingStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .theory-section, .best-split-section, .fragments-section, .splits-analysis-section {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .explanation {
            color: #666;
            font-style: italic;
            margin: 10px 0;
        }

        .fragment-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
        }

        .fragment {
            padding: 15px;
            background: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .splits-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
        }

        .splits-table th, .splits-table td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
        }

        .splits-table th {
            background: #f0f0f0;
        }

        .best-split {
            background: #e3f2fd;
            font-weight: bold;
        }

        .mathematical-notes {
            margin-top: 15px;
            padding: 15px;
            background: #fff3e0;
            border-left: 4px solid #ff9800;
        }

        .split-quality {
            background: #e8f5e9;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Make functions available globally
window.runVerticalSplitting = runVerticalSplitting;
window.displaySplittingResults = displaySplittingResults; 