import * as React from "react";

export type IconSize = number | string;

export interface BaseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: IconSize;
  className?: string;
}

export type LogoVariant = "color" | "white" | "monochrome" | "outline";
export type LogoBackground = "squircle" | "circle" | "none";

export interface LogoProps extends BaseIconProps {
  variant?: LogoVariant;
  withBackground?: boolean;
  bgType?: LogoBackground;
}

export type SilviMood =
  | "idle"
  | "thinking"
  | "typing"
  | "checking"
  | "processing"
  | "success"
  | "alert"
  | "happy"
  | "sleepy";

export interface SilviIconProps extends BaseIconProps {
  mood?: SilviMood;
  glow?: boolean;
  animated?: boolean;
}
