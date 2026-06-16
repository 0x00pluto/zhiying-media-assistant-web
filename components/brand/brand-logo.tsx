import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_SIZES = {
  sm: { src: "/brand/icon-128.png", px: 28, className: "size-7" },
  md: { src: "/brand/icon-300.png", px: 36, className: "size-9" },
} as const;

type BrandLogoProps = {
  size?: keyof typeof LOGO_SIZES;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  const logo = LOGO_SIZES[size];

  return (
    <Image
      src={logo.src}
      alt="智赢媒体助手"
      width={logo.px}
      height={logo.px}
      priority={priority}
      className={cn(logo.className, "shrink-0 rounded-lg", className)}
    />
  );
}
