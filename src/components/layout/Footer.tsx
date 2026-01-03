import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <span className="font-serif text-xl font-bold text-foreground">
                Naveen-mb
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Trusted matchmaking service helping hearts find their perfect match since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary" />
                123-456-7890
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary" />
                info@aishmarriage.com
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Wedding Lane,<br />Love City, LC 12345</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">Working Hours</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>Monday - Friday: 9AM - 7PM</li>
              <li>Saturday: 10AM - 5PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Aish Marriage Bureau. All rights reserved. Made with{" "}
            <Heart className="inline h-4 w-4 text-primary fill-primary" /> for love seekers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
