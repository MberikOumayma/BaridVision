"use client";
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F5B]/5 to-[#003F8E]/5 overflow-hidden relative">
      {/* Barre de navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-[#001F5B]/10 fixed w-full z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image 
              src="/baridlogo.png" 
              alt="BaridVision" 
              width={40} 
              height={40} 
              className="h-10 w-auto drop-shadow-md"
            />
            <span className="text-xl font-bold text-[#001F5B] bg-clip-text bg-gradient-to-r from-[#001F5B] to-[#003F8E]">
              BaridVision
            </span>
          </motion.div>

          <div className="hidden lg:flex space-x-8">
            <Link href="/" className="text-[#001F5B] hover:text-[#003F8E] font-medium transition">Accueil</Link>
            <Link href="/fonctionnalites" className="text-[#001F5B] hover:text-[#003F8E] font-medium transition">Fonctionnalités</Link>
            <Link href="/tarifs" className="text-[#001F5B] hover:text-[#003F8E] font-medium transition">Tarifs</Link>
            <Link href="/a-propos" className="text-[#001F5B] hover:text-[#003F8E] font-medium transition">À propos</Link>
            <Link href="/contact" className="text-[#FFC800] font-bold transition">Contact</Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Link href="/login" className="hidden md:block text-[#001F5B] hover:text-[#003F8E] font-medium transition">
              Se connecter
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/register" 
                className="relative bg-[#FFC800] hover:bg-[#e6b400] text-[#001F5B] font-bold py-2 px-6 rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                S'inscrire
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section avec petits colis en arrière-plan */}
      <section className="pt-40 pb-20 px-6 relative bg-gradient-to-br from-[#001F5B] to-[#003F8E] overflow-hidden">
        {/* Petits colis en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border-2 border-white/20 rounded-md"
              style={{
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 30 + 15}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                rotate: `${Math.random() * 360}deg`,
              }}
              animate={{
                y: [0, Math.random() * 20 - 10],
                x: [0, Math.random() * 10 - 5],
                transition: {
                  duration: Math.random() * 5 + 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center bg-[#FFC800]/20 text-white px-4 py-2 rounded-full mb-6"
          >
            <FiMessageSquare className="mr-2" />
            <span className="font-semibold">Contactez-nous</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Nous sommes là pour vous aider
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            Une question, un projet ou besoin d'informations ? Notre équipe est à votre écoute.
          </motion.p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
            >
              <h2 className="text-2xl font-bold text-[#001F5B] mb-8">Envoyez-nous un message</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#001F5B] mb-2">Nom complet</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-[#001F5B]/50" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-10 pr-4 py-3 border border-[#001F5B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#001F5B] mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-[#001F5B]/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 border border-[#001F5B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[#001F5B] mb-2">Sujet</label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 border border-[#001F5B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="sales">Demande commerciale</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#001F5B] mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-[#001F5B]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent"
                    placeholder="Décrivez votre demande..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#FFC800] hover:bg-[#e6b400] text-[#001F5B] font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Envoyer <FiSend className="ml-2" />
                </motion.button>
              </form>
            </motion.div>

            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-[#001F5B]/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#001F5B] mb-6">Nos coordonnées</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#FFC800]/20 p-3 rounded-full mr-4">
                      <FiMail className="text-[#FFC800] text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#001F5B]">Email</h4>
                      <a href="mailto:contact@baridvision.com" className="text-[#003F8E] hover:underline">
                        contact@baridvision.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#FFC800]/20 p-3 rounded-full mr-4">
                      <FiPhone className="text-[#FFC800] text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#001F5B]">Téléphone</h4>
                      <a href="tel:+21670123456" className="text-[#003F8E] hover:underline">
                        +216 70 123 456
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#FFC800]/20 p-3 rounded-full mr-4">
                      <FiMapPin className="text-[#FFC800] text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#001F5B]">Adresse</h4>
                      <p className="text-[#001F5B]/90">
                        Complexe Postal Charguia 2<br />
                        Charguia 2 (La Soukra)<br />
                        Gouvernorat de l'Ariana, Tunisie<br />
                        Code postal 2035
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#001F5B]/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#001F5B] mb-6">Heures d'ouverture</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#001F5B]">Lundi - Vendredi</span>
                    <span className="font-medium text-[#003F8E]">8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#001F5B]">Samedi</span>
                    <span className="font-medium text-[#003F8E]">9h00 - 13h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#001F5B]">Dimanche</span>
                    <span className="font-medium text-[#003F8E]">Fermé</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#001F5B] to-[#003F8E] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Support urgent</h3>
                <p className="mb-6">Pour les problèmes techniques urgents, contactez notre support 24/7.</p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href="tel:+21698765432" 
                    className="inline-flex items-center justify-center bg-[#FFC800] hover:bg-[#e6b400] text-[#001F5B] font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiPhone className="mr-2" /> Support 24/7
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Carte avec marqueur rouge centré et zoomé */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.755272028987!2d10.192515315295386!3d36.86238597993569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb7454c6ed51%3A0x683b7ab6a4a4a1a!2sComplexe%20Postal%20Charguia%202!5e0!3m2!1sfr!2stn!6e3!7m2!3d36.862386!4d10.194704!8m2!3d36.862386!4d10.194704&markers=color:red%7C36.862386,10.194704&zoom=17"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-2xl"
              title="Localisation BaridVision - Complexe Postal Charguia 2"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001F5B] text-white pt-16 pb-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Image 
                src="/baridlogo.png" 
                alt="BaridVision Logo" 
                width={40} 
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold">BaridVision</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/confidentialite" className="hover:text-[#FFC800] transition">Confidentialité</Link>
              <Link href="/conditions" className="hover:text-[#FFC800] transition">Conditions</Link>
              <Link href="/cookies" className="hover:text-[#FFC800] transition">Cookies</Link>
            </div>
          </div>
          <div className="border-t border-[#003F8E] mt-8 pt-8 text-center text-[#FFFFFF]/80">
            © {new Date().getFullYear()} BaridVision. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}