import { create } from "zustand";
import { immer } from "@/middleware/immer";

const MAX_RANDOM_NUMBER = 100;
export const SCENES = {
    STAND_BY: "STAND_BY",
    EXECUTING: "EXECUTING",
    PAUSED: "PAUSED",
    STOPPING: "STOPPING",
};

export const THREAD_COLORS = [
    "rgb(255, 245, 157)", "rgb(239, 154, 154)", "rgb(165, 214, 167)", "rgb(144, 202, 249)", "rgb(206, 147, 216)",
    "rgb(244, 143, 177)", "rgb(159, 168, 218)", "rgb(128, 203, 196)", "rgb(255, 204, 128)", "rgb(230, 238, 156)",
    "rgb(255, 224, 130)", "rgb(255, 0, 255)", "rgb(128, 222, 234)", "rgb(255, 235, 238)", "rgb(225, 190, 231)",
    "rgb(255, 241, 118)", "rgb(229, 115, 115)", "rgb(129, 199, 132)", "rgb(100, 181, 246)", "rgb(186, 104, 200)",
    "rgb(240, 98, 146)", "rgb(121, 134, 203)", "rgb(77, 182, 172)", "rgb(255, 183, 77)", "rgb(220, 231, 117)",
    "rgb(255, 213, 79)", "rgb(255, 128, 171)", "rgb(77, 208, 225)", "rgb(252, 228, 236)", "rgb(243, 229, 245)",
    "rgb(255, 238, 88)", "rgb(239, 83, 80)", "rgb(102, 187, 106)", "rgb(66, 165, 245)", "rgb(171, 71, 188)",
    "rgb(236, 64, 122)", "rgb(92, 107, 192)", "rgb(38, 166, 154)", "rgb(255, 167, 38)", "rgb(212, 225, 87)",
    "rgb(255, 202, 40)", "rgb(245, 0, 87)", "rgb(38, 198, 218)", "rgb(255, 64, 129)", "rgb(213, 0, 249)",
    "rgb(244, 67, 54)", "rgb(76, 175, 80)", "rgb(33, 150, 243)", "rgb(156, 39, 176)", "rgb(233, 30, 99)",
    "rgb(63, 81, 181)", "rgb(0, 150, 136)", "rgb(255, 152, 0)", "rgb(205, 220, 57)", "rgb(255, 193, 7)",
    "rgb(255, 138, 128)", "rgb(0, 188, 212)", "rgb(255, 23, 68)", "rgb(170, 0, 255)", "rgb(103, 58, 183)",
    "rgb(253, 216, 53)", "rgb(229, 57, 53)", "rgb(67, 160, 71)", "rgb(30, 136, 229)", "rgb(142, 36, 170)",
    "rgb(216, 27, 96)", "rgb(57, 73, 171)", "rgb(0, 137, 123)", "rgb(251, 140, 0)", "rgb(192, 202, 51)",
    "rgb(255, 179, 0)", "rgb(255, 82, 82)", "rgb(0, 172, 193)", "rgb(255, 109, 0)", "rgb(48, 79, 254)",
    "rgb(194, 24, 91)", "rgb(48, 63, 159)", "rgb(0, 121, 107)", "rgb(245, 124, 0)", "rgb(175, 180, 43)",
    "rgb(255, 160, 0)", "rgb(255, 64, 129)", "rgb(0, 151, 167)", "rgb(194, 24, 91)", "rgb(48, 63, 159)",
    "rgb(97, 97, 97)", "rgb(117, 117, 117)", "rgb(96, 125, 139)", "rgb(109, 76, 65)", "rgb(29, 233, 182)",
    "rgb(255, 110, 64)", "rgb(62, 39, 35)", "rgb(255, 145, 0)", "rgb(255, 143, 0)", "rgb(78, 52, 46)",
    "rgb(66, 66, 66)", "rgb(55, 71, 79)", "rgb(33, 33, 33)", "rgb(61, 90, 254)", "rgb(255, 138, 101)"
];

export const getColorByThreadNumber = (threadNumber) => THREAD_COLORS[threadNumber % THREAD_COLORS.length];

const initializeMatrix = (m, n) =>
    Array.from({ length: m }, () =>
        Array.from({ length: n }, () => ({ value: 0, threadNumbers: [], writeCell: "" }))
    );

const oneToNMatrix = (m, n) => {
    let counter = 1;
    return Array.from({ length: m }, () =>
        Array.from({ length: n }, () => ({
            value: counter++,
            threadNumbers: [],
            writeCell: ""
        }))
    );
};

const randomMatrix = (m, n) => Array.from({ length: m }, () =>
    Array.from({ length: n }, () => ({
        value: Math.max(Math.floor(Math.random() * MAX_RANDOM_NUMBER), 1),
        threadNumbers: [],
        writeCell: ""
    }))
);

const store = (set) => ({
    scene: "STAND_BY",
    setScene: (newScene) => set((state) => {
        state.scene = newScene;
    }),

    // Dimensions for matrices
    matrixARows: 4,
    matrixACols: 4,
    matrixBRows: 4,
    matrixBCols: 4,

    threadNumber: 1,
    algorithm: 0,
    velocityMultiplier: 1,

    setMatricesDimensions: (mA, nA, mB, nB) => {
        // Optional: Ensure nA === mB for valid multiplication
        // If needed, you can enforce here or just assume it's done by the user.
        set((state) => {
            state.matrixARows = mA;
            state.matrixACols = nA;
            state.matrixBRows = mB;
            state.matrixBCols = nB;

            state.matrixA = initializeMatrix(mA, nA);
            state.matrixB = initializeMatrix(mB, nB);
            state.matrixC = initializeMatrix(mA, nB);
        });
    },

    setThreadNumber: (newNumber) => set((state) => { state.threadNumber = newNumber; }),
    setAlgorithm: (newNumber) => set((state) => { state.algorithm = newNumber; }),
    setVelocityMultiplier: (newNumber) => set((state) => { state.velocityMultiplier = newNumber; }),

    matrixA: initializeMatrix(4, 4),
    matrixB: initializeMatrix(4, 4),
    matrixC: initializeMatrix(4, 4),

    setMatrixACell: (i, j, value, threadNumber, writeCell) => set((state) => {
        const prevCell = state.matrixA[i][j];
        state.matrixA[i][j] = {
            value: value !== undefined ? value : prevCell.value,
            threadNumbers: [...prevCell.threadNumbers, threadNumber],
            writeCell: writeCell !== undefined ? writeCell : prevCell.writeCell,
        };
    }),

    setMatrixBCell: (i, j, value, threadNumber, writeCell) => set((state) => {
        const prevCell = state.matrixB[i][j];
        state.matrixB[i][j] = {
            value: value !== undefined ? value : prevCell.value,
            threadNumbers: [...prevCell.threadNumbers, threadNumber],
            writeCell: writeCell !== undefined ? writeCell : prevCell.writeCell,
        };
    }),

    cellsWrittenThisIteration: [],
    recordWriteForCurrentIteration: (cell) => set((state) => ({
        cellsWrittenThisIteration: [...state.cellsWrittenThisIteration, cell]
    })),
    resetWritesForCurrentIteration: () => set(() => ({
        cellsWrittenThisIteration: []
    })),

    setMatrixCCell: (i, j, value, threadNumber) => set((state) => {
        const prevCell = state.matrixC[i][j];
        const updatedThreadNumbers = threadNumber !== undefined
            ? [...prevCell.threadNumbers, threadNumber]
            : prevCell.threadNumbers;

        state.matrixC[i][j] = {
            value,
            threadNumbers: updatedThreadNumbers,
            writeCell: ""
        };
    }),

    randomizeMatrices: () => set((state) => {
        state.matrixA = randomMatrix(state.matrixARows, state.matrixACols);
        state.matrixB = randomMatrix(state.matrixBRows, state.matrixBCols);
        state.matrixC = initializeMatrix(state.matrixARows, state.matrixBCols);
    }),

    oneToNMatrices: () => set((state) => {
        state.matrixA = oneToNMatrix(state.matrixARows, state.matrixACols);
        state.matrixB = oneToNMatrix(state.matrixBRows, state.matrixBCols);
        state.matrixC = initializeMatrix(state.matrixARows, state.matrixBCols);
    }),

    resetMatrices: (mA, nA, mB, nB) => set((state) => {
        // Reset dimensions if provided, otherwise use current dimensions
        const rowsA = mA !== undefined ? mA : state.matrixARows;
        const colsA = nA !== undefined ? nA : state.matrixACols;
        const rowsB = mB !== undefined ? mB : state.matrixBRows;
        const colsB = nB !== undefined ? nB : state.matrixBCols;

        state.matrixA = initializeMatrix(rowsA, colsA);
        state.matrixB = initializeMatrix(rowsB, colsB);
        state.matrixC = initializeMatrix(rowsA, colsB);

        state.matrixARows = rowsA;
        state.matrixACols = colsA;
        state.matrixBRows = rowsB;
        state.matrixBCols = colsB;
    }),

    resetMatrixC: () => set((state) => {
        state.matrixC = initializeMatrix(state.matrixARows, state.matrixBCols);
    }),

    removeColorFromLastWriteAssociatedReads: () => set((state) => {
        if (state.cellsWrittenThisIteration.length < state.threadNumber) return;
        state.matrixA.forEach(row =>
            row.forEach(cell => {
                if (state.cellsWrittenThisIteration.includes(cell.writeCell)) {
                    cell.writeCell = "";
                    cell.threadNumbers = [];
                }
            })
        );
        state.matrixB.forEach(row =>
            row.forEach(cell => {
                if (state.cellsWrittenThisIteration.includes(cell.writeCell)) {
                    cell.writeCell = "";
                    cell.threadNumbers = [];
                }
            })
        );

        state.cellsWrittenThisIteration.forEach((cell) => {
            const [i, j] = cell.split("-");
            state.matrixC[i][j].grayOut = true;
        });

        state.cellsWrittenThisIteration = [];
    }),

    clearThreadsFromMatrices: () => set((state) => {
        state.matrixA.forEach(row =>
            row.forEach(cell => {
                cell.threadNumbers = [];
                cell.writeCell = "";
            })
        );

        state.matrixB.forEach(row =>
            row.forEach(cell => {
                cell.threadNumbers = [];
                cell.writeCell = "";
            })
        );
    }),

    workingThreads: [],
    addToWorkingThreads: (threadNumber, mode) => set((state) => {
        const existingThread = state.workingThreads.find(el => el.threadNumber === threadNumber);

        if (existingThread) {
            return {
                workingThreads: state.workingThreads.map(el =>
                    el.threadNumber === threadNumber
                        ? { ...el, [mode]: el[mode] + 1 }
                        : el
                )
            };
        }
        return {
            workingThreads: [
                ...state.workingThreads,
                { threadNumber, r: mode === 'r' ? 1 : 0, w: mode === 'w' ? 1 : 0 }
            ]
        };
    }),

    clearWorkingThreads: () => set((state) => {
        state.workingThreads = [];
    })
});

export default create(immer(store));
