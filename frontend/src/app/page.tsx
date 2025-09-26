"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiCheck, FiBarChart2, FiShield, FiBox, FiPackage, FiCpu, FiEye } from 'react-icons/fi';

type SocialMedia = 'twitter' | 'linkedin' | 'facebook';
type NavItem = 'Accueil' | 'Fonctionnalités' | 'Tarifs' | 'À propos' | 'Contact';
type FooterCategory = 'Produit' | 'Ressources' | 'Entreprise';

interface ValueCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

interface StatItem {
  value: string;
  label: string;
  desc: string;
}

export default function UltraPremiumHome() {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [currentSection, setCurrentSection] = useState(0);

  // Auto-rotate sections
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Trigger animations when in view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Data
  const navItems: NavItem[] = ['Accueil', 'Fonctionnalités', 'Tarifs', 'À propos', 'Contact'];
  const valueCards: ValueCard[] = [
    {
      title: "Efficacité Maximale",
      desc: "Réduction de 70% du temps de traitement des colis grâce à notre technologie de vision 3D",
      icon: <FiEye className="text-4xl" />,
      color: "from-[#001F5B] to-[#003F8E]"
    },
    {
      title: "Sécurité Totale",
      desc: "Détection automatique des objets dangereux avec une précision de 99.9%",
      icon: <FiShield className="text-4xl" />,
      color: "from-[#003F8E] to-[#0066CC]"
    },
    {
      title: "Automatisation Intelligente",
      desc: "Réduction des erreurs humaines avec notre système de diagnostic automatisé",
      icon: <FiCpu className="text-4xl" />,
      color: "from-[#001F5B] to-[#FFC800]"
    }
  ];

  const stats: StatItem[] = [
    { value: "99.9%", label: "Précision de détection", desc: "Taux de réussite sur les tests" },
    { value: "3.5s", label: "Temps d'analyse", desc: "Par colis en moyenne" },
    { value: "120+", label: "Clients satisfaits", desc: "Dans 15 pays" },
    { value: "24/7", label: "Support technique", desc: "Assistance permanente" }
  ];

  const footerCategories: FooterCategory[] = ['Produit', 'Ressources', 'Entreprise'];
  const footerItems = [
    ['Fonctionnalités', 'Tarifs', 'Intégrations', 'Mises à jour'],
    ['Documentation', 'Blog', 'Guides', 'API'],
    ['À propos', 'Carrières', 'Partenaires']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F5B]/5 to-[#003F8E]/5 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-[#001F5B]/10 fixed w-full z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <Image 
                src="/baridlogo.png" 
                alt="BaridVision" 
                width={48} 
                height={48} 
                className="h-12 w-auto drop-shadow-md"
              />
            </motion.div>
            <span className="text-2xl font-bold text-[#001F5B] bg-clip-text bg-gradient-to-r from-[#001F5B] to-[#003F8E]">
              BaridVision
            </span>
          </motion.div>

          <div className="hidden lg:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link 
                  href={item === 'Fonctionnalités' ? '/fonctionnalites' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="relative text-[#001F5B] hover:text-[#003F8E] font-medium transition group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Link 
              href="/login" 
              className="hidden md:block text-[#001F5B] hover:text-[#003F8E] font-medium transition"
            >
              Se connecter
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/register" 
                className="relative bg-[#FFC800] hover:bg-[#e6b400] text-[#001F5B] font-bold py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-xl group overflow-hidden"
              >
                <span className="relative z-10">S'inscrire</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-28 px-6 relative bg-gradient-to-br from-[#001F5B] to-[#003F8E]">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`package-${i}`}
              className="absolute opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FiPackage className="text-4xl text-white" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center bg-[#FFC800]/20 text-white px-4 py-2 rounded-full mb-6 border border-[#FFC800]/30"
            >
              <FiBarChart2 className="mr-2" />
              <span className="font-semibold">Innovation Logistique 4.0</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <motion.span 
                className="text-[#FFC800]"
                animate={{ 
                  textShadow: ["0 0 0px #FFC800", "0 0 10px #FFC800", "0 0 0px #FFC800"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >
                BaridVision
              </motion.span><br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                L'intelligence au cœur du colis
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white/90 mb-10"
            >
              BaridVision révolutionne le tri postal avec une solution complète intégrant vision 3D, 
              détection d'objets dangereux et inspection automatisée des colis.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: ["0 5px 15px rgba(0,31,91,0.2)", "0 10px 25px rgba(0,31,91,0.3)", "0 5px 15px rgba(0,31,91,0.2)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Link 
                  href="/demo" 
                  className="flex items-center justify-center bg-[#FFC800] hover:bg-[#e6b400] text-[#001F5B] font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  Voir la démo <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/start" 
                  className="flex items-center justify-center bg-white hover:bg-gray-100 text-[#001F5B] font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  Commencer gratuitement
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center space-x-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <motion.div 
                    key={`avatar-${item}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 1.2 + item * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="w-10 h-10 rounded-full bg-white border-2 border-[#FFC800]"
                  ></motion.div>
                ))}
              </div>
              <div className="text-sm text-white/80">
                Rejoint par <span className="font-semibold">120+ entreprises</span> cette semaine
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="hidden lg:block absolute right-10 top-1/3 w-48 h-48"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#FFC800]/10 rounded-2xl backdrop-blur-sm border border-[#FFC800]/30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <FiCpu className="text-6xl text-[#FFC800] mb-4" />
              <span className="text-white font-medium">AI Powered</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#001F5B]/5 -z-10"></div>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-[#FFC800]/10 text-[#001F5B] px-6 py-2 rounded-full mb-6 border border-[#FFC800]/30"
            >
              <span className="font-semibold">Notre valeur ajoutée</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6 text-[#001F5B]"
            >
              Transformez votre <span className="text-[#003F8E]">chaîne logistique</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-[#001F5B]/90 max-w-3xl mx-auto"
            >
              Une solution complète pour optimiser chaque étape de votre flux de colis
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {valueCards.map((item, index) => (
              <motion.div
                key={`value-card-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-8">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 text-white`}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#001F5B] mb-4">{item.title}</h3>
                  <p className="text-[#001F5B]/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Showcase Section */}
      <section className="py-28 bg-[#001F5B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#FFC800] blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-[#003F8E] blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-[#FFC800]/20 text-white px-6 py-2 rounded-full mb-6"
            >
              <span className="font-semibold">Technologie Avancée</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Découvrez <span className="text-[#FFC800]">BaridVision</span> en action
            </motion.h2>
          </div>

          <div className="relative h-96 rounded-3xl overflow-hidden border-4 border-white/20">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {currentSection === 0 && (
                  <div className="text-center p-8 max-w-2xl">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 8,
                        repeat: Infinity
                      }}
                    >
                      <FiBox className="text-8xl mx-auto text-[#FFC800] mb-8" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-4">Vision 3D Intelligente</h3>
                    <p className="text-xl opacity-90">Reconstruction précise des colis avec calcul automatique des dimensions en temps réel</p>
                  </div>
                )}
                {currentSection === 1 && (
                  <div className="text-center p-8 max-w-2xl">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity
                      }}
                    >
                      <FiShield className="text-8xl mx-auto text-[#FFC800] mb-8" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-4">Sécurité Renforcée</h3>
                    <p className="text-xl opacity-90">Détection avancée des matières dangereuses et objets interdits</p>
                  </div>
                )}
                {currentSection === 2 && (
                  <div className="text-center p-8 max-w-2xl">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <FiCheck className="text-8xl mx-auto text-[#FFC800] mb-8" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-4">Inspection Automatisée</h3>
                    <p className="text-xl opacity-90">Diagnostic complet de l'état physique des colis sans intervention humaine</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
              {[0, 1, 2].map((index) => (
                <motion.button 
                  key={`section-indicator-${index}`}
                  onClick={() => setCurrentSection(index)}
                  className={`w-3 h-3 rounded-full transition-all ${currentSection === index ? 'bg-[#FFC800]' : 'bg-white/50'}`}
                  whileHover={{ scale: 1.5 }}
                  aria-label={`Go to section ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#001F5B]/5 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={`stat-${stat.label}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0, 31, 91, 0.1)"
                }}
                className="bg-white p-8 rounded-xl transition-all text-center"
              >
                <motion.div 
                  className="text-5xl font-bold text-[#003F8E] mb-3"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <h3 className="text-xl font-semibold text-[#001F5B] mb-2">{stat.label}</h3>
                <p className="text-[#001F5B]/80">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 bg-gradient-to-br from-[#001F5B] to-[#003F8E] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 100],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0.1, 0.5, 0.1]
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              className="text-4xl font-bold mb-6"
              whileInView={{ 
                scale: [1, 1.05, 1],
                transition: { duration: 1 }
              }}
              viewport={{ once: true }}
            >
              Prêt à révolutionner votre logistique ?
            </motion.h2>
            <motion.p
              className="text-xl mb-10"
              whileInView={{ 
                opacity: [0.8, 1, 0.8],
                transition: { duration: 2, repeat: Infinity }
              }}
              viewport={{ once: true }}
            >
              Découvrez comment BaridVision peut optimiser vos opérations postales dès aujourd'hui
            </motion.p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                whileInView={{ 
                  scale: [1, 1.02, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
                viewport={{ once: true }}
              >
                <Link 
                  href="/demo" 
                  className="inline-flex items-center justify-center bg-white text-[#001F5B] font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  Demander une démo <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full transition-all hover:bg-white hover:text-[#001F5B]"
                >
                  Parler à un expert
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001F5B] text-white pt-20 pb-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFC800] via-[#003F8E] to-[#FFC800]"></div>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div>
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                >
                  <Image 
                    src="/baridlogo.png" 
                    alt="BaridVision Logo" 
                    width={40} 
                    height={40}
                    className="w-10 h-10"
                  />
                </motion.div>
                <span className="text-2xl font-bold">BaridVision</span>
              </motion.div>
              <p className="text-[#FFFFFF]/80 mb-6">
                La solution IA ultime pour les centres de tri postal
              </p>
              <div className="flex space-x-4">
                {(['twitter', 'linkedin', 'facebook'] as SocialMedia[]).map((social) => (
                  <motion.a 
                    key={`social-${social}`}
                    href="#" 
                    className="w-10 h-10 rounded-full bg-[#003F8E] flex items-center justify-center hover:bg-[#FFC800] hover:text-[#001F5B] transition"
                    whileHover={{ y: -3 }}
                    aria-label={`Follow us on ${social}`}
                  >
                    <span className="sr-only">{social}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {footerCategories.map((category, catIndex) => (
              <div key={`footer-category-${category}`}>
                <motion.h3 
                  className="text-lg font-bold mb-6"
                  whileHover={{ x: 5 }}
                >
                  {category}
                </motion.h3>
                <ul className="space-y-3">
                  {footerItems[catIndex].map((item) => (
                    <motion.li 
                      key={`footer-item-${item}`}
                      whileHover={{ x: 5 }}
                    >
                      <Link href="#" className="text-[#FFFFFF]/80 hover:text-[#FFC800] transition flex items-start">
                        <span className="mr-2 text-[#FFC800]">•</span>
                        <span>{item}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[#003F8E] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#FFFFFF]/80 mb-4 md:mb-0">
              © 2025 BaridVision. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              {['Confidentialité', 'Conditions', 'Cookies'].map((item) => (
                <motion.div
                  key={`footer-link-${item}`}
                  whileHover={{ y: -2 }}
                >
                  <Link href="#" className="text-[#FFFFFF]/80 hover:text-[#FFC800] transition">{item}</Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}