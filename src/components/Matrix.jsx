import React, { memo } from 'react';
import useMatrixStore, { getColorByThreadNumber, SCENES } from '@/stores/matrixStore';
import { cn } from '@/lib/utils';

const Matrix = memo(({ label, m, n, showOnly = false }) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">{label}</h2>
            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `repeat(${n}, minmax(65px, 1fr))`,
                    gridAutoRows: "45px",
                }}
            >
                {Array.from({ length: m }).map((_, rowIndex) =>
                    Array.from({ length: n }).map((_, colIndex) => (
                        <Cell
                            key={`${label}-${rowIndex}-${colIndex}`}
                            label={label}
                            row={rowIndex}
                            col={colIndex}
                            showOnly={showOnly}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

function getLinearGradient(colors, grayOut) {
    if (colors.length === 0) return "transparent";

    const colorStops = colors.map((color, index) => {
        const colorWithOpacity = grayOut ? addOpacity(color) : color;
        return `${colorWithOpacity} ${(index * 100) / colors.length}% ${(index + 1) * (100 / colors.length)}%`;
    });

    return `linear-gradient(to right, ${colorStops.join(", ")})`;
}

function addOpacity(rgbColor) {
    const matches = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const red = parseInt(matches[1], 10);
    const green = parseInt(matches[2], 10);
    const blue = parseInt(matches[3], 10);

    const grayLevel = (red + green + blue) / 3;
    const alpha = 0.4;
    const newR = red + (alpha * (grayLevel - red));
    const newG = green + (alpha * (grayLevel - green));
    const newB = blue + (alpha * (grayLevel - blue));

    return `rgb(${newR}, ${newG}, ${newB})`;
}

const Cell = memo(({ label, row, col, showOnly }) => {
    const cellData = useMatrixStore((state) => {
        const matrices = { A: state.matrixA, B: state.matrixB, C: state.matrixC };
        return matrices[label][row][col];
    });

    const value = cellData?.value || 0;
    const grayOut = cellData?.grayOut || false;
    const colors = cellData.threadNumbers.map(number => getColorByThreadNumber(number));
    // const colors = [...Array(3).keys()].map(number => getColorByThreadNumber(number));

    const handleBlur = (e) => {
        const state = useMatrixStore.getState();
        const originalValue = label === "A" ? state.matrixA[row][col].value : state.matrixB[row][col].value;

        if (state.scene === SCENES.EXECUTING) {
            e.target.innerText = originalValue;
            return;
        }

        const newValue = parseInt(e.target.innerText, 10) || 0;
        if (label === "A") useMatrixStore.getState().setMatrixACell(row, col, newValue, -1);
        if (label === "B") useMatrixStore.getState().setMatrixBCell(row, col, newValue, -1);
    };

    const handleFocus = (e) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(e.target);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData.getData('Text') || '').replace(/[^0-9]/g, '');
        document.execCommand('insertText', false, pasteData);
    };

    return showOnly || label === "C" ? (
        <div
            className={`cell w-full h-full border border-2 rounded-md border-gray-300 text-center p-2`}
            style={{
                background: getLinearGradient(colors, grayOut)
            }}
        >
            {value}
        </div>
    ) : (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                }
            }}
            onPaste={handlePaste}
            className="cell w-full h-full border border-2 rounded-md border-gray-300 text-center p-2 relative"
            style={{
                background: getLinearGradient(colors)
            }}
        >
            {value}
        </div>

    );
});

export default Matrix;


