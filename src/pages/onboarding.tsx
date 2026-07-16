import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import CardFlip from "../components/kokonutui/card-flip";
import { AnimatedContainer } from "../providers/animated-container";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role: string) => {
    if (!user) return;
    try {
      await user.update({ unsafeMetadata: { role } });
      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    } catch (err) {
      console.error("Error during onboarding:", err);
    }
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user.unsafeMetadata.role === "recruiter" ? "/post-job" : "/jobs");
    }
  }, [user, navigate]);

  if (!isLoaded) {
    return (
      <BarLoader
        className="mb-4"
        color="#36d7b7"
        width={"100%"}
      />
    );
  }

  return (
    <AnimatedContainer className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative text-center mb-12">
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl" />
        </div>
        <h2 className="relative gradient-title font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tighter mb-4">
          I am a...
        </h2>
        <p className="relative text-muted-foreground text-sm sm:text-base">Choose your role to get started</p>
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 md:flex-row">
        <CardFlip
          description="Browse jobs, apply effortlessly, and track your applications all in one place."
          features={["Smart job search", "Quick apply", "Application tracking", "Saved listings"]}
          onAction={() => handleRoleSelection("candidate")}
          subtitle="Find your next opportunity"
          title="Candidate"
        />

        <CardFlip
          description="Post jobs, review applicants, and build your dream team with powerful tools."
          features={["Fast job posting", "Applicant management", "Talent discovery", "Company branding"]}
          onAction={() => handleRoleSelection("recruiter")}
          subtitle="Hire the best talent"
          title="Recruiter"
        />
      </section>
    </AnimatedContainer>
  );
};

export default Onboarding;
