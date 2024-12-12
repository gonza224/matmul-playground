import React, { Fragment } from 'react';
import { Label } from '@/components/ui/label';
import { getColorByThreadNumber } from '@/stores/matrixStore';
import { ThreadButton } from './ThreadButton';

const ThreadGrid = ({ workingThreads }) => {
    return (
        <div className="flex-grow flex flex-col gap-3 items-center overflow-y-hidden w-full me-2">
            {
                workingThreads.length <= 0 ?
                    <></>
                    :
                    <>
                        <Label>Threads</Label>
                        <div className="h-full grid grid-flow-row gap-2 min-w-[40px] overflow-y-auto pl-1 pb-2"
                            style={{
                                gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
                                gridTemplateRows: "repeat(auto-fill, minmax(40px, 1fr))",
                                direction: "rtl"
                            }}
                        >
                            {[...workingThreads].sort((a, b) => a - b).map(({ threadNumber, r, w }) => (
                                <ThreadButton key={threadNumber} color={getColorByThreadNumber(threadNumber)}
                                    threadNumber={threadNumber} reads={r} writes={w} />
                            ))}
                        </div>
                    </>
            }
        </div >
    );
};

export default ThreadGrid;
