import { useLocation } from '@solidjs/router';
import { twMerge } from 'tailwind-merge';
import RainbowIcon from '../icons/rainbowIcon';

export default function Nav() {
	const location = useLocation();

	const active = (path: string) => path == location.pathname;

	const navItems = [
		{ name: 'Home', path: '/' },
		{ name: 'Tailwind Nearest', path: '/tailwind' },
		{ name: 'Colors Comparator', path: '/compare' }
	];
	return (
		<nav class="relative overflow-hidden p-2">
			<div class="absolute inset-0 bg-gradient-to-r from-rose-500 via-blue-500 to-purple-500" />

			<div class="absolute inset-0 bg-white/10 backdrop-blur-sm" />

			<div class="relative flex items-center justify-center">
				{navItems.map((item, index) => (
					<a
						href={item.path}
						class={twMerge(
							'mx-1 flex gap-2 rounded px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200',
							active(item.path) ? 'bg-white/10' : 'hover:bg-white/10'
						)}
					>
						{item.name === 'Home' ? <RainbowIcon class="h-5 w-5" /> : item.name}
					</a>
				))}
			</div>
		</nav>
	);
}
