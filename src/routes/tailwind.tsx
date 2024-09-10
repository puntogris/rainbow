import { createEffect, createSignal } from 'solid-js';
import tailwindColors from '~/data/tailwind-colors.json';
import { DeltaE00Calculator } from '~/lib/deltaE00Calculator';
import type { TailwindColor } from '~/lib/tailwindColor';
import { twMerge } from 'tailwind-merge';
import { isLightColor } from '~/lib/colorUtils';
import CopyButton from '~/components/copyButton';
import PasteButton from '~/components/pasteButton';

export default function Tailwind() {
	const [original, setOriginal] = createSignal(tailwindColors[3].hex);
	const [tailwind, setTailwind] = createSignal(tailwindColors[3]);

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
		if (input.length > 4 || input.length < 7) {
			return;
		}

		let closestDelta: number | undefined = undefined;
		let closestColor: TailwindColor | undefined = undefined;

		tailwindColors.forEach((color) => {
			const deltaE = DeltaE00Calculator.deltaE00FromHex(input, color.hex);

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
				class="flex items-center justify-center gap-2 p-2"
				style={{ 'background-color': original() }}
			>
				<input
					value={original()}
					size={7}
					maxLength={7}
					class={twMerge(
						'rounded bg-transparent p-4 text-center text-2xl font-semibold uppercase outline-none',
						isLightColor(original())
							? 'text-black hover:bg-black/5'
							: 'text-white hover:bg-white/10'
					)}
					onInput={(e) => setOriginal(e.currentTarget.value)}
				/>
				<PasteButton isLightTheme={isLightColor(original())} onClick={() => handlePaste()} />
			</div>
			<div
				class="flex items-center justify-center gap-2 p-2 text-black"
				style={{ background: tailwind().hex }}
			>
				<div class="flex items-center gap-4">
					<h1
						class={twMerge(
							'p-4 text-center text-2xl font-semibold',
							isLightColor(tailwind().hex) ? 'text-black' : 'text-white'
						)}
					>
						{tailwind().name}
					</h1>
					<CopyButton isLightTheme={isLightColor(tailwind().hex)} onClick={() => handleCopy()} />
				</div>
			</div>
		</div>
	);
}
