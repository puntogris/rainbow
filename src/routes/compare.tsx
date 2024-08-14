import { createSignal, Signal } from 'solid-js';
import tailwindColors from '../data/tailwind-colors.json';
import PlusIcon from '~/icons/plusIcon';
import XIcon from '~/icons/xIcon';
import PaletteIcon from '~/icons/paletteIcon';
import CopyIcon from '~/icons/copyIcon';

export default function Compare() {
	const [colors, setColors] = createSignal<{ hex: string }[]>([
		{ hex: getRandomTailwindColor() },
		{ hex: getRandomTailwindColor() }
	]);

	function getRandomTailwindColor() {
		const randomColor = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
		return randomColor.hex;
	}

	function addColor(index: number) {
		colors().splice(index + 1, 0, { hex: getRandomTailwindColor() });
		setColors([...colors()]);
	}

	function updateColor(color: string, index: number) {
		colors()[index].hex = color;

		const col = document.getElementById(index.toString());
		if (col) {
			col.style.backgroundColor = color;
		}

		const input = document.getElementById(`input_${index}`) as HTMLInputElement;
		if (input) {
			input.value = color;
		}
	}

	function removeColor(index: number) {
		colors().splice(index, 1);
		setColors([...colors()]);
	}

	function copyColor(index: number) {
		navigator.clipboard.writeText(colors()[index].hex);
	}

	return (
		<main class="flex grow">
			<div class="grid w-full grid-flow-col">
				{colors().map((color, index) => (
					<div
						id={index.toString()}
						class="relative flex flex-col items-center justify-center p-2"
						style={{ 'background-color': color.hex }}
					>
						<div class="flex flex-col items-center justify-center gap-3">
							<button onClick={() => removeColor(index)} class="rounded p-2 hover:bg-white/10">
								<XIcon class="h-6 w-6 text-white" />
							</button>
							<button onClick={() => copyColor(index)} class="rounded p-2 hover:bg-white/10">
								<CopyIcon class="h-6 w-6 text-white" />
							</button>
							<label for={`picker_${index}`} class="rounded p-2 hover:bg-white/10">
								<PaletteIcon class="h-6 w-6 text-white" />
							</label>
							<input
								id={`picker_${index}`}
								class="invisible"
								type="color"
								onInput={(e) => updateColor(e.currentTarget.value, index)}
							/>
						</div>

						<input
							value={color.hex}
							id={`input_${index}`}
							class="w-40 rounded-md bg-black/30 p-4 text-2xl font-semibold uppercase text-zinc-100 focus:outline-none"
							onInput={(e) => updateColor(e.currentTarget.value, index)}
						/>

						{index < colors().length - 1 && (
							<div class="absolute left-full top-1/2 z-10 flex h-full w-1/4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center p-2 text-white opacity-0 transition-all hover:opacity-100">
								<button
									onClick={() => addColor(index)}
									class="flex h-12 w-12 items-center justify-center rounded-full border-zinc-200 bg-white p-2 text-lg text-black shadow hover:bg-zinc-100"
								>
									<PlusIcon class="h-6 w-6" />
								</button>
							</div>
						)}
						{index === colors().length - 1 && (
							<div class="absolute right-0 top-1/2 z-10 flex h-full w-1/6 -translate-y-1/2 transform items-center justify-center p-2 text-white opacity-0 hover:opacity-100">
								<button
									onClick={() => addColor(index)}
									class="flex h-12 w-12 items-center justify-center rounded-full border-zinc-200 bg-white p-2 text-lg text-black shadow hover:bg-zinc-100"
								>
									<PlusIcon class="h-6 w-6" />
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</main>
	);
}
