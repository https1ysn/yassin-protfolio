"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import type { SiteContent } from "@/lib/content-fallback";
import { ContentProvider } from "@/components/ContentContext";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import EasterEgg from "@/components/EasterEgg";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

const Divider = () => <div className="section-divider" aria-hidden="true" />;

export default function PortfolioClient({ content }: { content: SiteContent }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { settings } = content;

  /* admin-configured brand colors override the design tokens */
  const colorVars = {
    "--color-indigo-accent": settings.primaryColor,
    "--color-violet-accent": settings.secondaryColor,
    "--color-cyan-accent": settings.accentColor,
  } as React.CSSProperties;

  return (
    <ContentProvider content={content}>
      <MotionConfig reducedMotion={settings.enableAnimations ? "user" : "always"}>
        <SmoothScroll>
          <div style={colorVars}>
            {settings.showLoader && <Preloader />}
            {settings.enableCustomCursor && <CustomCursor />}
            <ScrollProgress />
            <Navbar onOpenPalette={() => setPaletteOpen(true)} />
            <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
            <EasterEgg />
            <main>
              <Hero />
              <About />
              <Divider />
              <Experience />
              <Divider />
              <Skills />
              <Divider />
              <Education />
              <Divider />
              <Projects />
              <Divider />
              <Services />
              <Divider />
              <Contact />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </MotionConfig>
    </ContentProvider>
  );
}
