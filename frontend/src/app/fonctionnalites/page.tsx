"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiPackage } from 'react-icons/fi';
import { RiShieldCheckLine, RiAiGenerate } from 'react-icons/ri';
import { TbCube3dSphere } from 'react-icons/tb';
import { usePathname } from 'next/navigation';

export default function FeaturesPage() {
  const [activePhase] = useState<number>(1);
  const pathname = usePathname();

  const phases = [
    {
      id: 1,
      title: "Calcul du poids volumétrique automatisé",
      icon: <TbCube3dSphere className="text-2xl" />,
      description: "Notre système intelligent détecte et suit chaque colis en temps réel grâce à l’algorithme ByteTrack. Il estime automatiquement les trois dimensions réelles (L, l, h), calcule le poids volumétrique (L×l×h / 5000), compare avec le poids réel et applique la facturation basée sur le poids maximum, garantissant une précision et une équité optimales.",
      features: [
        "Détection et suivi des colis en temps réel (ByteTrack)",
        "Estimation automatique des 3 dimensions réelles",
        "Calcul instantané du poids volumétrique (L×l×h / 5000)",
        "Comparaison avec le poids réel pour facturation au poids maximum",
        "Intégration transparente avec systèmes ERP et outils logistiques",
        "Tableau de bord avec historique, analytics et génération de rapports"
      ],
      image: "/phase1.jpg",
      color: "bg-blue-500",
      demoLink: "/camera"
    }
,
    {
      id: 2,
      title: "Détection intelligente de matières réglementées",
      icon: <RiShieldCheckLine className="text-2xl" />,
      description: "Notre IA avancée détecte plus de 200 catégories de matières dangereuses avec une fiabilité de 99.7%, protégeant votre chaîne logistique et garantissant la conformité réglementaire internationale.",
      features: [
        "Base de données de +10 000 substances",
        "Alertes en temps réel avec niveau de danger",
        "Journal d'audit automatisé",
        "Mises à jour réglementaires automatiques",
        "Mode apprentissage pour amélioration continue"
      ],
      image: "/phase2.jpg",
      color: "bg-emerald-500",
      demoLink: "#"
    },
    {
      id: 3,
      title: "Analyse complète de l'intégrité des colis",
      icon: <RiAiGenerate className="text-2xl" />,
      description: "Notre système d'inspection multidimensionnel évalue 15 critères d'intégrité pour classer automatiquement vos colis, réduisant les litiges clients de jusqu'à 85%.",
      features: [
        "Détection des dommages invisibles (rayures, chocs)",
        "Analyse de la fermeture et scellage",
        "Classification intelligente (A/B/C/D)",
        "Recommandations d'emballage personnalisées",
        "Intégration avec les systèmes de tri automatisé"
      ],
      image: "/phase3.jpg",
      color: "bg-purple-500",
      demoLink: "#"
    }
  ];

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/fonctionnalites", label: "Fonctionnalités" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <div className="min-h-screen bg-[#003F8E] relative overflow-hidden">
      {/* Animation des petits colis en fond */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`package-${i}`}
            className="absolute"
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

      {/* Barre de navigation */}
      <nav className="bg-[#E8EBF2] backdrop-blur-md border-b border-[#001F5B]/10 fixed w-full z-50 shadow-sm">
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
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Link 
                  href={link.href} 
                  className={`relative font-medium transition group ${
                    pathname === link.href 
                      ? 'text-[#FFC800] font-semibold' 
                      : 'text-[#001F5B] hover:text-[#003F8E]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    pathname === link.href 
                      ? 'w-full bg-[#FFC800]' 
                      : 'w-0 bg-[#FFC800] group-hover:w-full'
                  }`}></span>
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

      {/* Contenu principal */}
      <div className="flex-1 pt-24 relative z-10">
        <AnimatePresence>
          <motion.div
            key={activePhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-10"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                  Solutions <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FFC800]">Intelligentes</span>
                </h1>
                <p className="text-xl text-white/90 max-w-3xl">
                  Découvrez notre suite complète de technologies IA conçues pour transformer radicalement votre chaîne logistique
                </p>
              </motion.div>

              <div className="grid gap-8">
                {phases.map((phase) => (
                  <motion.div
                    key={phase.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 ${phase.color} border-opacity-100 relative z-20`}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/2 p-10 relative z-30">
                        <div className="flex items-center mb-8">
                          <div className={`${phase.color} text-white p-4 rounded-2xl shadow-md mr-6`}>
                            {phase.icon}
                          </div>
                          <motion.h2 
                            className="text-3xl font-bold text-[#001F5B]"
                            whileHover={{ x: 5 }}
                          >
                            {phase.title}
                          </motion.h2>
                        </div>
                        
                        <motion.p 
                          className="text-gray-600 mb-8 text-lg leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {phase.description}
                        </motion.p>
                        
                        <h3 className="text-xl font-semibold text-[#003F8E] mb-6 flex items-center">
                          <span className="w-4 h-0.5 bg-[#FFC800] mr-3"></span>
                          Fonctionnalités Clés
                        </h3>
                        <ul className="space-y-4">
                          {phase.features.map((feature, index) => (
                            <motion.li 
                              key={index}
                              initial={{ x: -20 }}
                              animate={{ x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start group"
                            >
                              <div className={`${phase.color} rounded-full p-1 mr-4 mt-1 flex-shrink-0 transform group-hover:rotate-12 transition-transform`}>
                                <FiCheckCircle className="text-white text-sm" />
                              </div>
                              <span className="text-gray-700 group-hover:text-[#001F5B] transition-colors">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <motion.div 
                          className="mt-10 relative z-40"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Link 
                            href={phase.demoLink}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#001F5B] to-[#003F8E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all relative z-50 cursor-pointer"
                          >
                            Essayez gratuitement
                            <FiArrowRight className="ml-3 animate-bounce-horizontal" />
                          </Link>
                        </motion.div>
                      </div>
                      
                      <div className="md:w-1/2 relative z-10">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-20"
                        ></motion.div>
                        <div className="relative h-full min-h-[400px] z-0">
                          <Image 
                            src={phase.image} 
                            alt={phase.title} 
                            fill
                            className="object-cover object-center"
                            priority
                          />
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-20 grid md:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {[
                  { value: "99.7%", label: "Précision de détection" },
                  { value: "85%", label: "Réduction des erreurs" },
                  { value: "30%", label: "Économies logistiques" },
                  { value: "24/7", label: "Disponibilité" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
                  >
                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#001F5B] to-[#FFC800] mb-3">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="mt-24 bg-gradient-to-r from-[#001F5B] to-[#003F8E] rounded-2xl p-12 text-white overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                  <motion.h2 
                    className="text-4xl font-bold mb-6"
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                  >
                    Prêt pour la révolution logistique ?
                  </motion.h2>
                  <motion.p 
                    className="text-xl mb-8 opacity-90"
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Rejoignez les leaders qui ont déjà transformé leurs opérations avec BaridVision Pro
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-center gap-6"
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href="/demo" 
                      className="bg-white text-[#001F5B] font-bold py-4 px-8 rounded-xl transition-all hover:bg-gray-100 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <span>Demander une démo personnalisée</span>
                      <FiArrowRight className="ml-3 animate-pulse" />
                    </Link>
                    <Link 
                      href="/contact" 
                      className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl transition-all hover:bg-white hover:text-[#001F5B] flex items-center justify-center"
                    >
                      <span>Parler à un expert</span>
                    </Link>
                  </motion.div>
                </div>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:100px_100px]"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}