import { useRef, useState } from "react";
import GameButton from "../GameButton";
import Volume3 from "@/components/icons/Volume3";
import VolumeX from "@/components/icons/VolumeX";

export default function Music() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Playback failed", e));
    }

    setIsPlaying((prev) => !prev);
  };
  return (
    <GameButton onClick={toggleMusic}>
      {isPlaying ? (
        <Volume3 width={32} height={32} />
      ) : (
        <VolumeX width={32} height={32} />
      )}
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
    </GameButton>
  );
}
