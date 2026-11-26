import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Services from "./components/Services";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { LazyStory } from "./components/Lazy";

export default function Home() {
  return (
    <>
      <Hero />
      <LazyStory />
      <About />
      <Skills />
      <Services />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}
