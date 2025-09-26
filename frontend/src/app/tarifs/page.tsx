"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCheck, FiBarChart2, FiPackage } from 'react-icons/fi';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  mostPopular: boolean;
  color: string;
};

export default function PricingPage() {
  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "Gratuit",
      description: "Pour les petites entreprises qui commencent",
      features: [
        "Scan 3D de base",
        "Jusqu'à 100 colis/mois",
        "Détection des matières dangereuses",
        "Support par email",
        "Rapports basiques"
      ],
      mostPopular: false,
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Professional",
      price: "€299",
      description: "Pour les entreprises en croissance",
      features: [
        "Scan 3D avancé",
        "Jusqu'à 1000 colis/mois",
        "Détection avancée des matières dangereuses",
        "Support prioritaire",
        "Analytics avancés",
        "Intégration API"
      ],
      mostPopular: true,
      color: "from-emerald-500 to-emerald-700"
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      description: "Solution personnalisée pour les grandes entreprises",
      features: [
        "Scan 3D haute précision",
        "Volume illimité",
        "Détection intelligente complète",
        "Support 24/7",
        "Analytics premium",
        "Intégration complète",
        "Formation dédiée"
      ],
      mostPopular: false,
      color: "from-purple-500 to-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F5B] to-[#003F8E] overflow-hidden relative">
      {/* Animation des petits colis en fond */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
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
            <Link 
              href="/" 
              className="relative text-[#001F5B] hover:text-[#003F8E] font-medium transition group"
            >
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/fonctionnalites" 
              className="relative text-[#001F5B] hover:text-[#003F8E] font-medium transition group"
            >
              Fonctionnalités
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/tarifs" 
              className="relative text-[#FFC800] font-bold transition group"
            >
              Tarifs
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFC800]"
                layoutId="navIndicator"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            </Link>
            <Link 
              href="/a-propos" 
              className="relative text-[#001F5B] hover:text-[#003F8E] font-medium transition group"
            >
              À propos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="relative text-[#001F5B] hover:text-[#003F8E] font-medium transition group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC800] transition-all duration-300 group-hover:w-full"></span>
            </Link>
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
                className="relative bg-[#FFC800] hover:bg-[#e6b400] text-[#001F5B] font-bold py-2 px-6 rounded-full transition-all shadow-lg hover:shadow-xl group overflow-hidden"
              >
                <span className="relative z-10">S'inscrire</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="pt-40 pb-28 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center bg-[#FFC800]/20 text-white px-4 py-2 rounded-full mb-6 border border-[#FFC800]/30"
            >
              <FiBarChart2 className="mr-2" />
              <span className="font-semibold">Nos offres tarifaires</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
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
                Tarifs
              </motion.span> adaptés à vos besoins
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/90 max-w-3xl mx-auto"
            >
              Choisissez le forfait qui correspond le mieux à votre volume d'activité et bénéficiez de notre technologie de pointe
            </motion.p>
          </motion.div>

          {/* Grille de tarifs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {tier.mostPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[70%] bg-[#FFC800] text-[#001F5B] px-4 py-1 rounded-full font-bold text-sm z-10 shadow-md">
                    Le plus populaire
                  </div>
                )}
                <div className={`bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border ${
                  tier.mostPopular ? 'border-[#FFC800]' : 'border-white/20'
                } h-full flex flex-col`}>
                  <div className={`h-2 bg-gradient-to-r ${tier.color}`}></div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-2">{tier.name}</h2>
                    <div className="flex items-end mb-6">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      {tier.price !== "Gratuit" && (
                        <span className="text-white/80 ml-2">/mois</span>
                      )}
                    </div>
                    <p className="text-white/80 mb-6">{tier.description}</p>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-start text-white/90"
                          whileHover={{ x: 5 }}
                        >
                          <FiCheck className="text-[#FFC800] mr-3 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-auto"
                    >
                      <Link
                        href="/contact"
                        className={`block text-center py-3 px-6 rounded-xl font-bold transition-all ${
                          tier.mostPopular
                            ? 'bg-[#FFC800] text-[#001F5B] hover:bg-[#e6b400] shadow-lg'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {tier.price === "Gratuit" ? "Commencer" : "Essayer gratuitement"}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Section Entreprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12"
          >
            <div className="md:flex items-center">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-4">Solution personnalisée pour les entreprises</h2>
                <p className="text-white/90 mb-6">
                  Nos solutions Enterprise sont conçues pour les organisations ayant des besoins spécifiques en matière de volume, d'intégration et de fonctionnalités avancées.
                </p>
                <ul className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Volume illimité de colis",
                    "Intégration sur mesure",
                    "Support dédié 24/7",
                    "Formation et onboarding",
                    "Développements spécifiques",
                    "Accès anticipé aux nouvelles fonctionnalités"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start text-white/90">
                      <FiCheck className="text-[#FFC800] mr-3 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/3 md:pl-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#FFC800] to-[#FFD700] text-[#001F5B] p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-4">Contactez notre équipe</h3>
                  <p className="mb-6">Discutez avec nos experts pour une solution sur mesure</p>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/contact-entreprise"
                      className="block text-center bg-[#001F5B] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#003F8E] transition"
                    >
                      Contact Enterprise
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Section FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "Puis-je changer de forfait à tout moment ?",
                  answer: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Les ajustements de tarif sont effectués au prorata."
                },
                {
                  question: "Y a-t-il des frais cachés ?",
                  answer: "Non, tous nos prix sont transparents. Les seuls frais supplémentaires seraient pour des services optionnels que vous pourriez choisir."
                },
                {
                  question: "Quelle est la politique d'annulation ?",
                  answer: "Vous pouvez annuler votre abonnement à tout moment sans frais. Aucun remboursement n'est effectué pour la période en cours."
                },
                {
                  question: "Proposez-vous des réductions pour les ONG ?",
                  answer: "Oui, nous offrons des tarifs spéciaux pour les organisations à but non lucratif. Contactez-nous pour plus d'informations."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{item.question}</h3>
                  <p className="text-white/80">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}