export default function Home() {
	return (
		<main class="relative flex grow flex-col items-center justify-center">
			<div class="absolute inset-0 bg-gradient-to-r from-rose-500 via-blue-500 to-purple-500" />
			<div class="relative flex flex-col items-center justify-center gap-2 rounded px-5 py-3 text-center">
				<div class="text-5xl font-semibold text-white">
					<span class="transition-colors duration-200 hover:text-red-300">r</span>
					<span class="transition-colors duration-200 hover:text-orange-300">a</span>
					<span class="transition-colors duration-200 hover:text-yellow-300">i</span>
					<span class="transition-colors duration-200 hover:text-green-300">n</span>
					<span class="transition-colors duration-200 hover:text-blue-300">b</span>
					<span class="transition-colors duration-200 hover:text-indigo-300">o</span>
					<span class="transition-colors duration-200 hover:text-purple-300">w</span>
					<span class="text-white">.</span>
				</div>
				<p class="text-lg text-white">created as light bends through water droplets in the air</p>
			</div>
			<a
				href="https://www.puntogris.com/"
				target="_blank"
				class="absolute bottom-0 right-0 p-2 text-sm text-zinc-800 hover:underline"
			>
				puntogris enterprises ↗
			</a>
		</main>
	);
}
