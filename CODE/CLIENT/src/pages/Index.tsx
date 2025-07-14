
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthenticationService } from "@/lib/authentication_service";

const Index = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            {AuthenticationService.isAuthenticated() && (
                <div className="py-8 text-center">
                    <Link to="/dashboard">
                        <Button size="lg" className="bg-zapPurple-600 hover:bg-zapPurple-700">
                            Acessar Dashboard
                        </Button>
                    </Link>
                </div>
            )}
            <CallToAction />
            <Footer />
        </div>
    );
};

export default Index;
