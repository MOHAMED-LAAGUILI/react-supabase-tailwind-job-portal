import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

type LogoProps = {
  className?: string;
  alt?: string;
};

export const Logo = ({ className, alt }: LogoProps) => (
  <Link to="/">
    <img
      alt={alt || "Hirrd Logo"}
      className={cn("dark:invert", className)}
      src="/logo-dark.png"
    />
  </Link>
);
