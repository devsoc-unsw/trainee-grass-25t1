import BullseyeArrow from "@/components/icons/BullseyeArrow";
import GameButton from "@/app/game/components/GameButton";
import Game from "../../page";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose
} from "@radix-ui/react-dialog";

export default function SimpleBox() {
  return (
    <Dialog>
      <DialogTrigger asChild>
          <GameButton>
            <div className="absolute top-0 left-20 bg-white border-5 w-100 h-16" >
                <span className="absolute top-3 left-20 text-2xl" style={{ fontFamily: "var(--font-pixelify)", fontWeight: "bold" }}>Streaks </span>
                <span className="absolute top-3 left-70 text-2xl" style={{ fontFamily: "var(--font-pixelify)", fontWeight: "bold" }}>1 days </span>
                <BullseyeArrow className="absolute w-10 h-10 top-2 left-5 text-black" />
            </div>
          </GameButton>
      </DialogTrigger>
      <DialogContent 
        className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <DialogTitle className="font-bold text-center text-xl">
          View Streaks
        </DialogTitle>
        <div className="flex justify-center gap-4">
          <div className="flex-1 flex justify-center items-center">
                      
          </div>
          <div className="grid grid-cols-2 h-96 overflow-y-auto">
            
          </div>
        </div>
        <DialogClose
          className="bg-foreground text-background w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed">
          Update Streaks
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

