import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import GameButton from "../GameButton";
import InfoBox from "@/components/icons/InfoBox";
import Link from "next/link";
import ExternalLink from "@/components/icons/ExternalLink";

const CREDITS = [
  {
    title: "Developed by",
    credits: [
      {
        name: "Kripa Aryal",
        credit: "https://github.com/Kreepkk",
      },
      {
        name: "Kongmony Bun",
        credit: "https://github.com/Meczox",
      },
      {
        name: "Madhu Shrestha",
        credit: "https://github.com/madhueyy",
      },
      {
        name: "Merry Rosalie",
        credit: "https://github.com/MerryRosalie",
      },
    ],
  },
  {
    title: "Art by",
    credits: [
      {
        name: "David Jun",
        credit: "https://www.instagram.com/expwjun/",
      },
    ],
  },
  {
    title: "Music by",
    credits: [
      {
        name: "Kevin McLeod",
        credit: "https://www.youtube.com/watch?v=HUCjaaQR6cs",
      },
    ],
  },
];

export default function About() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <GameButton tooltipText="Avatars">
          <InfoBox width={32} height={32} />
        </GameButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold text-center text-xl">
          About LeetCraft
        </DialogTitle>
        {CREDITS.map(({ title, credits }, index) => (
          <div className="text-center" key={index}>
            <h1 className="text-lg font-bold">{title}</h1>
            {credits.map(({ name, credit }) => (
              <Link
                key={name}
                className="flex justify-center items-center gap-1 hover:[&>p]:underline"
                href={credit}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p>{name}</p>
                <ExternalLink />
              </Link>
            ))}
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
