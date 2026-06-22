import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { helpBaseOptions } from "@/lib/help-layout.shared";
import { helpSource } from "@/lib/help-source";

import "./help-docs.css";

export default function HelpLayout({ children }: LayoutProps<"/help">) {
  return (
    <DocsLayout
      tree={helpSource.getPageTree()}
      {...helpBaseOptions()}
      containerProps={{ className: "flex-1 help-docs-layout" }}
      sidebar={{
        collapsible: false,
        className:
          "help-docs-sidebar border-e-0 bg-white text-foreground shadow-none dark:bg-white dark:text-foreground",
      }}
    >
      {children}
    </DocsLayout>
  );
}
