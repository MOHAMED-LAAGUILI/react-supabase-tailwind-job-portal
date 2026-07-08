

import { companies } from "../data/companies";
import { faqs } from "../data/faqs";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Search, BriefcaseBusiness } from "lucide-react";
import { Logo } from "../components/logo";
import CardFlip from "../components/kokonutui/card-flip";
import { InfiniteSlider } from "../components/infinite-slider";
import { ProgressiveBlur } from "../components/progressive-blur";
import { AnimatedContainer } from "../layout/animated-container";
import { useUser } from "@clerk/clerk-react";
import { TestimonialList } from "../components/testimonial-list";
import { TESTIMONIALS_1, TESTIMONIALS_2 } from "../data/testimonials";

const LandingPage = () => {
    const { user, isSignedIn } = useUser();
const isCandidate = user?.unsafeMetadata?.role === "candidate";
const navigate = useNavigate();
  return (
    <AnimatedContainer className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center relative">
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
        </div>
        <h1 className="relative flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Dream Job
          <span className="flex items-center gap-2 sm:gap-6">
            and get
      
        
                                                  
                                                <Logo className="h-30"/>
            
          </span>
        </h1>
        <p className="relative text-transparent bg-clip-text bg-linear-to-r from-foreground/80 to-foreground/40 sm:mt-4 text-xs sm:text-xl font-medium">
          Explore thousands of job listings or find the perfect Match. <br/>Our platform connects job seekers and employers seamlessly.
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        {isSignedIn ? (
          <Link to=        {isCandidate ? "/jobs" : "/post-job"}>
          <Button variant="default" className="text-lg px-6 py-3 h-auto gap-2">
            <Search size={20} />
            {isCandidate ? "Find Jobs" : "Post a Job"}
          </Button>
        </Link>
        ) : (
        
       <Link to={isCandidate ? "/jobs" : "/post-job"}>
          <Button variant="default" className="text-lg px-6 py-3 h-auto gap-2">
            <BriefcaseBusiness size={20} />
            Get Started
          </Button>
        </Link>
        )}
      </div>



    <div className="relative border-x border-y bg-linear-to-r from-secondary via-transparent to-secondary py-6">
			<InfiniteSlider gap={42} reverse speed={60} speedOnHover={20}>
				{companies.map((logo) => (
					<img
						alt={logo.name}
						className="pointer-events-none h-4 select-none md:h-5 dark:brightness-0 dark:invert"
						height="auto"
						key={`logo-${logo.name}-${logo.id}`}
						loading="lazy"
						src={logo.path}
						width="auto"
					/>
				))}
			</InfiniteSlider>

			<ProgressiveBlur
				blurIntensity={1}
				className="pointer-events-none absolute top-0 left-0 h-full w-25 md:w-40"
				direction="left"
			/>
			<ProgressiveBlur
				blurIntensity={1}
				className="pointer-events-none absolute top-0 right-0 h-full w-25 md:w-40"
				direction="right"
			/>
		</div>

    <section className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 md:flex-row">
          <CardFlip
            title="Find Jobs"
            subtitle="Browse curated opportunities"
            description="Search roles that match your skills, save favorites, and apply in minutes."
            features={["Smart job search", "Application tracking", "Saved listings"]}
            onAction={() => navigate("/jobs")}
            />
         
          <CardFlip
            title="Post a Job"
            subtitle="Reach qualified candidates faster"
            description="Create a listing, review applicants, and hire the right talent."
            features={["Fast job posting", "Applicant management", "Talent discovery"]}
            onAction={() => navigate("/post-job")}
          />
      </section>

      <div className='w-full py-16'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold'>Frequently asked questions</h2>
            <p className='text-muted-foreground'>Everything you need to know about our different services.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Accordion multiple className='flex flex-col gap-4'>
              {faqs.slice(0, Math.ceil(faqs.length / 2)).map(item => (
                <AccordionItem key={item.question} value={item.question} className='rounded-md !border'>
                  <AccordionTrigger className='cursor-pointer px-4 py-4'>{item.question}</AccordionTrigger>
                  <AccordionContent className='text-muted-foreground px-4'>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion multiple className='flex flex-col gap-4'>
              {faqs.slice(Math.ceil(faqs.length / 2)).map(item => (
                <AccordionItem key={item.question} value={item.question} className='rounded-md !border'>
                  <AccordionTrigger className='cursor-pointer px-4 py-4'>{item.question}</AccordionTrigger>
                  <AccordionContent className='text-muted-foreground px-4'>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="border-y border-line py-8 mt-16">
          <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
            <h2 className="mb-4 ml-4 font-heading text-3xl font-medium tracking-tight">
              Loved by people worldwide
            </h2>
            <p className="mb-8 p-4 text-base text-balance text-muted-foreground">
              See what developers are saying about us.
            </p>
          </div>

          <TestimonialList data={TESTIMONIALS_1} />
          <div className="flex h-4" />
          <TestimonialList data={TESTIMONIALS_2} direction="right" />
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default LandingPage;