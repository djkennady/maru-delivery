import path from "node:path";

export function dataFile(name: string): string {
  const override = process.env.MARU_DATA_DIR?.trim();
  if (override) {
    return path.join(/* turbopackIgnore: true */ override, name);
  }
  return path.join(process.cwd(), "data", name);
}
