'use client'

import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16 w-full">
      <div className="w-full py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">AZ Food Delivery</h3>
            <p className="text-gray-300 mb-4">
              Votre plateforme de livraison de nourriture préférée. 
              Des plats délicieux livrés directement chez vous.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors" />
              <FaInstagram className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors" />
              <FaTwitter className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors" />
              <FaYoutube className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">Accueil</Link></li>
              <li><Link href="/restaurants" className="text-gray-300 hover:text-orange-500 transition-colors">Restaurants</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-orange-500 transition-colors">Aide</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2">
              <li><Link href="/pizza" className="text-gray-300 hover:text-orange-500 transition-colors">Pizza</Link></li>
              <li><Link href="/burger" className="text-gray-300 hover:text-orange-500 transition-colors">Burger</Link></li>
              <li><Link href="/sushi" className="text-gray-300 hover:text-orange-500 transition-colors">Sushi</Link></li>
              <li><Link href="/healthy" className="text-gray-300 hover:text-orange-500 transition-colors">Healthy</Link></li>
              <li><Link href="/desserts" className="text-gray-300 hover:text-orange-500 transition-colors">Desserts</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MdLocationOn className="text-orange-500" />
                <span className="text-gray-300">123 Rue de la Livraison, Tunis</span>
              </div>
              <div className="flex items-center space-x-3">
                <MdPhone className="text-orange-500" />
                <span className="text-gray-300">+216 12 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <MdEmail className="text-orange-500" />
                <span className="text-gray-300">contact@azfood.tn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AZ Food Delivery. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="/terms" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Conditions d&apos;utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
