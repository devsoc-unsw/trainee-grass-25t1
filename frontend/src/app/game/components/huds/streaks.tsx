import BullseyeArrow from "@/components/icons/BullseyeArrow";
import GameButton from "@/app/game/components/GameButton";
import Game from "../../page";
import { 
  Dialog,
  DialogTrigger
} from "@radix-ui/react-dialog";

export default function SimpleBox() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute left">
          <GameButton>
            <div className="absolute top-0 left-80 bg-white border-5 w-100 h-16" >
                <span className="absolute top-3 left-20 text-2xl" style={{ fontFamily: "var(--font-pixelify)", fontWeight: "bold" }}>Streaks </span>
                <span className="absolute top-3 left-70 text-2xl" style={{ fontFamily: "var(--font-pixelify)", fontWeight: "bold" }}>1 days </span>
                <BullseyeArrow className="absolute w-10 h-10 top-2 left-5 text-black" />
            </div>
          </GameButton>
        </div>
      </DialogTrigger>
    </Dialog>
  );
}

