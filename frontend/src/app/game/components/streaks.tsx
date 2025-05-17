import BullseyeArrow from "@/components/icons/BullseyeArrow";

export default function SimpleBox() {
  return (
    <div className="absolute top-4 left-80 bg-white border-5 border-black w-100 h-20" >
        <p className="absolute top-5 left-20 text-2xl" style={{ fontFamily: "var(--font-pixelify)", fontWeight: "bold" }}>Streaks</p>
        <BullseyeArrow className="absolute w-10 h-10 top-4 left-5 text-black" />
    </div>
  );
}
