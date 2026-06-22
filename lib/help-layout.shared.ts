import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function helpBaseOptions(): BaseLayoutProps {
  return {
    nav: {
      enabled: false,
    },
    themeSwitch: {
      enabled: false,
    },
    searchToggle: {
      enabled: false,
    },
  };
}
