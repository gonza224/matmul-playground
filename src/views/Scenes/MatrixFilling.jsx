import React from 'react';
import useMatrixStore from '@/stores/matrixStore';
import Matrix from '@/components/Matrix';
import Latex from 'react-latex';

const MatrixFilling = () => {
    const matrixARows = useMatrixStore((state) => state.matrixARows);
    const matrixACols = useMatrixStore((state) => state.matrixACols);
    const matrixBRows = useMatrixStore((state) => state.matrixBRows);
    const matrixBCols = useMatrixStore((state) => state.matrixBCols);

    return (
        <div className="flex flex-col items-start w-full h-full overflow-auto p-20">
            <h1 className="mb-4 text-center">
                Fill in the matrices and click "Play" to calculate
            </h1>
            <div className="flex space-x-8 items-center overflow-auto w-full justify-start">
                <div className="flex flex-col items-start min-w-[200px] min-h-[200px]">
                    <Matrix label="A" m={matrixARows} n={matrixACols} />
                </div>
                <Latex>{`$\\times$`}</Latex>
                <div className="flex flex-col items-start min-w-[200px] min-h-[200px]">
                    <Matrix label="B" m={matrixBRows} n={matrixBCols} />
                </div>
            </div>
            <div className="flex flex-col items-start min-w-[200px] flex-grow mt-8">
                <Matrix label="C" m={matrixARows} n={matrixBCols} showOnly />
            </div>
        </div>
    );
};

export default MatrixFilling;
