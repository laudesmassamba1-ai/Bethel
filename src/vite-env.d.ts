/// <reference types="vite/client" />

declare module "lucide-react" {
  import type { FC, SVGAttributes } from "react";
  interface LucideProps extends SVGAttributes<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
  }
  export type Icon = FC<LucideProps>;
  export const Beef: Icon;
  export const Pizza: Icon;
  export const Sandwich: Icon;
  export const CakeSlice: Icon;
  export const Coffee: Icon;
  export const UtensilsCrossed: Icon;
  export const ShoppingBag: Icon;
  export const Star: Icon;
  export const Clock: Icon;
  export const Flame: Icon;
  export const Sparkles: Icon;
  export const X: Icon;
  export const MessageCircle: Icon;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const CheckCircle: Icon;
  export const LogOut: Icon;
  export const LogIn: Icon;
  export const Shield: Icon;
  export const Menu: Icon;
  export const ExternalLink: Icon;
  export const Phone: Icon;
  export const ChevronRight: Icon;
  export const Trash2: Icon;
  export const Plus: Icon;
  export const Minus: Icon;
  export const ShoppingCart: Icon;
  export const Search: Icon;
  export const Tag: Icon;
}
