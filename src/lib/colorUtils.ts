import tailwindColors from '../data/tailwind-colors.json';

function isLightColor(color: string) {
	// TODO improve this
	// Check if the color is in the correct format
	if (color[0] === '#' && color.length === 4) {
		color = color[0] + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
	}
	// Extract the RGB components
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	// Calculate luminance
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

	// If luminance is above a certain threshold, the color is light
	return luminance > 186;
}

function getRandomColor() {
	const randomColor = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
	return randomColor.hex;
}

export { isLightColor, getRandomColor };
