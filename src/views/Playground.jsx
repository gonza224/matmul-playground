import React from 'react';
import Controls from '@/components/Controls';
import useInfiniteViewer from '@/hooks/useInfiniteViewer';
import MatrixFilling from '@/views/Scenes/MatrixFilling';
import useZoomStore from '@/stores/zoomStore';
import useMatrixStore from '@/stores/matrixStore';
import useWebSocket from '@/hooks/useWebSocket';
import ThreadGrid from '@/components/ThreadGrid/ThreadGrid';
import { Badge } from '@/components/ui/badge';

const INITIAL_ZOOM = 100;

const Playground = () => {
    const zoom = useZoomStore((state) => state.zoom);
    const workingThreads = useMatrixStore((state) => state.workingThreads);
    const randomizeMatrices = useMatrixStore((state) => state.randomizeMatrices);
    const oneToNMatrices = useMatrixStore((state) => state.oneToNMatrices);

    const { viewerRef, contentRef } = useInfiniteViewer(INITIAL_ZOOM);
    const { sendData, onVelocityChange } = useWebSocket('ws://172.20.155.66:3000/matmul/');

    return (
        <div ref={viewerRef} className="viewer w-full h-screen overflow-hidden relative">
            <div
                ref={contentRef}
                className="viewport text-left"
                style={{
                    minWidth: '100000vw',
                    minHeight: '100000vw',
                }}
            >
                <MatrixFilling />
            </div>

            <div className="h-full absolute top-0 right-4 z-50 flex flex-col items-center justify-between py-4 px-2 space-y-4">
                <ThreadGrid workingThreads={workingThreads} />

                <Badge variant="secondary" className='px-3 py-2'>
                    Zoom: {zoom}%
                </Badge>
            </div>



            <Controls
                onPlayClick={() => sendData()}
                onStopClick={() => sendData(true)}
                onVelocityClick={() => onVelocityChange()}
                onOneToNClick={() => oneToNMatrices()}
                onRandomizeClick={() => randomizeMatrices()}
            />
        </div >
    );
};

export default Playground;
