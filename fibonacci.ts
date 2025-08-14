
export function fibonacciRecursive(n: number): bigint {
    if (n <= 1) {
        return BigInt(n);
    }
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

export function fibonacciMemoization(n: number): bigint {
    const memo = new Map<number, bigint>();
    function fib(num: number): bigint {
        if (memo.has(num)) {
            return memo.get(num)!;
        }
        if (num <= 1) {
            return BigInt(num);
        }
        const result = fib(num - 1) + fib(num - 2);
        memo.set(num, result);
        return result;
    }
    return fib(n);
}

export function fibonacciMatrix(n: number): bigint {
    if (n <= 1) {
        return BigInt(n);
    }

    function multiply(F: [bigint, bigint, bigint, bigint], M: [bigint, bigint, bigint, bigint]): [bigint, bigint, bigint, bigint] {
        const x = F[0] * M[0] + F[1] * M[2];
        const y = F[0] * M[1] + F[1] * M[3];
        const z = F[2] * M[0] + F[3] * M[2];
        const w = F[2] * M[1] + F[3] * M[3];
        return [x, y, z, w];
    }

    function power(F: [bigint, bigint, bigint, bigint], num: number): [bigint, bigint, bigint, bigint] {
        if (num === 0 || num === 1) {
            return F;
        }
        const M: [bigint, bigint, bigint, bigint] = [1n, 1n, 1n, 0n];
        let result: [bigint, bigint, bigint, bigint] = [1n, 0n, 0n, 1n];
        let p = F;
        
        while(num > 0){
            if(num % 2 === 1){
                result = multiply(result, p);
            }
            p = multiply(p,p);
            num = Math.floor(num/2);
        }


        return result;
    }

    let F: [bigint, bigint, bigint, bigint] = [1n, 1n, 1n, 0n];
    F = power(F, n - 1);

    return F[0];
}
