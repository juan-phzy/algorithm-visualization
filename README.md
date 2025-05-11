# Sorting Algorithm Visualizer


## CSCI-335: Design and Analysis of Algorithms

This project provides an interactive visualization of two fundamental sorting algorithms: Selection Sort (brute force) and Merge Sort (divide and conquer). It was created as part of the CSCI-335 course to demonstrate algorithm implementation, time complexity analysis, and visual representation of algorithm execution.

You can view the app at:


https://algorithm-visualization-five.vercel.app/

## Features

- **Interactive Array Input**: Enter custom arrays or generate random ones
- **Selection Sort Visualization**: Step-by-step visualization of the brute-force approach
- **Merge Sort Visualization**: Step-by-step visualization of the divide-and-conquer approach
- **Playback Controls**: Play, pause, and scrub through each algorithm's execution
- **Visual Comparison**: Compare algorithm efficiency through side-by-side visualization
- **Time Complexity Information**: Educational descriptions of each algorithm's efficiency
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Next.js**: React framework for building the application
- **React**: Frontend library for UI components and state management
- **TypeScript**: Type-safe JavaScript for reliable code
- **CSS Modules**: Scoped styling for components

## Implementation Details

### Selection Sort

Selection Sort is implemented as a brute-force approach with the following characteristics:
- **Time Complexity**: O(n²) for both best and worst cases
- **Space Complexity**: O(1)
- **Visual Features**: Highlights current position, comparisons, swaps, and sorted elements

### Merge Sort

Merge Sort is implemented using a divide-and-conquer approach with the following characteristics:
- **Time Complexity**: O(n log n) for all cases
- **Space Complexity**: O(n)
- **Visual Features**: Highlights subarray divisions, comparisons, and merging operations

## Usage

1. Enter numbers separated by commas in the input field or click "Generate Random" for a random array
2. Click "Sort" to prepare the algorithms
3. Use the playback controls to visualize the sorting process:
   - Play/Pause: Start or pause the animation
   - Step Forward/Backward: Move through the algorithm one step at a time
4. Observe the color-coded visualization to understand how each algorithm works
5. Adjust animation speed using the slider control