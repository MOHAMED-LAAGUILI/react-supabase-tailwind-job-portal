import { SignedIn, SignedOut, SignIn, UserButton, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, LogIn, PenBox } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { Logo } from "../components/logo";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Button } from "../components/ui/button";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
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

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
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
                onClick={() => setShowSignIn(true)}
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
                    className="rounded-full"
                    variant="destructive"
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
            </SignedIn>
          </div>
        </nav>
      </header>

      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={handleOverlayClick}
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
