import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Tools } from '../components/Tools';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { Contact } from '../components/Contact';
import { SEOHead } from '../components/SEOHead';

export function HomePage() {
    return (
        <>
            <SEOHead />
            <Hero />
            <About />
            <Skills />
            <Tools />
            <Projects />
            <Experience />
            <Contact />
        </>
    );
}
