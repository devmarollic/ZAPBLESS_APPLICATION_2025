
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-sm shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-zapPurple-600">Zap</span>
            <span className="text-zapBlue-600">Bless</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="font-medium text-gray-700 hover:text-zapBlue-600 transition"
          >
            Recursos
          </a>
          <a
            href="#how-it-works"
            className="font-medium text-gray-700 hover:text-zapBlue-600 transition"
          >
            Como Funciona
          </a>
          <a
            href="#pricing"
            className="font-medium text-gray-700 hover:text-zapBlue-600 transition"
          >
            Planos
          </a>
          <Link
            to="/sobre"
            className="font-medium text-gray-700 hover:text-zapBlue-600 transition"
          >
            Sobre
          </Link>
          <Link
            to="/contato"
            className="font-medium text-gray-700 hover:text-zapBlue-600 transition"
          >
            Contato
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="rounded-full">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full">
              Começar Grátis
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-2xl p-4">
          <nav className="flex flex-col space-y-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-700 hover:text-zapBlue-600 transition p-2"
            >
              Recursos
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-700 hover:text-zapBlue-600 transition p-2"
            >
              Como Funciona
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-700 hover:text-zapBlue-600 transition p-2"
            >
              Planos
            </a>
            <Link
              to="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-700 hover:text-zapBlue-600 transition p-2"
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium text-gray-700 hover:text-zapBlue-600 transition p-2"
            >
              Contato
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="rounded-full w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full w-full">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
