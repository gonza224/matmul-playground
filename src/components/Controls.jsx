import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from './ui/label';
import useMatrixStore, { SCENES } from "@/stores/matrixStore";
import { ShuffleIcon } from "@radix-ui/react-icons";
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/solid';
import PlaygroundConfigDialog from '@/dialogs/PlaygroundConfigDialog';
import { algorithms } from '@/data/algorithms';

const velocities = [
    { "value": 0.1, "label": "0.1x" },
    { "value": 0.5, "label": "0.5x" },
    { "value": 1, "label": "1x" },
]

const Controls = ({ onPlayClick, onStopClick, onVelocityClick, onOneToNClick, onRandomizeClick }) => {
    const scene = useMatrixStore((state) => state.scene);
    const algorithm = useMatrixStore((state) => state.algorithm);
    const velocityMultiplier = useMatrixStore((state) => state.velocityMultiplier);
    const setVelocityMultiplier = useMatrixStore((state) => state.setVelocityMultiplier);

    const toggleVelocity = () => {
        const lastVelocityIndex = velocities.findIndex((el) => el.value == velocityMultiplier);
        let newIndex = lastVelocityIndex + 1;
        if (newIndex > velocities.length - 1)
            newIndex = 0;
        setVelocityMultiplier(velocities[newIndex].value);
        onVelocityClick();
    }

    const GetActionBtnIcon = () => {
        if (scene === SCENES.EXECUTING) return <PauseIcon className="h-4 w-4" />
        return <PlayIcon className="h-4 w-4" />
    }

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
             w-11/12 md:w-1/2 sm:mx-4 z-50 text-center gap-2">

            <Label className="text-lg">{algorithms[algorithm].label}</Label>

            <div className="px-6 py-4 flex space-x-2 justify-start border rounded-full mt-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                onClick={onPlayClick}
                                disabled={scene === SCENES.STOPPING}
                            >
                                <GetActionBtnIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{scene === SCENES.STAND_BY ? "Start execution" : "Pause execution"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {scene == SCENES.EXECUTING ?
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    onClick={onStopClick}
                                >
                                    <StopIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Stop execution</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    : <></>
                }

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="" onClick={toggleVelocity}>
                                {velocities.find((el) => el.value == velocityMultiplier).label}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Change velocity</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>



                <div className="flex-grow text-right">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="max-w-fit" onClick={onOneToNClick}
                                    disabled={scene != SCENES.STAND_BY}>
                                    <p>1 to <span>n<sup>2</sup></span></p>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Fill the matrices with values from 1 to <span>n<sup>2</sup></span></p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="text-right" onClick={onRandomizeClick}
                                disabled={scene != SCENES.STAND_BY}>
                                <ShuffleIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Randomize matrices</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <PlaygroundConfigDialog
                    buttonProps={{
                        disabled: scene != SCENES.STAND_BY
                    }}
                    defaultOpen
                />
            </div>
        </div>
    );
};

export default Controls;
