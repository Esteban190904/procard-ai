"use client";
import { useRef, useState, ChangeEvent } from 'react';
import { toPng } from 'html-to-image';

// Diccionario de iconos oficiales de Valorant
const RANK_ICONS: Record<string, string> = {
  "IRON": "/ranks/Iron.png",
  "BRONZE": "/ranks/Bronze.png",
  "SILVER": "/ranks/Silver.png",
  "GOLD": "/ranks/Gold.png",
  "PLATINUM": "/ranks/Platinum.png",
  "DIAMOND": "/ranks/Diamond.png",
  "ASCENDANT": "/ranks/Ascendant.png",
  "IMMORTAL": "/ranks/Immortal.png",
  "RADIANT": "/ranks/Radiant.png",
};

export default function ValorantCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("PLAYER NAME");
  const [rank, setRank] = useState("DIAMOND");
  const [winRate, setWinRate] = useState("58.4%"); // Nuevo estado
  const [kdRatio, setKdRatio] = useState("1.24"); // Nuevo estado
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2 
      });
      const link = document.createElement('a');
      link.download = `valorant-card-${name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al descargar:', err);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/remove-bg', {
            method: 'POST',
            body: JSON.stringify({ image: base64 }),
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await res.json();
          setUserImage(data.result || base64);
        } catch (error) {
          console.error("Fallo la IA:", error);
          setUserImage(base64);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-10 bg-[#0f1923] min-h-screen text-[#ece8e1] gap-10">
      
      {/* SECCIÓN DE CONTROLES */}
      <div className="flex flex-col gap-4 bg-[#1f2326] p-6 rounded-lg border border-[#36393f] w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold border-b border-red-500 pb-2 mb-4 uppercase italic">Configuración</h2>
        
        <label className="text-xs uppercase font-bold text-gray-400">Foto del Agente</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
        <label 
          htmlFor="file-upload" 
          className={`flex items-center justify-center p-3 rounded cursor-pointer font-bold transition-all text-sm uppercase italic skew-x-[-10deg] ${isProcessing ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          <span className="skew-x-[10deg]">{isProcessing ? 'Procesando IA...' : 'Subir Foto'}</span>
        </label>

        <label className="text-xs uppercase font-bold text-gray-400 mt-2">Nombre</label>
        <input 
          type="text" 
          maxLength={15}
          onChange={(e) => setName(e.target.value.toUpperCase() || "PLAYER NAME")}
          className="bg-[#0f1923] p-2 rounded border border-gray-700 focus:border-red-500 outline-none uppercase font-bold"
          placeholder="ESTEBAN"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase font-bold text-gray-400">Win Rate</label>
            <input 
              type="text" 
              placeholder="58.4%"
              onChange={(e) => setWinRate(e.target.value)}
              className="w-full bg-[#0f1923] p-2 rounded border border-gray-700 focus:border-red-500 outline-none mt-1"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-400">K/D Ratio</label>
            <input 
              type="text" 
              placeholder="1.24"
              onChange={(e) => setKdRatio(e.target.value)}
              className="w-full bg-[#0f1923] p-2 rounded border border-gray-700 focus:border-red-500 outline-none mt-1"
            />
          </div>
        </div>

        <label className="text-xs uppercase font-bold text-gray-400 mt-2">Rango</label>
        <select 
          onChange={(e) => setRank(e.target.value)}
          value={rank}
          className="bg-[#0f1923] p-2 rounded border border-gray-700 focus:border-red-500 outline-none"
        >
          {Object.keys(RANK_ICONS).map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <button 
          onClick={downloadCard}
          disabled={isProcessing}
          className={`mt-6 w-full py-4 font-black italic uppercase tracking-widest transition-all skew-x-[-10deg] border-2 
            ${isProcessing ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-transparent border-red-600 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'}`}
        >
          <span className="inline-block skew-x-[10deg]">Descargar Carta</span>
        </button>
      </div>
      
            



      {/* LA CARTA (DISEÑO FINAL) */}
      <div 
        ref={cardRef}
        className="relative w-[380px] h-[550px] bg-[#0f1923] overflow-hidden shadow-2xl border-t-4 border-red-500"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl font-black italic select-none">VAL</div>
        
        {/* Contenedor de Imagen con Efecto de Escaneo */}
        <div className="relative w-full h-[65%] z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-transparent to-[#0f1923]/30 z-20"></div>
          
          {userImage && !isProcessing && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_red] z-30 animate-scan"></div>
          )}

          {isProcessing ? (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center animate-pulse text-red-500 font-black italic">
              QUITANDO FONDO...
            </div>
          ) : userImage ? (
            <img src={userImage} alt="Agente" className="w-full h-full object-cover scale-105" />
          ) : (
            <div className="w-full h-full bg-[#1b2733] flex items-center justify-center text-gray-500 italic text-sm">
              Sube tu foto para empezar
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
             <div className="bg-red-600 px-3 py-1 skew-x-[-12deg] flex items-center gap-2 shadow-lg border border-red-400">
                <img 
                  src={RANK_ICONS[rank] || RANK_ICONS["IRON"]} 
                  alt="Rank" 
                  className="w-7 h-7 skew-x-[12deg] drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
                />
                <span className="inline-block skew-x-[12deg] font-black italic text-sm tracking-tighter uppercase">
                  {rank}
                </span>
             </div>
          </div>
        </div>

        {/* Info Inferior con Tipografía Pro */}
        <div className="p-6 relative z-20">
          <h2 
            className="text-5xl font-bold italic tracking-tighter leading-none mb-1 uppercase truncate"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {name}
          </h2>
          <div className="h-1 w-16 bg-red-500 mb-6"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-2 border-red-500/50 pl-3">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Win Rate</p>
              <p className="text-xl font-bold italic">{winRate}</p>
            </div>
            <div className="border-l-2 border-red-500/50 pl-3">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">K/D Ratio</p>
              <p className="text-xl font-bold italic">{kdRatio}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-4 text-[7px] text-gray-600 font-mono tracking-[0.2em] uppercase opacity-50">
          ProCard.ai // Powered by Esteban Württele Cueva
        </div>
      </div>
    </div>
  );
}