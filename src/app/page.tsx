"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  FileText,
  Sparkles,
  Brain,
  Zap,
  Clock,
} from "lucide-react";
import { motion as m } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Instrument_Serif } from "next/font/google";

const instrumentserif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

// Features section data
const features = [
  {
    icon: Brain,
    title: "AI-Powered Research",
    description:
      "Leverage advanced AI to generate comprehensive research documents",
    content:
      "Our platform uses cutting-edge AI to analyze topics and generate well-structured research papers with proper citations and formatting.",
  },
  {
    icon: Sparkles,
    title: "Customizable Outlines",
    description:
      "Create and edit document outlines to match your specific needs",
    content:
      "Easily customize generated outlines by adding, removing, or rearranging sections and subtopics to perfectly fit your research requirements.",
  },
  {
    icon: FileText,
    title: "Export Options",
    description: "Download your research in multiple formats",
    content:
      "Export your completed research documents in various formats including PDF and DOCX, ready for submission or further editing.",
  },
];

// How It Works section data
const steps = [
  {
    number: 1,
    title: "Enter Your Topic",
    description:
      "Provide your research topic and any specific requirements or focus areas",
  },
  {
    number: 2,
    title: "Customize Outline",
    description:
      "Review and customize the AI-generated outline to match your specific needs",
  },
  {
    number: 3,
    title: "Generate & Export",
    description:
      "Generate content for each section and export your completed research document",
  },
];

// Benefits section data
const benefits = [
  {
    icon: Zap,
    title: "Save Time",
    description:
      "Generate comprehensive research documents in minutes instead of days or weeks",
  },
  {
    icon: Clock,
    title: "Always Available",
    description:
      "Access our platform 24/7 to generate research content whenever inspiration strikes",
  },
  {
    icon: FileText,
    title: "Professional Quality",
    description:
      "Generate well-structured, properly formatted documents ready for submission",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Leverage advanced AI to discover connections and insights you might have missed",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col w-full dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="relative w-full py-24 min-h-dvh flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 lg:w-2/3 h-72 bg-primary/20 rounded-full blur-[300px]" />
        <div className="container px-4 md:px-6 flex flex-col items-center text-center gap-6 pt-8 md:pt-12">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1
              className={cn(
                instrumentserif.className,
                "text-4xl md:text-6xl font-bold text-glow text-focus"
              )}
            >
              AI Document
              <span className="px-2 md:px-4 relative">
                <img
                  src={"/assets/line.svg"}
                  alt="."
                  className="absolute -bottom-1 left-3 z-10 w-11/12 -rotate-5"
                />
                <p className="inline relative z-20">Research</p>
              </span>
              <Sparkles
                className="size-12 animate-pulse md:inline hidden"
                strokeWidth={1.1}
                fillOpacity={1}
                fill="#E1B10D"
                stroke="#E1B10D"
              />
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-4xl mt-2">
              Generate comprehensive research documents instantly with the power
              of AI
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <Link href="/gen">
              <Button
                size="lg"
                className="rounded-full px-8 gap-2 text-lg group glow"
              >
                Start Generating
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="relative hidden sm:block w-full max-w-5xl mt-12 rounded-xl overflow-hidden shadow-2xl border border-border/50 bigshadow"
          >
            <div className="aspect-[16/9] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-full max-w-4xl h-full p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1"></div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-8 w-3/4 bg-primary/10 rounded-md"></div>
                  <div className="flex gap-4 flex-1">
                    <div className="w-2/3 bg-primary/5 rounded-md p-4 flex flex-col gap-2">
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={`mocktext-${i}`}
                            className={`h-4 ${
                              i === 0
                                ? "h-6 w-3/4"
                                : i === 4
                                ? "w-full"
                                : i === 5
                                ? "w-4/5"
                                : i === 3
                                ? "w-5/6"
                                : "w-full"
                            } bg-primary/10 rounded-md`}
                          ></div>
                        ))}
                    </div>
                    <Image
                      src="/assets/Research.svg"
                      alt=""
                      width={400}
                      className="h-auto lg:w-96 md:w-80 w-52 "
                      height={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </m.div>
          <Image
            src="/assets/Research.svg"
            alt=""
            width={400}
            className="h-auto w-56 sm:hidden mt-10"
            height={100}
          />
        </div>
        <img
          src="/assets/dots.svg"
          alt="."
          className="absolute top-40 -left-20 opacity-60 hidden md:block"
        />
        <img
          src="/assets/dots.svg"
          alt="."
          className="absolute bottom-80 -right-20 opacity-60 hidden md:block"
        />
      </section>

      {/* Features Section */}
      <section className="w-full py-32 bg-muted/30">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className={cn(
                instrumentserif.className,
                "text-3xl md:text-6xl font-bold mb-4"
              )}
            >
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered platform streamlines your research process with
              these amazing features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={`feature-${index}`}
                className="bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-yellow-400/50 -z-10 group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-500 blur-3xl"></div>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-32">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2
              className={cn(
                instrumentserif.className,
                "text-3xl md:text-6xl font-bold mb-4 inline relative"
              )}
            >
              <Image
                src={"/assets/circle.svg"}
                alt="."
                width={200}
                height={200}
                className="absolute -top-5 w-full rotate-2 left-0 z-10 scale-[1.3] opacity-70 drop-shadow-amber-300/20 drop-shadow-lg"
              />
              <span className="relative z-20">How It Works?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-8">
              Generate comprehensive research documents in just a few simple
              steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => (
              <div
                key={`step-${index}`}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
                  <span className="text-2xl font-bold text-primary">
                    {step.number}
                  </span>
                  <div className="absolute w-full h-full rounded-full border-2 border-dashed border-primary/30"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-32 bg-muted/30">
        <div className="container  max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2
              className={cn(
                instrumentserif.className,
                "text-3xl md:text-6xl font-bold mb-4"
              )}
            >
              Why Choose ResearchX
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform offers numerous advantages for researchers, students,
              and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={`benefit-${index}`}
                className="flex gap-4 py-10 px-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 insetshadow max-w-md"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute -bottom-60 left-1/2 -translate-x-1/2 lg:w-2/3 h-72 bg-primary/20 rounded-full blur-[300px]" />
        <div className="container max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h2
            className={cn(
              instrumentserif.className,
              "text-3xl md:text-6xl font-bold mb-6 max-w-3xl"
            )}
          >
            Ready to Transform Your Research Process?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Join thousands of researchers, students, and professionals who are
            saving time and producing better research documents with our AI
            platform.
          </p>

          <Link href="/gen">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg gap-2 group glow"
            >
              Start Generating Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <p
          className={cn(
            instrumentserif.className,
            "absolute bottom-4 right-4 text-sm text-muted-foreground tracking-wider"
          )}
        >
          Made by{" "}
          <a
            href="http://aadi.is-a.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-primary duration-300 transition-all"
          >
            Aditya
          </a>
        </p>
      </section>
    </div>
  );
};

export default Page;
