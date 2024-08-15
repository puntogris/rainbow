const { sqrt, pow, atan2, cos, sin, exp, abs, min, max, PI } = Math;

function hexToLab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  const [x, y, z] = rgbToxyz(r, g, b);
  return xyzToLab(x, y, z); // [l, a, b]
}

function hexToRgb(hex: string): [number, number, number] {
  // Remove the leading '#' if present
  hex = hex.replace(/^#/, "");

  // Expand shorthand hex format (e.g., #03F -> #0033FF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Validate the length of the hex string
  if (hex.length !== 6) {
    throw new Error(
      "Invalid hex color format. Expected format is #RGB or #RRGGBB."
    );
  }

  // Parse the hex values into RGB components
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
}

function rgbToxyz(r: number, g: number, b: number): [number, number, number] {
  // Clamp RGB values to the range [0, 255]
  r = max(0, min(255, r));
  g = max(0, min(255, g));
  b = max(0, min(255, b));

  // Convert RGB to the [0, 1] range
  r /= 255;
  g /= 255;
  b /= 255;

  // Apply the gamma correction
  r = r > 0.04045 ? pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to the XYZ color space
  r *= 100;
  g *= 100;
  b *= 100;

  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  return [x, y, z];
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // Reference white (D65, 10° Observer)
  const referenceX = 94.811;
  const referenceY = 100;
  const referenceZ = 107.304;

  // Normalize the XYZ values
  x = x / referenceX;
  y = y / referenceY;
  z = z / referenceZ;

  const applyGammaCorrection = (value: number) => {
    if (value > 0.008856) {
      return pow(value, 1 / 3);
    } else {
      return 7.787 * value + 16 / 116;
    }
  };

  // Apply gamma correction to adjust for non-linear perception
  // Values greater than epsilon are cube-rooted; otherwise, linear adjustment is used
  x = applyGammaCorrection(x);
  y = applyGammaCorrection(y);
  z = applyGammaCorrection(z);

  // Convert to LAB color space
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [l, a, b];
}

function deltaE00(
  L1: number,
  a1: number,
  b1: number,
  L2: number,
  a2: number,
  b2: number,
  Kl = 1,
  Kc = 1,
  Kh = 1
): number {
  // Delta E (CIE 2000)
  // Formula from http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
  // Implementation fromhttps://github.com/gka/chroma.js/blob/main/src/utils/delta-e.js
  const rad2deg = (rad: number) => (360 * rad) / (2 * PI);
  const deg2rad = (deg: number) => (2 * PI * deg) / 360;

  const avgL = (L1 + L2) / 2;
  const C1 = sqrt(pow(a1, 2) + pow(b1, 2));
  const C2 = sqrt(pow(a2, 2) + pow(b2, 2));
  const avgC = (C1 + C2) / 2;
  const G = 0.5 * (1 - sqrt(pow(avgC, 7) / (pow(avgC, 7) + pow(25, 7))));
  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
  const C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
  const avgCp = (C1p + C2p) / 2;
  const arctan1 = rad2deg(atan2(b1, a1p));
  const arctan2 = rad2deg(atan2(b2, a2p));
  const h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
  const h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
  const avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
  const T =
    1 -
    0.17 * cos(deg2rad(avgHp - 30)) +
    0.24 * cos(deg2rad(2 * avgHp)) +
    0.32 * cos(deg2rad(3 * avgHp + 6)) -
    0.2 * cos(deg2rad(4 * avgHp - 63));
  let deltaHp = h2p - h1p;
  deltaHp =
    abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
  deltaHp = 2 * sqrt(C1p * C2p) * sin(deg2rad(deltaHp) / 2);
  const deltaL = L2 - L1;
  const deltaCp = C2p - C1p;
  const sl = 1 + (0.015 * pow(avgL - 50, 2)) / sqrt(20 + pow(avgL - 50, 2));
  const sc = 1 + 0.045 * avgCp;
  const sh = 1 + 0.015 * avgCp * T;
  const deltaTheta = 30 * exp(-pow((avgHp - 275) / 25, 2));
  const Rc = 2 * sqrt(pow(avgCp, 7) / (pow(avgCp, 7) + pow(25, 7)));
  const Rt = -Rc * sin(2 * deg2rad(deltaTheta));
  const result = sqrt(
    pow(deltaL / (Kl * sl), 2) +
      pow(deltaCp / (Kc * sc), 2) +
      pow(deltaHp / (Kh * sh), 2) +
      Rt * (deltaCp / (Kc * sc)) * (deltaHp / (Kh * sh))
  );
  return max(0, min(100, result));
}

class DeltaE00Calculator {
  // Cache to store LAB values for HEX colors
  private static labCache = new Map<string, [number, number, number]>();

  // Convert HEX to LAB and cache the result
  private static hexToLab(hex: string): [number, number, number] {
    if (!this.labCache.has(hex)) {
      const lab = hexToLab(hex);
      this.labCache.set(hex, lab);
    }
    return this.labCache.get(hex)!; // Non-null assertion since we are sure the value exists
  }

  // Calculate Delta E 2000 between two HEX colors
  public static deltaE00FromHex(hex1: string, hex2: string): number {
    const [l1, a1, b1] = this.hexToLab(hex1);
    const [l2, a2, b2] = this.hexToLab(hex2);

    return deltaE00(l1, a1, b1, l2, a2, b2);
  }
}

export { DeltaE00Calculator };
