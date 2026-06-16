import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { FOOTER_LINKS } from "@/app/(marketing)/_config/marketing-content";
import { ORG_CONFIG, SITE_CONFIG } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card py-12 text-xs">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BrandLogo size="sm" />
              <span className="text-base font-bold text-foreground">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              专为自媒体创作者打造的高效数据采集管理浏览器插件，支持多维联动。一键降本提效。
            </p>
          </div>

          <div>
            <h5 className="mb-4 font-bold tracking-wider text-foreground uppercase">
              产品使用
            </h5>
            <ul className="space-y-2.5 text-muted-foreground">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 font-bold tracking-wider text-foreground uppercase">
              法律与声明
            </h5>
            <ul className="space-y-2.5 text-muted-foreground">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 font-bold tracking-wider text-foreground uppercase">
              支持与反馈
            </h5>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              使用中如有任何功能建议、漏洞反馈、或者定制版本需求，欢迎邮件随时来信。
            </p>
            <p className="font-bold text-foreground">
              <a
                href={`mailto:${SITE_CONFIG.supportEmail}`}
                className="hover:text-primary"
              >
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>
            © 2026 {SITE_CONFIG.name}. All rights reserved.
            仅用于公开合规数据及你已被许可的数据整理使用。
          </p>
          <p className="mt-2">
            由 {ORG_CONFIG.brandName}（{ORG_CONFIG.legalName}）提供
          </p>
        </div>
      </div>
    </footer>
  );
}
