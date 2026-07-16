import { SignedIn, SignedOut, SignIn, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, LogIn, PenBox, User } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { Logo } from "../components/logo";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Button } from "../components/ui/button";

const Header = () => {
  const [search, setSearch] = useSearchParams();
  const showSignIn = search.has("sign-in");
  const { user } = useUser();
  const { userId, has, isLoaded } = useAuth();

  const hasPremiumAccess = has?.({ plan: "pro" }) ?? false;
  const hasEnterpriseAccess = has?.({ plan: "entreprise" }) ?? false;
  const activePlan = hasEnterpriseAccess ? "Enterprise" : hasPremiumAccess ? "Pro" : "Free";

  const prevUserRef = useRef(user);

  useEffect(() => {
    if (prevUserRef.current === undefined) {
      prevUserRef.current = user;
      return;
    }
    if (prevUserRef.current === null && user) {
      toast.success("Logged in successfully");
    }
    if (prevUserRef.current && user === null) {
      toast("Logged out", { icon: "👋" });
    }
    prevUserRef.current = user;
  }, [user]);

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setSearch({});
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur-lg">
        <nav className="py-1 px-4 md:px-8 lg:px-16 flex justify-between items-center max-w-7xl mx-auto">
          <Logo className="h-14" />

          <div className="flex gap-4 items-center">
            <SignedOut>
              <Button
                className="gap-2"
                onClick={() => setSearch({ "sign-in": "true" })}
                variant="outline"
              >
                <LogIn size={16} />
                Login
              </Button>
            </SignedOut>
            <SignedIn>
              {user?.unsafeMetadata?.role === "recruiter" && (
                <Link to="/post-job">
                  <Button
                    className="rounded-md"
                    variant="outline"
                  >
                    <PenBox
                      className="mr-2"
                      size={20}
                    />
                    Post a Job
                  </Button>
                </Link>
              )}
            </SignedIn>
            <AnimatedThemeToggler />

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    href="#"
                    label={`ID: ${userId}`}
                    labelIcon={<User size={15} />}
                  />
                  <UserButton.Link
                    href="/my-jobs"
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                  />
                  <UserButton.Link
                    href="/saved-jobs"
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
              {isLoaded && (
                <span className="hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                  {activePlan}
                </span>
              )}
            </SignedIn>
          </div>
        </nav>
      </header>

      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={handleOverlayClick}
          onKeyDown={e => {
            if (e.key === "Escape") {
              setSearch({});
            }
          }}
          role="presentation"
        >
          <div className="w-full max-w-md mx-4">
            <SignIn
              fallbackRedirectUrl="/onboarding"
              signUpForceRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
