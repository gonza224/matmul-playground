const iterative_code = `
void iterative(int** matrixA, int** matrixB, int** matrixC, int matrixARows, int matrixBRows, int matrixBCols, int numThreads,
               shared_ptr<WsServer::Connection> connection, MatrixContext &context) {
    #pragma omp parallel for collapse(3) num_threads(numThreads)
    for (int i = 0; i < matrixARows; i++) {
        for (int j = 0; j < matrixBCols; j++) {
            for (int k = 0; k < matrixBRows; k++) {
                #pragma omp atomic
                matrixC[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
}`

const recursive_code = `
void recursive(int** matrixA, int** matrixB, int** matrixC,
               int iStart, int iEnd, int jStart, int jEnd, int kStart, int kEnd) {
    if (iStart == iEnd && jStart == jEnd && kStart == kEnd) {
        matrixC[iStart][jStart] += matrixA[iStart][kStart] * matrixB[kStart][jStart];
        return;
    }

    int midI = (iStart + iEnd) / 2;
    int midJ = (jStart + jEnd) / 2;
    int midK = (kStart + kEnd) / 2;

    if (iStart > iEnd || jStart > jEnd || kStart > kEnd) return;

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, iStart, midI, jStart, midJ, kStart, midK, context);

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, iStart, midI, midJ + 1, jEnd, kStart, midK, context);

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, midI + 1, iEnd, jStart, midJ, kStart, midK, context);

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, midI + 1, iEnd, midJ + 1, jEnd, kStart, midK, context);

    #pragma omp taskwait

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, iStart, midI, jStart, midJ, midK + 1, kEnd, context);

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, iStart, midI, midJ + 1, jEnd, midK + 1, kEnd, context);

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, midI + 1, iEnd, jStart, midJ, midK + 1, kEnd, context);

    #pragma omp task
    recursive(matrixA, matrixB, matrixC, midI + 1, iEnd, midJ + 1, jEnd, midK + 1, kEnd, context);

    #pragma omp taskwait
}`

export const algorithms = [
    { value: 0, label: "Iterative Matmul", code: iterative_code },
    { value: 1, label: "Recursive Matmul", code: recursive_code },
];
