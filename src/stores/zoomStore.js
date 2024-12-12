import { create } from "zustand";
import { immer } from "@/middleware/immer";

const store = (set) => ({
    zoom: 100,
    setZoom: (newZoom) => set((state) => {
        state.zoom = newZoom;
    }),
});

export default create(immer(store));
