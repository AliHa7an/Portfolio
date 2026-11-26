import Hero from "./components/Hero";
import StorySection from "./components/StorySection";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}
