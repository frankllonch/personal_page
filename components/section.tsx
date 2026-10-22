import type { ReactNode } from "react";
import ScrambledText from "@/components/wierdtext";

/** A numbered section: hairline, number, title, an optional note on the right. */
export default function Section({
  id,
  index,
  title,
  aside,
  children,
}: {
  id: string;
  index: string;
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="rule pt-3 pb-14 sm:pb-20 scroll-mt-12">
      <div className="flex items-baseline justify-between gap-6 mb-6 sm:mb-8">
        <h2 className="flex items-baseline gap-4 font-bold text-2xl sm:text-3xl tracking-tight">
          <span className="label soft font-normal">{index}</span>
          <ScrambledText radius={30} duration={0.5} speed={0.5} scrambleChars="*">
            {title}
          </ScrambledText>
        </h2>
        {aside && <div className="label soft text-right">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
