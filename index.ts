const { fibonacciRecursive, fibonacciMemoization, fibonacciMatrix } = require('./fibonacci');
const { generateChart } = require('./chart');

const N_VALUES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];

const results = {
    recursive: [] as { n: number, time: number }[],
    memoization: [] as { n: number, time: number }[],
    matrix: [] as { n: number, time: number }[],
};

let largestN = {
    recursive: 0,
    memoization: 0,
    matrix: 0,
};

console.log('Calculating Fibonacci numbers...');

for (const n of N_VALUES) {
    // --- Recursive ---
    if (n <= 40) { // Limit recursive to avoid excessive execution time
        try {
            const startTime = process.hrtime.bigint();
            const result = fibonacciRecursive(n);
            const endTime = process.hrtime.bigint();
            const time = Number(endTime - startTime) / 1e6; // in ms
            results.recursive.push({ n, time });
            largestN.recursive = n;
            console.log(`Recursive F(${n}) = ${result} (took ${time.toFixed(3)}ms)`);
        } catch (e) {
            console.log(`Recursive F(${n}) failed.`);
        }
    }

    // --- Memoization ---
    try {
        const startTime = process.hrtime.bigint();
        const result = fibonacciMemoization(n);
        const endTime = process.hrtime.bigint();
        const time = Number(endTime - startTime) / 1e6; // in ms
        results.memoization.push({ n, time });
        largestN.memoization = n;
        console.log(`Memoization F(${n}) = ${result} (took ${time.toFixed(3)}ms)`);
    } catch (e) {
        console.log(`Memoization F(${n}) failed.`);
    }


    // --- Matrix ---
    try {
        const startTime = process.hrtime.bigint();
        const result = fibonacciMatrix(n);
        const endTime = process.hrtime.bigint();
        const time = Number(endTime - startTime) / 1e6; // in ms
        results.matrix.push({ n, time });
        largestN.matrix = n;
        console.log(`Matrix F(${n}) = ${result} (took ${time.toFixed(3)}ms)`);
    } catch (e) {
        console.log(`Matrix F(${n}) failed.`);
    }
    console.log('---');
}

console.log("\nLargest Fibonacci number calculated for each method:");
console.log(`Recursive: F(${largestN.recursive})`);
console.log(`Memoization: F(${largestN.memoization})`);
console.log(`Matrix: F(${largestN.matrix})`);

// The chart generation will be handled in the next step.
// For now, we will just print the results.
console.log("\nExecution time results (in ms):");
console.log(JSON.stringify(results, null, 2));

generateChart(results);
