import { createSignal, Index } from 'solid-js';
import tailwindColors from '../data/tailwind-colors.json';
import PlusIcon from '~/icons/plusIcon';
import XIcon from '~/icons/xIcon';
import PaletteIcon from '~/icons/paletteIcon';
import CopyIcon from '~/icons/copyIcon';
import { twMerge } from 'tailwind-merge';
import { isLightColor, getRandomTailwindColor } from '~/lib/colorUtils';

export default function Compare() {
	const [colors, setColors] = createSignal<{ hex: string }[]>([
		{ hex: '#121212' },
		{ hex: '#cbd5e1' }
	]);

	function addColor(index: number) {
		colors().splice(index + 1, 0, { hex: getRandomTailwindColor() });
		setColors([...colors()]);
	}

	function addColorAtStart() {
		colors().splice(0, 0, { hex: getRandomTailwindColor() });
		setColors([...colors()]);
	}

	function updateColor(color: string, index: number) {
		setColors(
			colors().map((c, i) => {
				return i == index ? { hex: color } : c;
			})
		);
	}

	function removeColor(index: number) {
		if (colors().length < 2) {
			return;
		}
		colors().splice(index, 1);
		setColors([...colors()]);
	}

	function copyColor(index: number) {
		navigator.clipboard.writeText(colors()[index].hex);
	}

	const [hoveredColumn, setHoveredColumn] = createSignal<null | number>(null);
	const [showButton, setShowButton] = createSignal<number | null>(null);
	const [showLeftButton, setShowLeftButton] = createSignal(false);

	return (
		<main class="flex grow">
			<div class="grid w-full auto-cols-min grid-flow-col md:auto-cols-fr">
				<Index each={colors()}>
					{(color, index) => (
						<div
							id={index.toString()}
							onMouseEnter={() => setHoveredColumn(index)}
							class="relative flex flex-col items-center justify-center p-2"
							style={{ 'background-color': color().hex }}
						>
							<div class="flex flex-col items-center justify-center gap-3">
								<div class={twMerge(hoveredColumn() === index ? 'visible' : 'invisible')}>
									<div class="flex flex-col items-center justify-center gap-3">
										<button
											onClick={() => removeColor(index)}
											class={twMerge(
												'rounded p-2 hover:bg-white/10',
												isLightColor(color().hex) ? 'text-black' : 'text-white'
											)}
										>
											<XIcon class="h-6 w-6" />
										</button>
										<button
											onClick={() => copyColor(index)}
											class={twMerge(
												'rounded p-2 hover:bg-white/10',
												isLightColor(color().hex) ? 'text-black' : 'text-white'
											)}
										>
											<CopyIcon class="h-6 w-6" />
										</button>
										<label
											for={`picker_${index}`}
											class={twMerge(
												'rounded p-2 hover:bg-white/10',
												isLightColor(color().hex) ? 'text-black' : 'text-white'
											)}
										>
											<PaletteIcon class="h-6 w-6" />
										</label>
										<input
											id={`picker_${index}`}
											class="invisible"
											type="color"
											onInput={(e) => updateColor(e.currentTarget.value, index)}
										/>
									</div>
								</div>

								<input
									value={color().hex}
									id={`input_${index}`}
									class={twMerge(
										'w-full rounded-md bg-transparent p-4 text-center text-2xl font-semibold uppercase text-zinc-100 focus:outline-none',
										isLightColor(color().hex) ? 'text-black' : 'text-white'
									)}
									onInput={(e) => updateColor(e.currentTarget.value, index)}
								/>
							</div>
							{index === 0 && (
								<div
									onMouseEnter={() => setShowLeftButton(true)}
									onMouseLeave={() => setTimeout(() => setShowLeftButton(false), 150)}
									class="absolute left-2 top-1/2 z-10 flex h-full w-12 -translate-y-1/2 transform items-center"
								>
									<button
										onClick={() => addColorAtStart()}
										class={twMerge(
											'flex h-11 w-11 items-center justify-center rounded-full border-zinc-200 bg-white p-2 text-lg text-black shadow transition-all hover:bg-zinc-100',
											showLeftButton() ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
										)}
									>
										<PlusIcon class="h-5 w-5" />
									</button>
								</div>
							)}
							{index < colors().length - 1 && (
								<div
									class="absolute right-0 top-1/2 z-10 flex h-full w-12 -translate-y-1/2 translate-x-1/2 transform items-center"
									onMouseEnter={() => setShowButton(index)}
									onMouseLeave={() => setTimeout(() => setShowButton(null), 150)} // Small delay before hiding
								>
									<button
										onClick={() => addColor(index)}
										class={twMerge(
											'flex h-12 w-12 items-center justify-center rounded-full border-zinc-200 bg-white p-2 text-lg text-black shadow transition-all hover:bg-zinc-100',
											showButton() === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
										)}
									>
										<PlusIcon class="h-6 w-6" />
									</button>
								</div>
							)}
							{index === colors().length - 1 && (
								<div
									onMouseEnter={() => setShowButton(index)}
									onMouseLeave={() => setTimeout(() => setShowButton(null), 150)}
									class="absolute right-2 top-1/2 z-10 flex h-full w-12 -translate-y-1/2 transform items-center"
								>
									<button
										onClick={() => addColor(index)}
										class={twMerge(
											'flex h-11 w-11 items-center justify-center rounded-full border-zinc-200 bg-white p-2 text-lg text-black shadow transition-all hover:bg-zinc-100',
											showButton() === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
										)}
									>
										<PlusIcon class="h-5 w-5" />
									</button>
								</div>
							)}
						</div>
					)}
				</Index>
			</div>
		</main>
	);
}
