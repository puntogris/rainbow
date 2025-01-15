import { createSignal } from 'solid-js';
import tailwindColors from '~/data/tailwind-colors.json';
import { DeltaE00Calculator } from '~/lib/deltaE00Calculator';
import type { TailwindColor } from '~/lib/tailwindColor';
import { twMerge } from 'tailwind-merge';
import { isLightColor } from '~/lib/colorUtils';
import CopyButton from '~/components/copyButton';
import PasteButton from '~/components/pasteButton';

export default function Tailwind() {
	const [original, setOriginal] = createSignal(tailwindColors[3].hex.replace('#', ''));
	const [tailwind, setTailwind] = createSignal(tailwindColors[3]);

	const originalHex = () => '#' + original();

	async function handlePaste() {
		const text = await navigator.clipboard.readText();
		if (text) {
			const trimmedText = text.slice(0, 6);
			updateOriginalColor(trimmedText);
		}
	}

	function handleCopy() {
		navigator.clipboard.writeText(tailwind().name);
	}

	function updateSimilarColor(input: string) {
		if (!input) {
			return;
		}
		if (input.length !== 3 && input.length !== 6) {
			return;
		}
		if (input.length === 3) {
			input = input[0] + input[0] + input[1] + input[1] + input[2] + input[2];
		}
		input = '#' + input;

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

	function updateOriginalColor(input: string) {
		input = input.replace('#', '');
		setOriginal(input);
		updateSimilarColor(input);
	}

	return (
		<div class="grid grow max-md:grid-rows-2 md:grid-cols-2">
			<div
				class="flex items-center justify-center gap-2 p-2"
				style={{ 'background-color': originalHex() }}
			>
				<div
					class={twMerge(
						'flex items-center gap-2 rounded bg-transparent p-2 text-center text-2xl font-semibold uppercase',
						isLightColor(originalHex())
							? 'text-black hover:bg-black/5'
							: 'text-white hover:bg-white/10'
					)}
				>
					#
					<input
						value={original()}
						size={6}
						maxLength={6}
						class="bg-transparent outline-none"
						onInput={(e) => updateOriginalColor(e.currentTarget.value)}
					/>
				</div>
				<PasteButton isLightTheme={isLightColor(originalHex())} onClick={() => handlePaste()} />
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
