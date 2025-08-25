import type { LucideIcon } from "lucide-react";
interface MenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  muted?: boolean;
}

export type { MenuItem };
