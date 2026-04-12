import Link from 'next/link';
import { Zap, Twitter, Linkedin, Instagram, Facebook, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tool', path: '/tool' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' },
  ];

  return (
    <footer className="bg-primary border-t border-neutral/10 py-12 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-neutral" />
              </div>
              <span className="text-xl font-bold tracking-tight text-secondary">OmniAdapts</span>
            </Link>
            <p className="text-sm text-secondary/60 max-w-xs">
              OmniAdapts transforms your content into platform-optimized posts for X, LinkedIn, Reddit, and more — so you can grow everywhere without rewriting.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-secondary/40 hover:text-secondary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-secondary/60 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-secondary/60">
                <Mail className="w-4 h-4" />
                <span>omniadapts@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary/40">
            &copy; {currentYear} OmniAdapts. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-secondary/40 hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-secondary/40 hover:text-secondary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
