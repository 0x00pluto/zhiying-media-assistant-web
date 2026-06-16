/**
 * 首屏环境光背景：与设计稿 HTML 一致的光晕 + 渐变。
 * 注意：不能使用 -z-10 叠在带 bg-background 的父级下，否则光晕会被父级背景完全遮住。
 */
export function HeroAmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(920px,100vh)] overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 blur-[120px] dark:bg-emerald-500/18" />
      <div className="absolute top-10 right-10 size-[300px] rounded-full bg-teal-400/15 blur-[100px] dark:bg-teal-500/12" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-50/20 dark:from-emerald-950/25 dark:to-emerald-950/15" />
    </div>
  );
}
