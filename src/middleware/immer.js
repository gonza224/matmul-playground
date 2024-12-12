import { produce } from "immer";

// Immer middleware to handle immutable updates
export const immer = (config) => (set, get, api) =>
    config((fn) => set(produce(fn)), get, api);

// Logger middleware to log each state change
export const logger = (config) => (set, get, api) =>
    config((args) => {
        console.log("  Applying:", args);
        set(args);
        console.log("  New state:", get());
    }, get, api);
