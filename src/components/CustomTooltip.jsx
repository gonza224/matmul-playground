'use client';

import * as React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

export default function CustomTooltip({ title, children }) {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent sideOffset={4} className="z-[200]">
                    {title}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
