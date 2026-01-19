import { MainLayout } from "@/layouts";
import { Hero, Featured, About, PlatformFeatures, Contact, Gallery } from "@/components/main";
  export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Featured />
      <About />
      <Gallery />
      <PlatformFeatures />
      <Contact />
    </MainLayout>
  )
}
