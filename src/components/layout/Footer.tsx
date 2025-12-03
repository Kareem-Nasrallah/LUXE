import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold text-gradient">LUXE</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Curated collections for the modern lifestyle. Discover premium products from around the world.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.wishlist')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>123 Fashion Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0" />
                <span>hello@luxe.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.email_placeholder')}
                className="flex-1"
              />
              <Button>{t('footer.subscribe')}</Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} LUXE. {t('footer.rights')}.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
