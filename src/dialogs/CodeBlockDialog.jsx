import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlockDialog = ({ title, code, language }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="block underline" variant="link">
                    See code
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[700px] max-h-[80vh] h-full overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center space-x-2 overflow-auto overflow-y-hidden">
                    <SyntaxHighlighter
                        language={language}
                        style={tomorrow}
                        customStyle={{
                            height: "100%",
                            width: "100%",
                            overflowX: "auto",
                            fontSize: "14px",
                            borderRadius: "8px",
                            padding: "16px",
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CodeBlockDialog;
