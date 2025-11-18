
import HowItWorks from "@/components/pageParts/homeParts/HowItWorks";
import Services from "@/components/pageParts/homeParts/Services";
import Slider from "@/components/pageParts/homeParts/Slider";
import Testimonials from "@/components/pageParts/homeParts/Testimonials";


export default function Home() {
  return (
    <div>
      <Slider/>
      <Services/>
      <HowItWorks/>
      <Testimonials/>
    </div>
  );
}

