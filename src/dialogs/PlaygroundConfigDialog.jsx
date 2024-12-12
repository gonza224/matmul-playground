import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import useMatrixStore from '@/stores/matrixStore';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTooltip from "@/components/CustomTooltip";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CodeBlockDialog from "./CodeBlockDialog";
import { algorithms } from "@/data/algorithms";

const MAX_THREADS = 44;
const MATRIX_MAX_DIM = 50;

const configSchema = z
    .object({
        matrixARows: z.coerce.number()
            .gte(1, "Matrix A rows must be at least 1")
            .lte(MATRIX_MAX_DIM, `Matrix A rows must be at most ${MATRIX_MAX_DIM}`),
        matrixACols: z.coerce.number()
            .gte(1, "Matrix A cols must be at least 1")
            .lte(MATRIX_MAX_DIM, `Matrix A cols must be at most ${MATRIX_MAX_DIM}`),
        matrixBRows: z.coerce.number()
            .gte(1, "Matrix B rows must be at least 1")
            .lte(MATRIX_MAX_DIM, `Matrix B rows must be at most ${MATRIX_MAX_DIM}`),
        matrixBCols: z.coerce.number()
            .gte(1, "Matrix B cols must be at least 1")
            .lte(MATRIX_MAX_DIM, `Matrix B cols must be at most ${MATRIX_MAX_DIM}`),
        threadNumber: z.coerce.number()
            .gte(1, "Thread number must be at least 1")
            .lte(MAX_THREADS, `Thread number must be at most ${MAX_THREADS}`),
        algorithm: z.coerce.number(),
    })
    .refine(
        (data) => data.matrixACols === data.matrixBRows,
        {
            message: "A's cols must match B's rows for valid multiplication.",
            path: ["matrixACols"]
        }
    );

const PlaygroundConfigDialog = ({ buttonProps, ...props }) => {
    const matrixARows = useMatrixStore((state) => state.matrixARows);
    const matrixACols = useMatrixStore((state) => state.matrixACols);
    const matrixBRows = useMatrixStore((state) => state.matrixBRows);
    const matrixBCols = useMatrixStore((state) => state.matrixBCols);
    const setMatricesDimensions = useMatrixStore((state) => state.setMatricesDimensions);
    const clearWorkingThreads = useMatrixStore((state) => state.clearWorkingThreads);
    const setThreadNumber = useMatrixStore((state) => state.setThreadNumber);
    const algorithm = useMatrixStore((state) => state.algorithm);
    const setAlgorithm = useMatrixStore((state) => state.setAlgorithm);

    const form = useForm({
        resolver: zodResolver(configSchema),
        defaultValues: {
            matrixARows: matrixARows,
            matrixACols: matrixACols,
            matrixBRows: matrixBRows,
            matrixBCols: matrixBCols,
            threadNumber: useMatrixStore((state) => state.threadNumber),
            algorithm: algorithm,
        },
    });

    const [isOpen, setIsOpen] = useState(props?.defaultValue || true);

    const onSubmit = (data) => {
        const currentARows = useMatrixStore.getState().matrixARows;
        const currentACols = useMatrixStore.getState().matrixACols;
        const currentBRows = useMatrixStore.getState().matrixBRows;
        const currentBCols = useMatrixStore.getState().matrixBCols;

        const dimensionsChanged =
            data.matrixARows !== currentARows ||
            data.matrixACols !== currentACols ||
            data.matrixBRows !== currentBRows ||
            data.matrixBCols !== currentBCols;

        if (dimensionsChanged) {
            setMatricesDimensions(data.matrixARows, data.matrixACols, data.matrixBRows, data.matrixBCols);
            clearWorkingThreads();
        }

        setThreadNumber(data.threadNumber);
        setAlgorithm(data.algorithm);
        setIsOpen(false);
    };

    const selectedAlgorithmValue = form.watch("algorithm");
    const selectedAlgorithm = algorithms.find(
        (alg) => alg.value == selectedAlgorithmValue
    );

    const handleSizeChange = (e, field) => {
        let val = parseInt(e.target.value, 10);
        if (val > MATRIX_MAX_DIM) {
            val = MATRIX_MAX_DIM;
            e.target.value = val;
        }
        field.onChange(e);
    }

    return (
        <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
            <CustomTooltip title="Settings">
                <DialogTrigger asChild>
                    <Button onClick={() => setIsOpen(true)} {...buttonProps}>
                        <Cog6ToothIcon />
                    </Button>
                </DialogTrigger>
            </CustomTooltip>
            <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                    <DialogTitle>Experiment Configuration</DialogTitle>
                    <DialogDescription>
                        Tweak the variables and see what happens!
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-8 gap-4 py-4 items-start">
                            <FormField
                                control={form.control}
                                name="algorithm"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel>Algorithm</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                        >
                                            <SelectTrigger className="w-[190px]">
                                                <SelectValue placeholder="Algorithm to use" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {algorithms.map((ele) => (
                                                        <SelectItem key={ele.value} value={String(ele.value)}>
                                                            {ele.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="col-span-4 space-y-2 mb-4">
                                <FormLabel className="invisible">See code</FormLabel>
                                <CodeBlockDialog
                                    title={selectedAlgorithm?.label || "Algorithm"}
                                    code={selectedAlgorithm?.code || ""}
                                    language="cpp"
                                />
                            </div>

                            <FormLabel className="text-left col-span-8">Matrix A</FormLabel>
                            <div className="col-span-8 flex items-center gap-3">

                                {/* Matrix A Rows */}
                                <FormField
                                    control={form.control}
                                    name="matrixARows"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    min={1}
                                                    max={MATRIX_MAX_DIM}
                                                    placeholder="m"
                                                    {...field}
                                                    className="no-arrows p-0 px-2 text-center box-border"
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleSizeChange(e, field)}
                                                    style={{
                                                        width: `${Math.max(field.value?.toString().length * 8, 8) + 40}px`,
                                                        maxWidth: "100%",
                                                    }}
                                                    autoFocus
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 text-center">Rows</div>
                                        </FormItem>
                                    )}
                                />

                                <FormLabel>x</FormLabel>
                                <FormField
                                    control={form.control}
                                    name="matrixACols"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="m"
                                                    {...field}
                                                    className="no-arrows p-0 px-2 text-center box-border"
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleSizeChange(e, field)}
                                                    style={{
                                                        width: `${Math.max(field.value?.toString().length * 8, 8) + 40}px`,
                                                        maxWidth: "100%",
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 text-center">Cols</div>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <FormLabel className="text-left col-span-8">Matrix B</FormLabel>
                            <div className="col-span-8 flex items-center gap-3">
                                <FormField
                                    control={form.control}
                                    name="matrixBRows"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    min={1}
                                                    max={MATRIX_MAX_DIM}
                                                    placeholder="m"
                                                    {...field}
                                                    className="no-arrows p-0 px-2 text-center box-border"
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleSizeChange(e, field)}
                                                    style={{
                                                        width: `${Math.max(field.value?.toString().length * 8, 8) + 40}px`,
                                                        maxWidth: "100%",
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 text-center">Rows</div>
                                        </FormItem>
                                    )}
                                />

                                <FormLabel>x</FormLabel>
                                <FormField
                                    control={form.control}
                                    name="matrixBCols"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="m"
                                                    {...field}
                                                    className="no-arrows p-0 px-2 text-center box-border"
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleSizeChange(e, field)}
                                                    style={{
                                                        width: `${Math.max(field.value?.toString().length * 8, 8) + 40}px`,
                                                        maxWidth: "100%",
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 text-center">Cols</div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {Object.keys(form.formState.errors).length > 0 && form.formState.errors.matrixACols && (
                                <div className="col-span-8 text-[0.8rem] font-medium text-destructive">
                                    <div>
                                        {form.formState.errors.matrixACols.message}
                                    </div>
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="threadNumber"
                                render={({ field }) => (
                                    <FormItem className="col-span-8 mt-4">
                                        <FormLabel>Number of Threads</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter thread number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PlaygroundConfigDialog;
