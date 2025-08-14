import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { fibonacciRecursive, fibonacciMemoization, fibonacciMatrix } from './fibonacci.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, '../public')));

wss.on('connection', (ws) => {
    console.log('Client connected');

    const N_VALUES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];

    async function runCalculations() {
        for (const n of N_VALUES) {
            // --- Recursive ---
            if (n <= 40) {
                const startTime = process.hrtime.bigint();
                const result = fibonacciRecursive(n);
                const endTime = process.hrtime.bigint();
                const time = Number(endTime - startTime) / 1e6;
                ws.send(JSON.stringify({ method: 'recursive', n, time, result: result.toString() }));
                await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay
            }

            // --- Memoization ---
            const startTimeMemo = process.hrtime.bigint();
            const resultMemo = fibonacciMemoization(n);
            const endTimeMemo = process.hrtime.bigint();
            const timeMemo = Number(endTimeMemo - startTimeMemo) / 1e6;
            ws.send(JSON.stringify({ method: 'memoization', n, time: timeMemo, result: resultMemo.toString() }));
            await new Promise(resolve => setTimeout(resolve, 100)); 

            // --- Matrix ---
            const startTimeMatrix = process.hrtime.bigint();
            const resultMatrix = fibonacciMatrix(n);
            const endTimeMatrix = process.hrtime.bigint();
            const timeMatrix = Number(endTimeMatrix - startTimeMatrix) / 1e6;
            ws.send(JSON.stringify({ method: 'matrix', n, time: timeMatrix, result: resultMatrix.toString() }));
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    runCalculations();

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
