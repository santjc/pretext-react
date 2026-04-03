"use client";

import { useMemo, useState } from "react";
import {
  EditorialSurface,
  type EditorialFigure,
} from "@santjc/react-pretext/editorial";
import { cn } from "@/lib/utils";
import { SegmentedControl, SliderControl } from "@/components/showcase-layout";
import { CodeBlock } from "@/components/code-block";

const leftRailText = `Witnesses in Croydon, Le Bourget, and Cologne now speak of the aeroplane the way they once spoke of the locomotive: not merely as a machine, but as a timetable that will soon govern commerce, distance, and expectation. Hotel porters have learned the names of pilots. Port authorities now track air schedules beside steamship arrivals.

Dispatches from field correspondents describe crowds assembling before dawn whenever a notable flight is rumored. Children point first to the propeller, then to the pilot's goggles. Mechanics, meanwhile, speak in the language of oil, weather, and patience, reminding enthusiasts that spectacle depends on maintenance.

The marvel is therefore double. One sees the machine in the sky, and beneath it the new class of routines required to keep it there. In quieter terms, that is also the lesson of this package: the visible result is only convincing because the underlying inputs remain disciplined and explicit.`;

const featureText = `Across Europe and the Atlantic corridor, the promise of air travel is no longer presented as a stunt reserved for expositions and daredevils. Municipal officials are discussing aerodromes in the tone once reserved for rail depots, while insurers, publishers, and exporters have all begun to calculate what a shorter map might mean for ordinary business.

Pilots interviewed this week describe the work less as conquest than as discipline. They watch the color of weather fronts, the steadiness of fuel feed, the tremor in the frame, and the peculiar geometry of fields suitable for landing. A successful route is rarely an act of reckless bravado. It is a chain of small judgments, repeated without drama, until the destination appears below the wing.

Manufacturers insist that the next contest will not be altitude alone but reliability. Cabin comfort, steady schedules, spare parts, and trusted maintenance crews may do more to usher in the aerial age than any single headline-making crossing. That argument is finding support among businessmen who care less for records than for predictability.

Editors have noticed the same shift. Readers still admire feats of daring, but they are increasingly drawn to the practical consequence of airborne connection: fresh newspapers carried between capitals, correspondence that arrives before a rumor grows old, and engineers who can inspect machinery on one morning and dine in another country by evening.

If the age of aviation is truly arriving, it will be measured not only by the roar above the crowd but by the calmer evidence below it: contracts written on tighter schedules, provincial towns linked to larger markets, and citizens learning to imagine a continent in hours rather than days.`;

const rightRailText = `Bankers in Paris and brokers in New York alike have begun to ask whether speed itself can be traded. The question sounds fanciful until one reads the ledgers attached to express mail, perishables, and diplomatic dispatch. What was once a curiosity at the edge of modern life is moving toward its center.

Designers of the latest craft insist that utility will proceed in stages. First come lighter structures and more regular service. Then come cabins suited not only for hardy enthusiasts but for clerks, diplomats, and travelers who expect the journey to be civilized. Every improvement in comfort widens the class of people willing to fly.

Aviation therefore advances by romance and arithmetic together. Posters summon the public with heroics, but the balance sheet decides whether the route remains in operation after the crowd has gone home. That same split between spectacle and structure is why this demo works better with real flowing copy than with a few short paragraphs pretending to be a newspaper.`;

const bottomLeftText = `Provincial clubs continue to hold exhibitions in which local mechanics compare engines, wing struts, and fuel lines with the solemnity of surgeons. The gatherings are modest, but they have become schools in miniature for the next generation of airmen. Lorem ipsum may fill a column when needed, but this layout reads better when the article volume behaves like a real edition.`;

const bottomMiddleText = `Cartographers now revise their route diagrams with unusual frequency. Distances once measured by sea-lane and mountain pass are being recalculated by fuel stop and prevailing wind. The globe is not smaller in fact, but it is becoming smaller in habit, and the page looks more convincing when the modules carry enough copy to justify their proportions.`;

const bottomRightText = `The newest mountain surveys suggest that aviation will reshape not only commercial timetables but the very imagination of geography. Ranges long treated as barriers now appear, from the cockpit, as a sequence of weather judgments and elevation marks. The same ridges that delayed caravans and trains for generations may soon be crossed by pilots who read the sky as carefully as sailors once read a harbor.

Engineers caution that terrain remains unforgiving. Thin air alters lift, sudden downdrafts confuse the inexperienced, and a valley that seems inviting from above may offer no safe landing ground at all. Yet these warnings have not discouraged planners who believe alpine and transcontinental routes will eventually bind remote districts more closely to the capitals.

For now, the mountain remains both obstacle and advertisement: a dramatic proof that aviation's next chapter will be written where spectacle meets endurance.`;

function FigurePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-full w-full bg-[#d0d0c8] border border-[#999]",
        className,
      )}
    />
  );
}

function QuoteFigure() {
  return (
    <div className="h-full w-full overflow-hidden border-l-2 border-primary px-3 py-2 text-[14px] italic leading-[1.35] text-primary">
      <p>Declare the figure.</p>
      <p className="mt-1">Let the article route around it.</p>
    </div>
  );
}

export function EditorialSection() {
  const [bodySize, setBodySize] = useState(12);
  const [bodyLeading, setBodyLeading] = useState(18);
  const [trackGap, setTrackGap] = useState(19);
  const [bodyWeight, setBodyWeight] = useState<"300" | "400" | "500">("400");
  const [whitespace, setWhitespace] = useState<"normal" | "pre-wrap">(
    "pre-wrap",
  );
  const [justify, setJustify] = useState<"natural" | "justify">("justify");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-3">
          Editorial
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 text-balance">
          Editorial composition with the real advanced API
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          This newspaper layout keeps a stylized shell, but the text flow comes
          from the real editorial subpath. The visible story blocks use{" "}
          <code className="text-xs font-mono bg-background px-1 py-0.5 rounded">
            EditorialSurface
          </code>
          , and the controls change actual flow inputs instead of only changing
          presentation.
        </p>
        <div className="mt-4">
          <span className="inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 border border-blue-400 text-blue-400 rounded">
            Advanced Subpath
          </span>
        </div>
      </div>

      <section className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SliderControl
              label="Body size"
              value={bodySize}
              min={10}
              max={18}
              onChange={setBodySize}
            />
            <SliderControl
              label="Body leading"
              value={bodyLeading}
              min={14}
              max={28}
              onChange={setBodyLeading}
            />
            <SegmentedControl
              label="Body weight"
              value={bodyWeight}
              options={[
                { label: "300", value: "300" },
                { label: "400", value: "400" },
                { label: "500", value: "500" },
              ]}
              onChange={(value) =>
                setBodyWeight(value as "300" | "400" | "500")
              }
            />
            <SliderControl
              label="Track gap"
              value={trackGap}
              min={12}
              max={32}
              onChange={setTrackGap}
            />
            <SegmentedControl
              label="Whitespace"
              value={whitespace}
              options={[
                { label: "normal", value: "normal" },
                { label: "pre-wrap", value: "pre-wrap" },
              ]}
              onChange={(value) =>
                setWhitespace(value as "normal" | "pre-wrap")
              }
            />
            <SegmentedControl
              label="Justify rendering"
              value={justify}
              options={[
                { label: "Natural", value: "natural" },
                { label: "Justify", value: "justify" },
              ]}
              onChange={(value) => setJustify(value as "natural" | "justify")}
            />
          </div>
        </div>

        <div className="p-6 bg-[#f5f5f0]">
          <NewspaperLayout
            bodySize={bodySize}
            bodyLeading={bodyLeading}
            trackGap={trackGap}
            bodyWeight={bodyWeight}
            whitespace={whitespace}
            justify={justify}
          />
        </div>
      </section>

      <CodeBlock
        filename="editorial-config.tsx"
        code={`import { EditorialSurface } from '@santjc/react-pretext/editorial'

const font = '${bodyWeight} ${bodySize}px Geist, sans-serif'

<EditorialSurface
  text={featureStory}
  font={font}
  lineHeight={${bodyLeading}}
  minHeight={420}
  lineRenderMode="${justify}"
  prepareOptions={{ whiteSpace: '${whitespace}' }}
  figures={[
    { shape: 'rect', width: 112, height: 84, placement: 'top-right', linePadding: 8, content: <Figure /> },
    { shape: 'rect', width: 118, height: 92, placement: 'bottom-left', linePadding: 8, content: <Quote /> },
  ]}
/>`}
      />
    </div>
  );
}

function NewspaperLayout({
  bodySize,
  bodyLeading,
  trackGap,
  bodyWeight,
  whitespace,
  justify,
}: {
  bodySize: number;
  bodyLeading: number;
  trackGap: number;
  bodyWeight: string;
  whitespace: "normal" | "pre-wrap";
  justify: "natural" | "justify";
}) {
  const font = `${bodyWeight} ${bodySize}px Geist, sans-serif`;
  const railFigures = useMemo<EditorialFigure[]>(
    () => [
      {
        shape: "rect",
        width: 96,
        height: 74,
        placement: "top-right",
        linePadding: 8,
        content: <FigurePlaceholder />,
      },
    ],
    [],
  );
  const rightRailFigures = useMemo<EditorialFigure[]>(
    () => [
      {
        shape: "rect",
        width: 98,
        height: 98,
        placement: "bottom-center",
        linePadding: 8,
        content: <FigurePlaceholder className="aspect-square" />,
      },
    ],
    [],
  );
  const featureFigures = useMemo<EditorialFigure[]>(
    () => [
      {
        shape: "rect",
        width: 112,
        height: 84,
        placement: "top-right",
        linePadding: 8,
        content: <FigurePlaceholder className="aspect-[4/3]" />,
      },
      {
        shape: "rect",
        width: 118,
        height: 92,
        placement: "bottom-left",
        linePadding: 8,
        content: <QuoteFigure />,
      },
    ],
    [],
  );

  return (
    <div className="text-[#1a1a1a] font-serif max-w-4xl mx-auto">
      <div className="text-center border-b-2 border-[#1a1a1a] pb-4 mb-4">
        <div className="mb-2 flex flex-col gap-2 text-[10px] tracking-widest sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>V0.1.0</span>
            <span>PUBLIC API</span>
          </div>
          <span className="sm:text-center">DETERMINISTIC TEXT MEASUREMENT BEFORE PAINT</span>
          <div className="sm:text-right">
            <span className="text-primary font-bold">SURFACE</span>
            <span className="text-2xl font-bold text-primary ml-2">3</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1">
          @SANTJC/REACT-PRETEXT
        </h1>
        <p className="text-xs tracking-widest">
          ROOT, EDITORIAL, AND RAW PRETEXT
        </p>
      </div>

      <div className="text-center border-b border-[#1a1a1a] pb-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Text Layout From Declared Geometry
        </h2>
        <p className="text-xs tracking-widest text-[#666]">
          The newspaper shell stays the same, but the article flow now comes
          from EditorialSurface and real figure constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: `${trackGap}px` }}>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-black mb-2 leading-tight">
              THE ROOT PACKAGE STAYS FOCUSED
            </h3>
            <div className="min-h-[420px]">
              <EditorialSurface
                text={leftRailText}
                font={font}
                lineHeight={bodyLeading}
                minHeight={420}
                lineRenderMode={justify}
                prepareOptions={{ whiteSpace: whitespace }}
                className="text-[#1a1a1a]"
                figures={railFigures}
              />
              <EditorialSurface
                text={bottomMiddleText}
                font={font}
                lineHeight={bodyLeading}
                minHeight={420}
                lineRenderMode={justify}
                prepareOptions={{ whiteSpace: whitespace }}
                className="text-[#1a1a1a]"
                figures={railFigures}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 col-span-1">
          <div className="text-center">
            <h3 className="text-lg font-black mb-2">
              MEASURE FIRST. FLOW WHEN GEOMETRY MATTERS.
            </h3>
          </div>
          <div className="min-h-[420px]">
            <EditorialSurface
              text={featureText}
              font={font}
              lineHeight={bodyLeading}
              minHeight={420}
              lineRenderMode={justify}
              prepareOptions={{ whiteSpace: whitespace }}
              className="text-[#1a1a1a]"
              figures={featureFigures}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black mb-2">
            EDITORIAL COMES WHEN LAYOUT NEEDS RULES
          </h3>
          <div className="min-h-[420px]">
            <EditorialSurface
              text={rightRailText}
              font={font}
              lineHeight={bodyLeading}
              minHeight={420}
              lineRenderMode={justify}
              prepareOptions={{ whiteSpace: whitespace }}
              className="text-[#1a1a1a]"
              figures={rightRailFigures}
            />
            <EditorialSurface
              text={bottomRightText}
              font={font}
              lineHeight={bodyLeading}
              minHeight={420}
              lineRenderMode={justify}
              prepareOptions={{ whiteSpace: whitespace }}
              className="text-[#1a1a1a]"
              figures={railFigures}
            />
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 border-t border-[#1a1a1a] mt-6 pt-4 md:grid-cols-3"
        style={{ gap: `${trackGap}px` }}
      >
        <div>
          <h4 className="text-xs font-black mb-2">ROOT API</h4>
          <p
            style={{
              fontSize: `${bodySize}px`,
              lineHeight: `${bodyLeading}px`,
              fontWeight: bodyWeight,
            }}
          >
            {bottomLeftText}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-black mb-2">RAW PRETEXT</h4>
          <p
            style={{
              fontSize: `${bodySize}px`,
              lineHeight: `${bodyLeading}px`,
              fontWeight: bodyWeight,
            }}
          >
            {bottomMiddleText}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-black mb-2">ADVANCED EDITORIAL</h4>
          <p
            style={{
              fontSize: `${bodySize}px`,
              lineHeight: `${bodyLeading}px`,
              fontWeight: bodyWeight,
            }}
          >
            {bottomRightText}
          </p>
        </div>
      </div>
    </div>
  );
}
