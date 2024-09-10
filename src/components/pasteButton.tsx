import { createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import CheckIcon from '~/icons/checkIcon';
import PasteIcon from '~/icons/pasteIcon';

interface PasteButtonProps {
	isLightTheme: boolean;
	onClick: () => void;
}

function PasteButton(props: PasteButtonProps) {
	const [isAnimating, setIsAnimating] = createSignal(false);

	return (
		<button
			onClick={() => {
				props.onClick();
				setIsAnimating(true);
				setTimeout(() => setIsAnimating(false), 1000);
			}}
			class={twMerge(
				'rounded p-2',
				props.isLightTheme ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'
			)}
		>
			<div class="relative flex items-center">
				<CheckIcon
					class={twMerge(`h-6 w-6 transition-opacity`, isAnimating() ? 'opacity-100' : 'opacity-0')}
				/>
				<PasteIcon
					class={twMerge(
						'absolute h-6 w-6 transition-opacity',
						isAnimating() ? 'opacity-0' : 'opacity-100'
					)}
				/>
			</div>
		</button>
	);
}

export default PasteButton;
