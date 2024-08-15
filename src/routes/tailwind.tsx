import { createEffect, createSignal } from 'solid-js';
import tailwindColors from '~/data/tailwind-colors.json';
import { DeltaE00Calculator } from '~/lib/deltaE00Calculator';
import CopyIcon from '~/icons/copyIcon';
import PasteIcon from '~/icons/pasteIcon';
import type { TailwindColor } from '~/lib/tailwindColor';

export default function Tailwind() {
	const [original, setOriginal] = createSignal(tailwindColors[0].hex);
	const [tailwind, setTailwind] = createSignal<TailwindColor>(tailwindColors[0]);

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
		<div class="grid grow grid-cols-2">
			<div
				class="flex items-center justify-center gap-2 p-2 text-black"
				style={{ background: `#${original()}` }}
			>
				<input
					value={original().replace('#', '')}
					class={`rounded-md bg-black/30 p-4 text-xl font-semibold text-zinc-100`}
					onInput={(e) => setOriginal(e.currentTarget.value)}
				/>
				<button onClick={() => handlePaste()} class="text-white">
					<PasteIcon />
				</button>
			</div>
			<div
				class="flex items-center justify-center gap-2 p-2 text-black"
				style={{ background: `${tailwind().hex}` }}
			>
				<button
					onClick={() => handleCopy()}
					class="flex items-center gap-4 rounded-md bg-black/30 px-6 py-5 text-white hover:bg-black/40"
				>
					<h1 class="text-xl font-semibold text-zinc-100">{tailwind().name}</h1>
					<CopyIcon />
				</button>
			</div>
		</div>
	);
}
