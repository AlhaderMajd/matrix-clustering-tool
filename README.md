# Matrix Clustering and Vertical Splitting Tool

A web-based tool for analyzing and clustering attribute affinity matrices using the Bond Energy Algorithm (BEA) and performing vertical splitting for database fragmentation.

## Features

1. **Matrix Input**
   - Upload CSV files containing n x n attribute affinity matrices
   - Create matrices directly in the browser using an interactive grid
   - Support for matrices of size 2x2 up to 10x10

2. **Bond Energy Algorithm (BEA)**
   - Step-by-step visualization of the clustering process
   - Calculation of contribution values using the formula:
     ```
     cont(Ai, Ak, Aj) = bond(Ai, Ak) + bond(Ak, Aj) - bond(Ai, Aj)
     ```
   - Display of intermediate and final clustered matrices

3. **Vertical Splitting**
   - Calculation of split quality (sq) for all possible fragmentation points
   - Split quality formula:
     ```
     sq = acc(VF1) × acc(VF2) - (acc(VF1, VF2))²
     ```
   - Display of fragment details and split quality metrics

4. **Visualization**
   - Heatmap representation of matrices
   - Color-coded affinity values
   - Visual indicators for fragmentation boundaries
   - Interactive legend

## Usage

1. **Input Your Matrix**
   - Option 1: Upload a CSV file
     - File should contain only numbers
     - Must be a square matrix (n x n)
     - Values should be comma-separated
   - Option 2: Create matrix in browser
     - Select matrix size (2-10)
     - Click "Create Grid"
     - Enter values manually

2. **Process the Matrix**
   - Click "Process Matrix" to start the analysis
   - View BEA clustering steps
   - Examine vertical splitting results
   - Analyze the heatmap visualization

3. **Export Results**
   - Use the "Export Results" button to download:
     - Original matrix
     - Clustered matrix
     - Fragment details
     - Split quality metrics

## CSV Format Example

```csv
4,2,1,5
2,3,0,4
1,0,5,2
5,4,2,3
```

## Implementation Details

The tool is built using vanilla JavaScript, HTML, and CSS, with no external dependencies. Key algorithms:

1. **Bond Energy Algorithm (BEA)**
   - Iteratively places columns to maximize bond energy
   - Calculates contribution values for each possible placement
   - Maintains step-by-step history for visualization

2. **Vertical Splitting**
   - Evaluates all possible split points
   - Calculates fragment accuracies and cross-fragment relationships
   - Determines optimal split based on split quality metric

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. No server required - runs entirely in the browser

## License

MIT License - Feel free to use, modify, and distribute this tool. 