import BullseyeArrow from "@/components/icons/BullseyeArrow";

export default function SimpleBox() {
  return (
    <div className="absolute top-4 left-80 bg-white border-5 border-black w-100 h-20" >
        <BullseyeArrow className="absolute w-10 h-10 top-5 left-5 text-black" />
    </div>
  );
}
