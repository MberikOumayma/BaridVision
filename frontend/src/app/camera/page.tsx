"use client";
import { useEffect, useRef, useState } from "react";

interface PackageObject {
  id: string;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  length_px: number | null;
  width_px: number | null;
  status: "completed" | "estimating";
  timestamp: number;
}

interface BillingModalState {
  isOpen: boolean;
  packageId: string | null;
  actualWeight: string;
  volumetricWeight: number;
  finalWeight: number;
  totalAmount: number;
}

interface InvoiceState {
  isOpen: boolean;
  data: any;
}

// Constante pour le tarif par kg
const RATE_PER_KG = 5; // Changé de 20 à 5 dinars/kg

export default function CameraPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<PackageObject[]>([]);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef<number[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.9);
  const [activeTab, setActiveTab] = useState("camera");
  const [billingModal, setBillingModal] = useState<BillingModalState>({
    isOpen: false,
    packageId: null,
    actualWeight: "",
    volumetricWeight: 0,
    finalWeight: 0,
    totalAmount: 0,
  });
  const [invoice, setInvoice] = useState<InvoiceState>({
    isOpen: false,
    data: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let lastTime = performance.now();

    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8000/ws");

      wsRef.current.onmessage = (event) => {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;
        const currentFps = Math.round(1000 / delta);

        fpsRef.current.push(currentFps);
        if (fpsRef.current.length > 10) fpsRef.current.shift();

        setFps(
          Math.round(fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length)
        );

        if (typeof event.data !== "string") {
          // C'est une image - traitement vidéo
          const img = new Image();
          img.onload = () => {
            if (canvas && ctx) {
              const containerWidth = canvas.parentElement?.clientWidth || canvas.clientWidth;
              const containerHeight =
                canvas.parentElement?.clientHeight || canvas.clientHeight;

              const baseScale = Math.min(
                containerWidth / img.width,
                containerHeight / img.height
              );
              const adjustedScale = baseScale * zoomLevel;

              const newWidth = img.width * adjustedScale;
              const newHeight = img.height * adjustedScale;

              const x = (containerWidth - newWidth) / 2;
              const y = (containerHeight - newHeight) / 2;

              canvas.width = containerWidth;
              canvas.height = containerHeight;

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, x, y, newWidth, newHeight);
            }
          };

          if (img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
          img.src = URL.createObjectURL(new Blob([event.data], { type: "image/jpeg" }));
        } else {
          // C'est du JSON - données des objets détectés
          try {
            const parsed = JSON.parse(event.data);
            console.log("Données reçues:", parsed);
            
            if (parsed.type === "dimensions" || parsed.detected_objects) {
              const objectsData: PackageObject[] = [];
              
              // Si c'est un tableau d'objets détectés
              if (parsed.detected_objects && Array.isArray(parsed.detected_objects)) {
                parsed.detected_objects.forEach((obj: any, index: number) => {
                  objectsData.push({
                    id: obj.id || `obj-${Date.now()}-${index}`,
                    length_cm: obj.length_cm || obj.length || null,
                    width_cm: obj.width_cm || obj.width || null,
                    height_cm: obj.height_cm || obj.height || null,
                    length_px: obj.length_px || null,
                    width_px: obj.width_px || null,
                    status: (obj.length_cm && obj.width_cm && obj.height_cm) ? "completed" : "estimating",
                    timestamp: Date.now()
                  });
                });
              } 
              // Si c'est un seul objet
              else if (parsed.id) {
                objectsData.push({
                  id: parsed.id,
                  length_cm: parsed.length_cm || parsed.length || null,
                  width_cm: parsed.width_cm || parsed.width || null,
                  height_cm: parsed.height_cm || parsed.height || null,
                  length_px: parsed.length_px || null,
                  width_px: parsed.width_px || null,
                  status: (parsed.length_cm && parsed.width_cm && parsed.height_cm) ? "completed" : "estimating",
                  timestamp: Date.now()
                });
              }
              
              if (objectsData.length > 0) {
                setObjects(prev => {
                  // Fusionner les nouveaux objets avec les existants
                  const updatedObjects = [...prev];
                  
                  objectsData.forEach((newObj: PackageObject) => {
                    const existingIndex = updatedObjects.findIndex(o => o.id === newObj.id);
                    
                    if (existingIndex >= 0) {
                      // Mettre à jour l'objet existant
                      updatedObjects[existingIndex] = {
                        ...updatedObjects[existingIndex],
                        ...newObj,
                        timestamp: Date.now()
                      };
                    } else {
                      // Ajouter le nouvel objet
                      updatedObjects.push(newObj);
                    }
                  });
                  
                  // Trier par timestamp (plus récent en premier)
                  return updatedObjects.sort((a, b) => b.timestamp - a.timestamp);
                });
              }
            }
          } catch (error) {
            console.warn("Message non JSON ignoré", error);
            console.log("Données brutes:", event.data);
          }
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket closed, reconnecting...");
        setTimeout(connectWebSocket, 1000);
      };

      wsRef.current.onopen = () => {
        console.log("WebSocket connected successfully");
      };
    };

    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [zoomLevel]);

  // Nettoyer les objets anciens (plus de 30 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setObjects(prev => prev.filter(obj => now - obj.timestamp < 30000));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDimension = (value: any, unit: string = "cm") => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "number") return `${value.toFixed(1)} ${unit}`;
    return value;
  };

  const openBillingModal = (packageObj: PackageObject) => {
    if (!packageObj.length_cm || !packageObj.width_cm || !packageObj.height_cm) {
      alert("Les dimensions du colis ne sont pas encore disponibles");
      return;
    }

    const volumetricWeight = (packageObj.length_cm * packageObj.width_cm * packageObj.height_cm) / 5000;
    
    setBillingModal({
      isOpen: true,
      packageId: packageObj.id,
      actualWeight: "",
      volumetricWeight: volumetricWeight,
      finalWeight: 0,
      totalAmount: 0,
    });
  };

  const closeBillingModal = () => {
    setBillingModal({
      isOpen: false,
      packageId: null,
      actualWeight: "",
      volumetricWeight: 0,
      finalWeight: 0,
      totalAmount: 0,
    });
  };

  const calculateBill = () => {
    const actualWeight = parseFloat(billingModal.actualWeight) || 0;
    const finalWeight = Math.max(actualWeight, billingModal.volumetricWeight);
    const totalAmount = finalWeight * RATE_PER_KG; // Utilisation de la constante

    setBillingModal(prev => ({
      ...prev,
      finalWeight: finalWeight,
      totalAmount: totalAmount,
    }));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBillingModal(prev => ({
      ...prev,
      actualWeight: value,
    }));
  };

  const generateInvoice = () => {
    const packageObj = objects.find(obj => obj.id === billingModal.packageId);
    if (!packageObj) return;

    const invoiceData = {
      id: `INV-${Date.now()}`,
      packageId: billingModal.packageId,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      dimensions: {
        length: packageObj.length_cm,
        width: packageObj.width_cm,
        height: packageObj.height_cm,
      },
      weights: {
        actual: parseFloat(billingModal.actualWeight) || 0,
        volumetric: billingModal.volumetricWeight,
        final: billingModal.finalWeight,
      },
      amount: billingModal.totalAmount,
      rate: RATE_PER_KG, // Utilisation de la constante
    };

    setInvoice({
      isOpen: true,
      data: invoiceData,
    });
  };

  const printInvoice = () => {
    window.print();
  };

  const closeInvoice = () => {
    setInvoice({ isOpen: false, data: null });
    closeBillingModal();
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 flex flex-col">
      {/* Barre d'onglets centrée */}
      <div className="flex justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 shadow-lg">
        <div className="flex bg-blue-700 rounded-lg overflow-hidden shadow">
          <button
            className={`px-8 py-3 font-semibold transition-all duration-200 ${
              activeTab === "camera" 
                ? "bg-white text-blue-700 shadow-inner" 
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => setActiveTab("camera")}
          >
            📷 Caméra
          </button>
          <button
            className={`px-8 py-3 font-semibold transition-all duration-200 ${
              activeTab === "packages" 
                ? "bg-white text-blue-700 shadow-inner" 
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => setActiveTab("packages")}
          >
            📦 Colis détectés ({objects.length})
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="flex-1 relative">
        {activeTab === "camera" ? (
          <>
            <div className="absolute inset-0 flex justify-center items-center overflow-hidden bg-gray-900">
              <canvas ref={canvasRef} className="max-w-full max-h-full shadow-2xl" />
              
              {/* Overlay pour afficher le nombre d'objets détectés en temps réel */}
              {objects.length > 0 && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                  <span className="font-bold">{objects.length} colis détecté(s)</span>
                </div>
              )}
            </div>

            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
              <span className="font-mono font-bold">FPS: {fps}</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg shadow-lg backdrop-blur-sm flex gap-3">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-lg transition duration-200"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-lg transition duration-200"
              >
                -
              </button>
            </div>
          </>
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">📦 Colis Détectés</h2>
                <p className="text-gray-600">
                  {objects.length > 0 
                    ? `${objects.length} colis détecté(s) en temps réel` 
                    : "En attente de détection..."}
                </p>
              </div>
              
              {objects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <div className="text-gray-500 text-lg italic">
                    Aucun colis détecté. Placez un colis devant la caméra.
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    Les colis détectés apparaîtront automatiquement ici
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {objects.map((obj) => (
                    <div
                      key={obj.id}
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                        obj.status === "completed" 
                          ? "border-l-4 border-l-green-500" 
                          : "border-l-4 border-l-blue-500"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              obj.status === "completed" ? "bg-green-100" : "bg-blue-100"
                            }`}>
                              <span className="text-xl">
                                {obj.status === "completed" ? "✅" : "⏳"}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">Colis #{obj.id}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                obj.status === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {obj.status === "completed" ? "✓ Dimensions complètes" : "⏳ Estimation en cours..."}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                              <span className="mr-2">📏</span>
                              Dimensions du colis
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Longueur:</span>
                                <span className="font-medium text-blue-600">
                                  {formatDimension(obj.length_cm)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Largeur:</span>
                                <span className="font-medium text-green-600">
                                  {formatDimension(obj.width_cm)}
                                </span>
                              </div>
                              <div className="flex justify-between col-span-2">
                                <span className="text-gray-600">Hauteur:</span>
                                <span className="font-medium text-red-600">
                                  {formatDimension(obj.height_cm)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {obj.status === "completed" && (
                            <button
                              onClick={() => openBillingModal(obj)}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                            >
                              💰 Facturer ce colis
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de facturation */}
      {billingModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3">💰</span>
                Facturation - Colis #{billingModal.packageId}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-1">Poids Volumétrique</div>
                  <div className="text-2xl font-bold text-blue-600">{billingModal.volumetricWeight.toFixed(2)} kg</div>
                  <div className="text-xs text-blue-600 mt-1">(L × l × H ÷ 5000)</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">Tarif</div>
                  <div className="text-2xl font-bold text-green-600">{RATE_PER_KG} D/kg</div>
                  <div className="text-xs text-green-600 mt-1">Poids retenu</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="mr-2">⚖️</span>
                  Poids Réel (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={billingModal.actualWeight}
                  onChange={handleWeightChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition duration-200"
                  placeholder="Saisissez le poids réel..."
                />
              </div>

              <button
                onClick={calculateBill}
                disabled={!billingModal.actualWeight}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                🧮 Calculer la Facture
              </button>

              {billingModal.finalWeight > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-green-800">RÉSULTATS DU CALCUL</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Poids retenu:</span>
                      <span className="font-bold text-lg text-green-600">{billingModal.finalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-gray-800">Total à payer:</span>
                      <span className="font-bold text-2xl text-green-600">{billingModal.totalAmount.toFixed(2)} D</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={closeBillingModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-xl transition duration-200"
              >
                Annuler
              </button>
              {billingModal.totalAmount > 0 && (
                <button
                  onClick={generateInvoice}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  🧾 Générer Facture
                </button>
              )}
            </div>
          </div>
        </div>
      )}

        {/* Facture de caisse */}
    {invoice.isOpen && invoice.data && (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 print:bg-white print:inset-0 print:p-0">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md print:shadow-none print:rounded-none print:max-w-none mx-auto my-auto">
          {/* En-tête de la facture */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-2xl print:rounded-none text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold mb-1">FACTURE DE CAISSE</h1>
                <p className="text-blue-100 text-xs">Système de Gestion de Colis</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">#{invoice.data.id}</div>
                <div className="text-blue-100 text-xs">{invoice.data.date} à {invoice.data.time}</div>
              </div>
            </div>
          </div>

          {/* Corps de la facture */}
          <div className="p-4 space-y-4">
            {/* Informations du colis */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-1 text-sm">📦 Informations Colis</h3>
                <p className="text-xs"><strong>ID:</strong> #{invoice.data.packageId}</p>
                <p className="text-xs"><strong>Dimensions:</strong> {invoice.data.dimensions.length} × {invoice.data.dimensions.width} × {invoice.data.dimensions.height} cm</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-1 text-sm">⚖️ Détails Poids</h3>
                <p className="text-xs"><strong>Réel:</strong> {invoice.data.weights.actual} kg</p>
                <p className="text-xs"><strong>Volumétrique:</strong> {invoice.data.weights.volumetric.toFixed(2)} kg</p>
                <p className="text-xs"><strong>Retenu:</strong> {invoice.data.weights.final.toFixed(2)} kg</p>
              </div>
            </div>

            {/* Détails de calcul */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="font-bold text-gray-800 mb-2 text-sm text-center">🧮 CALCUL DÉTAILLÉ</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Poids retenu:</span>
                  <span>{invoice.data.weights.final.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif par kg:</span>
                  <span>{invoice.data.rate} D</span>
                </div>
                <div className="border-t border-gray-300 pt-1 flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span>{invoice.data.amount.toFixed(2)} D</span>
                </div>
              </div>
            </div>

            {/* Total en gros */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
              <div className="text-lg font-bold">MONTANT TOTAL À PAYER</div>
              <div className="text-2xl font-bold mt-1">{invoice.data.amount.toFixed(2)} DINARS</div>
            </div>

            {/* Pied de page */}
            <div className="text-center text-gray-600 text-xs border-t border-gray-200 pt-2">
              <p>Merci pour votre confiance !</p>
              <p>Facture générée automatiquement par le système</p>
              <p className="font-bold mt-1">Tarif: {RATE_PER_KG} dinars/kg</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex gap-2 print:hidden">
            <button
              onClick={closeInvoice}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-3 rounded-lg transition duration-200 text-sm"
            >
              Fermer
            </button>
            <button
              onClick={printInvoice}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
            >
              🖨️ Imprimer
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}