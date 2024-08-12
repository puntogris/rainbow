import { createEffect, createSignal } from "solid-js";
import tailwindColors from "~/data/tailwind-colors.json";
import { DeltaE00Calculator } from "~/lib/delta-calculator";
import CopyIcon from "~/icons/copyIcon";
import PasteIcon from "~/icons/pasteIcon";
import type { TailwindColor } from "~/lib/tailwindColor";

export default function Tailwind() {
  const [original, setOriginal] = createSignal(tailwindColors[0].hex);
  const [tailwind, setTailwind] = createSignal<TailwindColor>(
    tailwindColors[0]
  );

  async function handlePaste() {
    const text = await navigator.clipboard.readText();
    if (text) {
      setOriginal(text);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(tailwind().name);
  }

  createEffect(() => {
    updateSimilarColor(original());
  });

  function updateSimilarColor(input: string) {
    if (input.length !== 3 && input.length !== 6) {
      return;
    }

    let closestDelta: number | undefined = undefined;
    let closestColor: TailwindColor | undefined = undefined;

    tailwindColors.forEach((color) => {
      const deltaE = DeltaE00Calculator.deltaE00FromHex(original(), color.hex);

      if (closestDelta === undefined) {
        closestDelta = deltaE;
        closestColor = color;
      } else if (deltaE < closestDelta) {
        closestDelta = deltaE;
        closestColor = color;
      }
    });

    if (closestColor) {
      setTailwind(closestColor);
    }
  }

  return (
    <div class="grid-cols-2 grid min-h-screen">
      <div
        class="text-black p-2 rounded-md flex gap-2 items-center justify-center"
        style={{ background: `#${original()}` }}
      >
        <input
          value={original().replace("#", "")}
          class={`text-zinc-100 text-xl font-semibold p-4 rounded-md bg-black/30`}
          onInput={(e) => setOriginal(e.currentTarget.value)}
        />
        <button onClick={() => handlePaste()} class="text-white">
          <PasteIcon />
        </button>
      </div>
      <div
        class="text-black p-2 rounded-md flex gap-2 items-center justify-center"
        style={{ background: `${tailwind().hex}` }}
      >
        <h1 class="text-zinc-100 text-xl font-semibold p-4 rounded-md bg-black/30">
          {tailwind().name}
        </h1>
        <button onClick={() => handleCopy()} class="text-white">
          <CopyIcon />
        </button>
      </div>
    </div>
  );
}
