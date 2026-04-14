'use client'

import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16 w-full">
      <div className="w-full py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-base font-bold mb-3 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              AZ Delivery
            </h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Votre plateforme de livraison de nourriture préférée. Des plats délicieux livrés directement chez vous.
            </p>
            <div className="flex space-x-3">
              {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 hover:text-orange-500 transition-colors text-gray-500">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Liens rapides</h4>
            <ul className="space-y-2">
              {[
                { href: '/',         label: 'Accueil' },
                { href: '/search',   label: 'Restaurants' },
                { href: '/about',    label: 'À propos' },
                { href: '/contact',  label: 'Contact' },
                { href: '/help',     label: 'Aide' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Catégories</h4>
            <ul className="space-y-2">
              {['Pizza', 'Burger', 'Sushi', 'Healthy', 'Desserts'].map(cat => (
                <li key={cat}>
                  <Link href={`/search?category=${cat.toLowerCase()}`} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact</h4>
            <div className="space-y-3">
              {[
                { Icon: MdLocationOn, text: '123 Rue de la Livraison, Tunis' },
                { Icon: MdPhone,      text: '+216 12 345 678' },
                { Icon: MdEmail,      text: 'contact@azfood.tn' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon className="text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-500">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2025 AZ Delivery. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
