import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
export default function Methodology() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-25 bg-primary fixed z-10 bottom-3 right-3 text-xs p-0"
          type="button"
        >
          Methodology
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button:last-child]:hidden w-full max-w-6xl md:max-w-4xl sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription>Content</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
