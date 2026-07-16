import { AppleIcon } from "../components/apple-icon";
import { FacebookIcon } from "../components/facebook-icon";
import { GooglePlayIcon } from "../components/google-play-icon";
import { InstagramIcon } from "../components/instagram-icon";
import { LinkedinIcon } from "../components/linkedin-icon";
import { Logo } from "../components/logo";
import { Button } from "../components/ui/button";
import { XIcon } from "../components/x-icon";
import { AnimatedContainer } from "../providers/animated-container";

export function Footer() {
  return (
    <footer className="border-t">
      <AnimatedContainer className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Grid container with headings and links */}
        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          {footerLinks.map(item => (
            <div key={item.title}>
              <h3 className="mb-4 text-xs">{item.title}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {item.links.map(link => (
                  <li key={link.label}>
                    <a
                      className="hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-border" />
        {/* Social Buttons + App Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="space-y-4">
            <Logo className="h-16" />
            <p className="mt-8 text-muted-foreground text-sm md:mt-0">Your Job Portal</p>
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon, href, name }) => (
              <Button
                key={name}
                nativeButton={false}
                render={
                  <a
                    aria-label={name}
                    href={href}
                  />
                }
                size="icon"
                variant="outline"
              >
                {icon}
              </Button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              className="h-11"
              nativeButton={false}
              render={
                <a
                  aria-label="Get it on Google Play"
                  href="#"
                />
              }
            >
              <GooglePlayIcon className="size-5" />
              <div className="flex flex-col items-start justify-center pr-2 text-left">
                <span className="font-light text-[10px] leading-none tracking-tighter">GET IT ON</span>
                <p className="font-bold text-base leading-none">Google Play</p>
              </div>
            </Button>

            <Button
              className="h-11"
              nativeButton={false}
              render={
                <a
                  aria-label="Download on the App Store"
                  href="#"
                />
              }
            >
              <AppleIcon className="size-5" />
              <div className="flex flex-col items-start justify-center pr-2 text-left">
                <span className="text-[10px] leading-none tracking-tighter">Download on the</span>
                <p className="font-bold text-base leading-none">App Store</p>
              </div>
            </Button>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="py-4 text-center text-muted-foreground text-xs">
          <p>&copy; {new Date().getFullYear()} Hirrd, All rights reserved</p>
        </div>
      </AnimatedContainer>
    </footer>
  );
}

const footerLinks = [
  {
    links: [
      { href: "#", label: "Engineering Blog" },
      { href: "#", label: "Marketplace" },
      { href: "#", label: "What’s New" },
      { href: "#", label: "About" },
      { href: "#", label: "Press" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Social Good" },
    ],
    title: "Company",
  },
  {
    links: [
      { href: "#", label: "Linktree for Enterprise" },
      { href: "#", label: "2023 Creator Report" },
      { href: "#", label: "2022 Creator Report" },
      { href: "#", label: "Charities" },
      { href: "#", label: "What’s Trending" },
      { href: "#", label: "Creator Profile Directory" },
      { href: "#", label: "Explore Templates" },
    ],
    title: "Community",
  },
  {
    links: [
      { href: "#", label: "Help Topics" },
      { href: "#", label: "Getting Started" },
      { href: "#", label: "Linoree Pro" },
      { href: "#", label: "Features & How-tos" },
      { href: "#", label: "FAQs" },
      { href: "#", label: "Report a Violation" },
    ],
    title: "Support",
  },
  {
    links: [
      { href: "#", label: "Terms & Conditions" },
      { href: "#", label: "Privacy Notice" },
      { href: "#", label: "Cookie Notice" },
      { href: "#", label: "Trust Center" },
      { href: "#", label: "Cookie Preferences" },
      { href: "#", label: "Transparency Report" },
      { href: "#", label: "Law Enforcement Access Policy" },
    ],
    title: "Legal",
  },
];

const socialLinks = [
  {
    href: "#",
    icon: <FacebookIcon />,
    name: "Facebook",
  },
  {
    href: "#",
    icon: <InstagramIcon />,
    name: "Instagram",
  },
  {
    href: "#",
    icon: <LinkedinIcon />,
    name: "LinkedIn",
  },
  {
    href: "#",
    icon: <XIcon />,
    name: "X",
  },
];
