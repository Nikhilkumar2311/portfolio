import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Tools } from './components/Tools';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ParticleNetwork } from './components/ParticleNetwork';

function App() {
  return (
    <>
      <ParticleNetwork />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Tools />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
