import { createSignal, Signal } from 'solid-js';

export default function Compare() {
	const [colors, setColors] = createSignal<{ hex: string }[]>([
		{ hex: '#121212' },
		{ hex: '#112211' },
		{ hex: '#000' }
	]);
	const colorsRandom = [
		'#E63946',
		'#F1FAEE',
		'#A8DADC',
		'#457B9D',
		'#1D3557',
		'#FFBE0B',
		'#FB5607',
		'#FF006E',
		'#8338EC',
		'#3A86FF'
	];
	function addColor(index: number) {
		const randomColor = colorsRandom[Math.floor(Math.random() * colorsRandom.length)];
		colors().splice(index + 1, 0, { hex: randomColor });

		setColors([...colors()]);
	}

	function updateColor(color: string, index: number) {
		colors()[index].hex = color;

		const col = document.getElementById(index.toString());
		if (col) {
			col.style.backgroundColor = color;
		}
	}

	return (
		<main class="flex grow">
			<div class="grid w-full grid-flow-col">
				{colors().map((color, index) => (
					<div
						id={index.toString()}
						class="relative flex items-center justify-center p-2"
						style={{ 'background-color': color.hex }}
					>
						<input
							value={color.hex}
							class="w-full max-w-xs rounded-md bg-black/30 p-4 text-xl font-semibold text-zinc-100"
							onInput={(e) => updateColor(e.currentTarget.value, index)}
						/>
						<div>
							<label for={`picker_${index}`}>Picker</label>
							<input
								id={`picker_${index}`}
								class="invisible"
								type="color"
								onInput={(e) => updateColor(e.currentTarget.value, index)}
							/>
						</div>
						{index < colors().length - 1 && (
							<div class="absolute left-full top-1/2 z-10 flex h-full w-1/4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center p-2 text-white opacity-0 hover:opacity-100">
								<button
									onClick={() => addColor(index)}
									class="h-12 w-12 rounded-full bg-white p-2 text-lg text-black"
								>
									+
								</button>
							</div>
						)}
						{index === colors().length - 1 && (
							<div class="absolute right-0 top-1/2 z-10 flex h-full w-1/4 -translate-y-1/2 transform items-center justify-center p-2 text-white opacity-0 hover:opacity-100">
								<button
									onClick={() => addColor(index)}
									class="h-12 w-12 rounded-full bg-white p-2 text-lg text-black"
								>
									+
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</main>
	);
}
