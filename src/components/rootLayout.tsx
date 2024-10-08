import { Suspense } from 'solid-js';
import RootNav from './rootNav';
import '../app.css';

export default function RootLayout(props) {
	return (
		<div class="flex min-h-dvh flex-col">
			<RootNav />
			<Suspense>{props.children}</Suspense>
		</div>
	);
}
