export default function NotFound() {
	return (
		<main class="relative flex grow flex-col items-center justify-center">
			<div class="absolute inset-0 bg-gradient-to-r from-rose-500 via-blue-500 to-purple-500" />
			<div class="relative flex flex-col items-center justify-center gap-2 rounded px-5 py-3 text-center">
				<div class="flex items-center gap-2">
					<h1 class="text-4xl font-medium text-white">Oops, looks like the end of the rainbow!</h1>
				</div>
				<p class="text-lg text-white">
					The page you’re looking for isn’t here. Maybe it’s hidden in the next rainbow over?
				</p>
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
