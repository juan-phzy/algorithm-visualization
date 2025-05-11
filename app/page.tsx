"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

interface SortingStep {
    array: number[];
    currentIndex?: number;
    compareIndex?: number;
    mergeIndices?: { start: number; mid: number; end: number };
    sortedIndices?: number[];
    swappedIndices?: [number, number];
}

export default function SortingVisualizer() {
    const [inputArray, setInputArray] = useState<string>("");
    const [array, setArray] = useState<number[]>([]);
    const [selectionSortSteps, setSelectionSortSteps] = useState<SortingStep[]>(
        []
    );
    const [mergeSortSteps, setMergeSortSteps] = useState<SortingStep[]>([]);
    const [selectionSortCurrentStep, setSelectionSortCurrentStep] =
        useState<number>(0);
    const [mergeSortCurrentStep, setMergeSortCurrentStep] = useState<number>(0);
    const [selectionSortPlaying, setSelectionSortPlaying] =
        useState<boolean>(false);
    const [mergeSortPlaying, setMergeSortPlaying] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(500);

    const selectionSortIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const mergeSortIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (array.length > 0) {
            const selectionSteps = generateSelectionSortSteps([...array]);
            const mergeSteps = generateMergeSortSteps([...array]);

            setSelectionSortSteps(selectionSteps);
            setMergeSortSteps(mergeSteps);
            setSelectionSortCurrentStep(0);
            setMergeSortCurrentStep(0);

            stopSelectionSortAnimation();
            stopMergeSortAnimation();
        }
    }, [array]);

    useEffect(() => {
        if (selectionSortPlaying) {
            selectionSortIntervalRef.current = setInterval(() => {
                setSelectionSortCurrentStep((prevStep) => {
                    if (prevStep >= selectionSortSteps.length - 1) {
                        stopSelectionSortAnimation();
                        return selectionSortSteps.length - 1;
                    }
                    return prevStep + 1;
                });
            }, speed);
        }

        return () => {
            if (selectionSortIntervalRef.current) {
                clearInterval(selectionSortIntervalRef.current);
            }
        };
    }, [selectionSortPlaying, selectionSortSteps.length, speed]);

    useEffect(() => {
        if (mergeSortPlaying) {
            mergeSortIntervalRef.current = setInterval(() => {
                setMergeSortCurrentStep((prevStep) => {
                    if (prevStep >= mergeSortSteps.length - 1) {
                        stopMergeSortAnimation();
                        return mergeSortSteps.length - 1;
                    }
                    return prevStep + 1;
                });
            }, speed);
        }

        return () => {
            if (mergeSortIntervalRef.current) {
                clearInterval(mergeSortIntervalRef.current);
            }
        };
    }, [mergeSortPlaying, mergeSortSteps.length, speed]);

    const stopSelectionSortAnimation = () => {
        if (selectionSortIntervalRef.current) {
            clearInterval(selectionSortIntervalRef.current);
            selectionSortIntervalRef.current = null;
        }
        setSelectionSortPlaying(false);
    };

    const stopMergeSortAnimation = () => {
        if (mergeSortIntervalRef.current) {
            clearInterval(mergeSortIntervalRef.current);
            mergeSortIntervalRef.current = null;
        }
        setMergeSortPlaying(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputArray(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newArray = inputArray
                .split(",")
                .map((item) => parseFloat(item.trim()))
                .filter((num) => !isNaN(num));

            if (newArray.length < 2) {
                alert("Please enter at least 2 numbers");
                return;
            }

            setArray(newArray);
        } catch (error) {
            console.error("Error parsing input:", error);
            alert("Invalid input. Please enter numbers separated by commas.");
        }
    };

    const generateRandomArray = () => {
        const size = Math.floor(Math.random() * 11) + 5;
        const randomArray = Array.from(
            { length: size },
            () => Math.floor(Math.random() * 100) + 1
        );
        setInputArray(randomArray.join(", "));
        setArray(randomArray);
    };

    const toggleSelectionSortPlay = () => {
        if (selectionSortPlaying) {
            stopSelectionSortAnimation();
        } else {
            setSelectionSortPlaying(true);
        }
    };

    const toggleMergeSortPlay = () => {
        if (mergeSortPlaying) {
            stopMergeSortAnimation();
        } else {
            setMergeSortPlaying(true);
        }
    };

    const handleSelectionSortStepForward = () => {
        stopSelectionSortAnimation();
        if (selectionSortCurrentStep < selectionSortSteps.length - 1) {
            setSelectionSortCurrentStep(selectionSortCurrentStep + 1);
        }
    };

    const handleSelectionSortStepBackward = () => {
        stopSelectionSortAnimation();
        if (selectionSortCurrentStep > 0) {
            setSelectionSortCurrentStep(selectionSortCurrentStep - 1);
        }
    };

    const handleMergeSortStepForward = () => {
        stopMergeSortAnimation();
        if (mergeSortCurrentStep < mergeSortSteps.length - 1) {
            setMergeSortCurrentStep(mergeSortCurrentStep + 1);
        }
    };

    const handleMergeSortStepBackward = () => {
        stopMergeSortAnimation();
        if (mergeSortCurrentStep > 0) {
            setMergeSortCurrentStep(mergeSortCurrentStep - 1);
        }
    };

    const generateSelectionSortSteps = (arr: number[]): SortingStep[] => {
        const steps: SortingStep[] = [{ array: [...arr] }];
        const n = arr.length;

        const sortedIndices: number[] = [];

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            steps.push({
                array: [...arr],
                currentIndex: i,
                sortedIndices: [...sortedIndices],
            });

            for (let j = i + 1; j < n; j++) {
                steps.push({
                    array: [...arr],
                    currentIndex: i,
                    compareIndex: j,
                    sortedIndices: [...sortedIndices],
                });

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                    steps.push({
                        array: [...arr],
                        currentIndex: i,
                        compareIndex: j,
                        sortedIndices: [...sortedIndices],
                    });
                }
            }

            if (minIndex !== i) {
                steps.push({
                    array: [...arr],
                    currentIndex: i,
                    compareIndex: minIndex,
                    swappedIndices: [i, minIndex],
                    sortedIndices: [...sortedIndices],
                });

                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

                steps.push({
                    array: [...arr],
                    currentIndex: i,
                    sortedIndices: [...sortedIndices],
                });
            }

            sortedIndices.push(i);

            steps.push({
                array: [...arr],
                sortedIndices: [...sortedIndices],
            });
        }

        sortedIndices.push(n - 1);
        steps.push({
            array: [...arr],
            sortedIndices: [...sortedIndices],
        });

        return steps;
    };

    const generateMergeSortSteps = (arr: number[]): SortingStep[] => {
        const steps: SortingStep[] = [{ array: [...arr] }];
        const arrCopy = [...arr];
        const sortedIndices: number[] = [];

        const mergeSortHelper = (start: number, end: number) => {
            if (end - start <= 0) return;

            const mid = Math.floor((start + end) / 2);

            steps.push({
                array: [...arrCopy],
                mergeIndices: { start, mid, end },
                sortedIndices: [...sortedIndices],
            });

            mergeSortHelper(start, mid);
            mergeSortHelper(mid + 1, end);

            const leftArr = arrCopy.slice(start, mid + 1);
            const rightArr = arrCopy.slice(mid + 1, end + 1);

            steps.push({
                array: [...arrCopy],
                mergeIndices: { start, mid, end },
                sortedIndices: [...sortedIndices],
            });

            let i = 0,
                j = 0,
                k = start;

            while (i < leftArr.length && j < rightArr.length) {
                steps.push({
                    array: [...arrCopy],
                    compareIndex: k,
                    mergeIndices: { start, mid, end },
                    sortedIndices: [...sortedIndices],
                });

                if (leftArr[i] <= rightArr[j]) {
                    arrCopy[k] = leftArr[i];
                    i++;
                } else {
                    arrCopy[k] = rightArr[j];
                    j++;
                }

                steps.push({
                    array: [...arrCopy],
                    currentIndex: k,
                    mergeIndices: { start, mid, end },
                    sortedIndices: [...sortedIndices],
                });

                k++;
            }

            while (i < leftArr.length) {
                arrCopy[k] = leftArr[i];
                steps.push({
                    array: [...arrCopy],
                    currentIndex: k,
                    mergeIndices: { start, mid, end },
                    sortedIndices: [...sortedIndices],
                });
                i++;
                k++;
            }

            while (j < rightArr.length) {
                arrCopy[k] = rightArr[j];
                steps.push({
                    array: [...arrCopy],
                    currentIndex: k,
                    mergeIndices: { start, mid, end },
                    sortedIndices: [...sortedIndices],
                });
                j++;
                k++;
            }

            for (let idx = start; idx <= end; idx++) {
                if (!sortedIndices.includes(idx)) {
                    sortedIndices.push(idx);
                }
            }

            steps.push({
                array: [...arrCopy],
                mergeIndices: { start, mid, end },
                sortedIndices: [...sortedIndices.sort((a, b) => a - b)],
            });
        };

        if (arr.length > 1) {
            mergeSortHelper(0, arr.length - 1);
        }

        steps.push({
            array: [...arrCopy],
            sortedIndices: Array.from({ length: arrCopy.length }, (_, i) => i),
        });

        return steps;
    };

    const renderArrayBars = (currentStep: SortingStep) => {
        const {
            array,
            currentIndex,
            compareIndex,
            sortedIndices = [],
            swappedIndices = [-1, -1],
        } = currentStep;
        const maxValue = Math.max(...array, 1);

        return array.map((value, index) => {
            let barClass = styles.bar;

            if (sortedIndices.includes(index)) {
                barClass = `${styles.bar} ${styles.sorted}`;
            } else if (index === currentIndex) {
                barClass = `${styles.bar} ${styles.current}`;
            } else if (index === compareIndex) {
                barClass = `${styles.bar} ${styles.compare}`;
            } else if (
                swappedIndices[0] === index ||
                swappedIndices[1] === index
            ) {
                barClass = `${styles.bar} ${styles.swap}`;
            }

            return (
                <div
                    key={"index" + index}
                    className={barClass}
                    style={{
                        height: `${(value / maxValue) * 100}%`,
                    }}
                >
                    <span className={styles.barValue}>{value}</span>
                </div>
            );
        });
    };

    const renderMergeSortArrayBars = (currentStep: SortingStep) => {
        const {
            array,
            currentIndex,
            compareIndex,
            mergeIndices,
            sortedIndices = [],
        } = currentStep;
        const maxValue = Math.max(...array, 1);

        return array.map((value, index) => {
            let barClass = styles.bar;

            const isInLeftSubarray =
                mergeIndices &&
                index >= mergeIndices.start &&
                index <= mergeIndices.mid;

            const isInRightSubarray =
                mergeIndices &&
                index > mergeIndices.mid &&
                index <= mergeIndices.end;

            if (sortedIndices.includes(index)) {
                barClass = `${styles.bar} ${styles.sorted}`;
            } else if (index === currentIndex) {
                barClass = `${styles.bar} ${styles.current}`;
            } else if (index === compareIndex) {
                barClass = `${styles.bar} ${styles.compare}`;
            } else if (isInLeftSubarray) {
                barClass = `${styles.bar} ${styles.leftSubarray}`;
            } else if (isInRightSubarray) {
                barClass = `${styles.bar} ${styles.rightSubarray}`;
            }

            return (
                <div
                    key={"ind" + index}
                    className={barClass}
                    style={{
                        height: `${(value / maxValue) * 100}%`,
                    }}
                >
                    <span className={styles.barValue}>{value}</span>
                </div>
            );
        });
    };

    const renderColorLegend = (type: "selection" | "merge") => {
        return (
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div
                        className={`${styles.legendBox} ${styles.current}`}
                    ></div>
                    <span>Current Position</span>
                </div>
                <div className={styles.legendItem}>
                    <div
                        className={`${styles.legendBox} ${styles.compare}`}
                    ></div>
                    <span>Comparing</span>
                </div>
                <div className={styles.legendItem}>
                    <div
                        className={`${styles.legendBox} ${styles.sorted}`}
                    ></div>
                    <span>Sorted</span>
                </div>
                {type === "merge" && (
                    <>
                        <div className={styles.legendItem}>
                            <div
                                className={`${styles.legendBox} ${styles.leftSubarray}`}
                            ></div>
                            <span>Left Subarray</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div
                                className={`${styles.legendBox} ${styles.rightSubarray}`}
                            ></div>
                            <span>Right Subarray</span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Sorting Algorithm Visualizer</h1>
                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <input
                        type="text"
                        value={inputArray}
                        onChange={handleInputChange}
                        placeholder="Enter numbers separated by commas (e.g., 5, 3, 8, 1, 2)"
                        className={styles.input}
                    />
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.button}>
                            Reset Sorted
                        </button>
                        <button
                            type="button"
                            onClick={generateRandomArray}
                            className={styles.button}
                        >
                            Generate Random
                        </button>
                    </div>
                    <div className={styles.speedControl}>
                        <label htmlFor="speed">Animation Speed:</label>
                        <input
                            type="range"
                            id="speed"
                            min="50"
                            max="800"
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                        />
                    </div>
                </form>
            </header>

            <section className={styles.algorithmSection}>
                <h2>Selection Sort (Brute Force)</h2>
                <div className={styles.description}>
                    <p>
                        {`Selection Sort is a simple brute-force sorting algorithm
                        that repeatedly finds the minimum element from the
                        unsorted part of the array and puts it at the beginning.
                        The algorithm divides the input array into two parts:
                        the sorted subarray and the unsorted subarray.`}
                    </p>
                    <p>
                        <strong>Time Complexity:</strong>{" "}
                        {`O(n²) for both best
                        and worst cases, making it inefficient for large arrays.`}
                    </p>
                    <p>
                        <strong>Limitations:</strong>{" "}
                        {`Selection sort always
                        performs O(n²) comparisons making it inefficient for
                        large datasets. It does not adapt to the data being
                        sorted (i.e., its runtime is the same regardless of the
                        input). Its main advantage is simplicity and minimal
                        memory usage.`}
                    </p>
                </div>

                <div className={styles.visualizerContainer}>
                    <div className={styles.barContainer}>
                        {selectionSortSteps.length > 0 &&
                            renderArrayBars(
                                selectionSortSteps[selectionSortCurrentStep]
                            )}
                    </div>
                    {renderColorLegend("selection")}
                    <div className={styles.controls}>
                        <button
                            onClick={handleSelectionSortStepBackward}
                            disabled={selectionSortCurrentStep === 0}
                            className={styles.controlButton}
                        >
                            &lt;
                        </button>
                        <button
                            onClick={toggleSelectionSortPlay}
                            className={styles.controlButton}
                        >
                            {selectionSortPlaying ? "Pause" : "Play"}
                        </button>
                        <button
                            onClick={handleSelectionSortStepForward}
                            disabled={
                                selectionSortCurrentStep ===
                                selectionSortSteps.length - 1
                            }
                            className={styles.controlButton}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className={styles.stepInfo}>
                        Step {selectionSortCurrentStep + 1} of{" "}
                        {selectionSortSteps.length}
                    </div>
                </div>
            </section>

            <section className={styles.algorithmSection}>
                <h2>Merge Sort (Divide and Conquer, Recursive)</h2>
                <div className={styles.description}>
                    <p>
                        {`Merge Sort is an efficient, divide-and-conquer algorithm
                        that divides the input array into two halves,
                        recursively sorts them, and then merges the sorted
                        halves. Its recursive approach creates a tree of
                        subproblems, solving them from the bottom up.`}
                    </p>
                    <p>
                        <strong>Time Complexity:</strong>{" "}
                        {`O(n log n) for all
                        cases (best, average, worst).`}
                    </p>
                    <p>
                        <strong>Limitations:</strong>{" "}
                        {`While more efficient than
                        selection sort, merge sort requires additional O(n)
                        space for the merging process, making it less
                        memory-efficient than in-place sorting algorithms. It's
                        excellent for large datasets but might be overkill for
                        very small arrays where simpler algorithms can perform
                        better due to lower constant factors.`}
                    </p>
                </div>

                <div className={styles.visualizerContainer}>
                    <div className={styles.barContainer}>
                        {mergeSortSteps.length > 0 &&
                            renderMergeSortArrayBars(
                                mergeSortSteps[mergeSortCurrentStep]
                            )}
                    </div>
                    {renderColorLegend("merge")}
                    <div className={styles.controls}>
                        <button
                            onClick={handleMergeSortStepBackward}
                            disabled={mergeSortCurrentStep === 0}
                            className={styles.controlButton}
                        >
                            &lt;
                        </button>
                        <button
                            onClick={toggleMergeSortPlay}
                            className={styles.controlButton}
                        >
                            {mergeSortPlaying ? "Pause" : "Play"}
                        </button>
                        <button
                            onClick={handleMergeSortStepForward}
                            disabled={
                                mergeSortCurrentStep ===
                                mergeSortSteps.length - 1
                            }
                            className={styles.controlButton}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className={styles.stepInfo}>
                        Step {mergeSortCurrentStep + 1} of{" "}
                        {mergeSortSteps.length}
                    </div>
                </div>
            </section>
        </div>
    );
}
