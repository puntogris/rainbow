import RainbowIcon from '~/icons/rainbowIcon';

export default function NotFound() {
	return (
		<main class="flex grow flex-col items-center justify-center p-4 text-gray-700">
			<RainbowIcon class="mx-auto h-24 w-24 text-white" />
			<h1 class="text-2xl font-medium uppercase text-sky-300">Not Found</h1>
			<p class="text-white">The page you are looking for does not exist.</p>
		</main>
	);
}
