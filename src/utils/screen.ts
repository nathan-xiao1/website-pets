export function isSmallScreenSize(): boolean {
  return (
    Math.min(
      document.documentElement.clientHeight,
      document.documentElement.clientWidth
    ) < 768
  );
}
