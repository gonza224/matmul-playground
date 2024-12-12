import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function ThreadButton({ color, threadNumber, reads, writes }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline"
                    className={"rounded-full flex items-center justify-center w-full h-10 border-2 border-gray-300 font-bold"}
                    style={{ background: color }}>
                    {threadNumber}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-70 mr-16">
                <div className="grid gap-4 p-2">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Thread #{threadNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                            Data access info. by this thread.
                        </p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-4xl font-bold tracking-tighter">
                            {writes}
                        </div>
                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                            OPERATIONS
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
