import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

type LogoProps = {
  className?: string;
  alt?: string;
};

export const Logo = ({ className, alt }: LogoProps) => (
  <Link to="/">
    <img
      src="/logo-dark.png"
      className={cn("dark:invert", className)}
      alt={alt || "Hirrd Logo"}
    />
  </Link>
);
