import { Suspense } from 'solid-js';
import Nav from '../components/nav';
import '../app.css';

export default function RootLayout(props) {
	return (
		<div class="flex min-h-screen flex-col">
			<Nav />
			<Suspense>{props.children}</Suspense>
		</div>
	);
}
