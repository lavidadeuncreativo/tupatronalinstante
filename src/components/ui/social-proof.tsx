"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ProofEvent = {
    name: string;
    action: string;
    item: string;
    location: string;
    timeAgo: string;
    avatar: string;
};

const MOCK_EVENTS: ProofEvent[] = [
    { name: "Sofia", action: "generó patrón de", item: "Amigurumi Oso", location: "Lima, Perú", timeAgo: "hace 2 min", avatar: "👩🏻" },
    { name: "Valentina", action: "descargó PDF de", item: "Top Crop", location: "Bogotá, Colombia", timeAgo: "hace 5 min", avatar: "👩🏼" },
    { name: "Mateo", action: "completó", item: "Gorro Beanie", location: "Buenos Aires, Arg", timeAgo: "hace 1 min", avatar: "🧔🏻" },
    { name: "Camila", action: "empezó proyecto", item: "Manta Zigzag", location: "Santiago, Chile", timeAgo: "hace 10 min", avatar: "👩🏽" },
    { name: "Lucía", action: "generó patrón de", item: "Bufanda Infinita", location: "CDMX, México", timeAgo: "hace 30 seg", avatar: "👩🏻‍🦱" },
    { name: "Isabella", action: "subió foto de", item: "Cardigan", location: "Montevideo, Uru", timeAgo: "hace 8 min", avatar: "👱🏻‍♀️" },
    { name: "Fernanda", action: "terminó", item: "Bolso Market", location: "San José, CR", timeAgo: "hace 45 seg", avatar: "👩🏾" },
];

export function SocialProof() {
    const [currentEvent, setCurrentEvent] = useState<ProofEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Initial delay
        const initialTimer = setTimeout(() => {
            triggerEvent();
        }, 4000);

        const loopTimer = setInterval(() => {
            triggerEvent();
        }, 12000); // Trigger every 12 seconds mostly

        return () => {
            clearTimeout(initialTimer);
            clearInterval(loopTimer);
        };
    }, []);

    const triggerEvent = () => {
        setIsVisible(false);
        setTimeout(() => {
            const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
            setCurrentEvent(randomEvent);
            setIsVisible(true);

            // Auto hide after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        }, 500); // 
    };

    if (!currentEvent) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-4 right-4 z-50 max-w-sm"
                >
                    <div className="bg-white/95 backdrop-blur shadow-lg border border-primary/20 rounded-xl p-4 flex items-start gap-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0">
                            {currentEvent.avatar}
                        </div>
                        <div className="flex-1 pr-6">
                            <p className="text-sm text-stone-800 leading-tight">
                                <span className="font-bold text-primary">{currentEvent.name}</span> {currentEvent.action}{" "}
                                <span className="font-medium">{currentEvent.item}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                📍 {currentEvent.location} • {currentEvent.timeAgo}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-stone-900"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
