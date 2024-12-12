import { useRef, useEffect } from 'react';
import InfiniteViewer from "infinite-viewer";
import useZoomStore from '@/stores/zoomStore';

const useInfiniteViewer = (initialZoom) => {
    const viewerRef = useRef(null);
    const contentRef = useRef(null);
    const setZoom = useZoomStore((state) => state.setZoom);

    useEffect(() => {
        if (!viewerRef.current || !contentRef.current) return;

        const viewer = new InfiniteViewer(viewerRef.current, contentRef.current, {
            useMouseDrag: true,
            useTouchDrag: true,
            rangeX: [-1000, 1000],
            rangeY: [-1000, 10000],
            zoomRange: [0.1, 2],
            useAutoZoom: true,
        });

        const handleZoom = (newZoom) => {
            viewer.setZoom(newZoom);
            setZoom(Math.round(newZoom * 100));
        };

        const handleWheel = (e) => {
            e.preventDefault();
            const zoomChange = e.deltaY < 0 ? 1.1 : 0.9;
            const newZoom = Math.max(0.1, Math.min(viewer.getZoom() * zoomChange, 2));
            handleZoom(newZoom);
        };

        viewer.on("dragStart", (e) => {
            const target = e.inputEvent.target;
            const className = typeof target.className === "string" ? target.className.toLowerCase() : "";

            if (className.includes("cell ") || target.tagName.toLowerCase() === "input" ||
                target.tagName.toLowerCase() === "button") {
                e.stop();
            }
        });


        viewerRef.current.addEventListener("wheel", handleWheel, { passive: false });


        viewer.on("reset", e => {
            viewer.scrollCenter();
        });

        return () => {
            viewer.destroy();
            viewerRef.current.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return { viewerRef, contentRef };
};

export default useInfiniteViewer;
