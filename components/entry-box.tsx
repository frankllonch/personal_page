import Image from "next/image";
import ScrambledText from "@/components/wierdtext";
import type { Entry } from "@/lib/data";

/** A job or a school in the hairline grid. */
export default function EntryBox({ entry }: { entry: Entry }) {
  return (
    <a href={entry.href} target="_blank" rel="noopener noreferrer" className="box">
      <div className="flex items-center justify-between gap-4">
        <span className="label soft">{entry.period}</span>
        <span className="relative h-8 w-8 overflow-hidden bg-white">
          <Image src={entry.image} alt="" fill sizes="32px" className="object-cover" />
        </span>
      </div>
      <h3 className="mt-6 font-bold text-xl sm:text-2xl leading-[1.05] tracking-tight">
        <ScrambledText radius={40} duration={0.5} speed={0.5} scrambleChars="*">
          {entry.name}
        </ScrambledText>
      </h3>
      <div className="mt-1 text-[15px]">{entry.role}</div>
      <p className="mt-3 text-[14px] leading-snug soft max-w-[36ch]">{entry.note}</p>
      <div className="mt-auto pt-6 flex items-end justify-between label soft">
        <span>{entry.place}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </a>
  );
}
