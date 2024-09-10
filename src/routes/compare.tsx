import { createSignal, Index } from 'solid-js';
import PlusIcon from '~/icons/plusIcon';
import XIcon from '~/icons/xIcon';
import PaletteIcon from '~/icons/paletteIcon';
import { twMerge } from 'tailwind-merge';
import { isLightColor, getRandomColor } from '~/lib/colorUtils';
import CopyButton from '~/components/copyButton';

export default function Compare() {
	const [colors, setColors] = createSignal<{ hex: string }[]>([
		{ hex: '#121212' },
		{ hex: '#cbd5e1' }
	]);

	const [hoveredColumn, setHoveredColumn] = createSignal<null | number>(null);
	const [showButton, setShowButton] = createSignal<number | null>(null);
	const [showLeftButton, setShowLeftButton] = createSignal(false);

	function addColor(index: number) {
		colors().splice(index + 1, 0, { hex: getRandomColor() });
		setColors([...colors()]);
	}

	function addColorAtStart() {
		colors().splice(0, 0, { hex: getRandomColor() });
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

	return (
		<main class="flex grow">
			<div class="grid w-full grid-cols-2">
				<Index each={colors()}>
					{(color, index) => (
						<div
							onMouseEnter={() => setHoveredColumn(index)}
							class="relative flex flex-col items-center justify-center p-2"
							style={{ 'background-color': color().hex }}
						>
							<div class="flex flex-col items-center justify-center gap-3">
								<div class={twMerge(hoveredColumn() === index ? 'visible' : 'invisible')}>
									<ColorButtonGroup
										color={color()}
										onRemove={() => removeColor(index)}
										onCopy={() => copyColor(index)}
										onUpdate={(value) => updateColor(value, index)}
									/>
								</div>
								<input
									value={color().hex}
									size={8}
									maxLength={7}
									class={twMerge(
										'w-full rounded-md bg-transparent p-4 text-center text-2xl font-semibold uppercase text-zinc-100 focus:outline-none',
										isLightColor(color().hex)
											? 'text-black hover:bg-black/5'
											: 'text-white hover:bg-white/10'
									)}
									onInput={(e) => updateColor(e.currentTarget.value, index)}
								/>
							</div>
							{index === 0 && (
								<div
									onMouseEnter={() => setShowLeftButton(true)}
									onMouseLeave={() => setTimeout(() => setShowLeftButton(false), 150)}
									class="absolute left-0 top-1/2 z-10 flex h-full w-14 -translate-y-1/2 transform items-center p-1"
								>
									<AddColorButton onClick={addColorAtStart} isVisible={showLeftButton()} />
								</div>
							)}
							{index < colors().length - 1 && (
								<div
									class="absolute right-0 top-1/2 z-10 flex h-full w-12 -translate-y-1/2 translate-x-1/2 transform items-center"
									onMouseEnter={() => setShowButton(index)}
									onMouseLeave={() => setTimeout(() => setShowButton(null), 150)}
								>
									<AddColorButton
										onClick={() => addColor(index)}
										isVisible={showButton() === index}
									/>
								</div>
							)}
							{index === colors().length - 1 && (
								<div
									onMouseEnter={() => setShowButton(index)}
									onMouseLeave={() => setTimeout(() => setShowButton(null), 150)}
									class="absolute right-0 top-1/2 z-10 flex h-full w-14 -translate-y-1/2 transform items-center p-1"
								>
									<AddColorButton
										onClick={() => addColor(index)}
										isVisible={showButton() === index}
									/>
								</div>
							)}
						</div>
					)}
				</Index>
			</div>
		</main>
	);
}

function ColorButtonGroup(props: {
	color: { hex: string };
	onRemove: () => void;
	onCopy: () => void;
	onUpdate: (value: string) => void;
}) {
	return (
		<div class="flex flex-col items-center justify-center gap-3">
			<button
				onClick={props.onRemove}
				class={twMerge(
					'rounded p-2',
					isLightColor(props.color.hex)
						? 'text-black hover:bg-black/5'
						: 'text-white hover:bg-white/10'
				)}
			>
				<XIcon class="h-6 w-6" />
			</button>
			<CopyButton isLightTheme={isLightColor(props.color.hex)} onClick={() => props.onCopy()} />
			<label
				for={`picker_${props.color.hex}`}
				class={twMerge(
					'rounded p-2',
					isLightColor(props.color.hex)
						? 'text-black hover:bg-black/5'
						: 'text-white hover:bg-white/10'
				)}
			>
				<PaletteIcon class="h-6 w-6" />
			</label>
			<input
				id={`picker_${props.color.hex}`}
				class="invisible"
				type="color"
				onInput={(e) => props.onUpdate(e.currentTarget.value)}
			/>
		</div>
	);
}

function AddColorButton(props: { onClick: () => void; isVisible: boolean }) {
	return (
		<button
			onClick={props.onClick}
			class={twMerge(
				'flex h-11 w-11 items-center justify-center rounded-full border-zinc-200 bg-white p-2 text-lg text-black shadow transition-all hover:bg-zinc-100',
				props.isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
			)}
		>
			<PlusIcon class="h-6 w-6" />
		</button>
	);
}
