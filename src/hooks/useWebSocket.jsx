import { useEffect, useRef, useCallback } from 'react';
import useMatrixStore, { SCENES } from '@/stores/matrixStore';

const useWebSocket = (url) => {
    const ws = useRef(null);

    const scene = useMatrixStore((state) => state.scene);
    const setScene = useMatrixStore((state) => state.setScene);

    const matrixA = useMatrixStore((state) => state.matrixA);
    const matrixB = useMatrixStore((state) => state.matrixB);

    const setMatrixACell = useMatrixStore((state) => state.setMatrixACell);
    const setMatrixBCell = useMatrixStore((state) => state.setMatrixBCell);
    const setMatrixCCell = useMatrixStore((state) => state.setMatrixCCell);
    const resetMatrixC = useMatrixStore((state) => state.resetMatrixC);

    const cellsWrittenThisIteration = useMatrixStore((state) => state.cellsWrittenThisIteration);
    const recordWriteForCurrentIteration = useMatrixStore((state) => state.recordWriteForCurrentIteration);
    const resetWritesForCurrentIteration = useMatrixStore((state) => state.resetWritesForCurrentIteration);

    const removeColorFromLastWriteAssociatedReads = useMatrixStore((state) => state.removeColorFromLastWriteAssociatedReads);
    const clearThreadsFromMatrices = useMatrixStore((state) => state.clearThreadsFromMatrices);
    const addToWorkingThreads = useMatrixStore((state) => state.addToWorkingThreads);
    const clearWorkingThreads = useMatrixStore((state) => state.clearWorkingThreads);

    const onVelocityChange = () => {
        ws.current.send(JSON.stringify({ velocityMultiplier: useMatrixStore.getState().velocityMultiplier }));
    }

    const sendData = (isStop = false) => {
        if (scene === SCENES.EXECUTING) {
            if (isStop) {
                setScene(SCENES.STOPPING);
                ws.current.send(JSON.stringify({ action: "STOP" }));
                return;
            }

            setScene(SCENES.PAUSED);
            ws.current.send(JSON.stringify({ action: "PAUSE" }));
            return;
        }

        if (scene === SCENES.PAUSED) {
            setScene(SCENES.EXECUTING);
            ws.current.send(JSON.stringify({ action: "UNPAUSE" }));
            return;
        }

        const matrixARows = useMatrixStore.getState().matrixARows;
        const matrixACols = useMatrixStore.getState().matrixACols;
        const matrixBRows = useMatrixStore.getState().matrixBRows;
        const matrixBCols = useMatrixStore.getState().matrixBCols;
        const matrixA = useMatrixStore.getState().matrixA;
        const matrixB = useMatrixStore.getState().matrixB;
        const threadNumber = useMatrixStore.getState().threadNumber;
        const algorithm = useMatrixStore.getState().algorithm;
        resetMatrixC();
        clearThreadsFromMatrices();
        resetWritesForCurrentIteration();
        clearWorkingThreads();

        const transformedMatrixA = matrixA.map(row => row.map(cell => cell.value));
        const transformedMatrixB = matrixB.map(row => row.map(cell => cell.value));

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const dataToSend = {
                action: "PLAY",
                matrixARows: matrixARows,
                matrixACols: matrixACols,
                matrixBRows: matrixBRows,
                matrixBCols: matrixBCols,
                numThreads: threadNumber,
                matrix1: transformedMatrixA,
                matrix2: transformedMatrixB,
                algorithm
            };
            ws.current.send(JSON.stringify(dataToSend));
            setScene(SCENES.EXECUTING);
        }
    };

    const resetWebSocket = () => {
        if (ws.current)
            ws.current.close();
        ws.current = new WebSocket(url);
    }

    useEffect(() => {
        resetWebSocket();
        ws.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        const messageQueue = [];
        ws.current.onmessage = (event) => {
            messageQueue.push(JSON.parse(event.data));
            processMessageQueue();
        };

        function processMessageQueue() {
            if (messageQueue.length > 0) {
                const data = messageQueue.shift();

                const threadNumber = data.threadInfo?.number;
                if (data.actions) {
                    data.actions.forEach((action) => {
                        const { i, j } = action.indices;
                        const matrix = action.matrix;

                        if (matrix === "C") {
                            if (action.action === "write") {
                                const value = action.value;
                                console.log(`Write to Matrix C at (${i}, ${j}) by Thread ${threadNumber}`);
                                removeColorFromLastWriteAssociatedReads();

                                setMatrixCCell(i, j, value, threadNumber);
                                recordWriteForCurrentIteration(`${i}-${j}`);
                                addToWorkingThreads(threadNumber, 'w');
                            }
                            if (action.action === "setValue") {
                                const value = action.value;
                                setMatrixCCell(i, j, value, undefined);
                            }
                        } else if (action.action === "read") {
                            console.log(`Read from Matrix ${matrix} at (${i}, ${j}) by Thread ${threadNumber}`);
                            const setMatrix = { A: setMatrixACell, B: setMatrixBCell }
                            setMatrix[matrix](i, j, undefined, threadNumber, action.writeCell);
                            addToWorkingThreads(threadNumber, 'r');
                        }
                    });
                }

                if (data.state && data.state === "STAND_BY") {
                    setScene(SCENES.STAND_BY);
                }

                requestAnimationFrame(processMessageQueue);
            }
        }

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url, setMatrixCCell]);

    return { sendData, onVelocityChange };
};

export default useWebSocket;
