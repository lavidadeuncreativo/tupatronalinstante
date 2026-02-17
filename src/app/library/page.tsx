"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatternViewer } from "@/components/pattern/pattern-viewer";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function LibraryPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedPattern, setSelectedPattern] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("pattern_history");
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("pattern_history");
        setHistory([]);
        setSelectedPattern(null);
    }

    if (selectedPattern) {
        return (
            <div className="container mx-auto p-4 max-w-5xl">
                <Button variant="ghost" onClick={() => setSelectedPattern(null)} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la Biblioteca
                </Button>
                <PatternViewer pattern={selectedPattern} />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
                    <p className="text-muted-foreground">Tus patrones generados anteriormente (LocalStorage Demo).</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/app">
                        <Button>Nuevo Patrón</Button>
                    </Link>
                    {history.length > 0 && (
                        <Button variant="destructive" onClick={clearHistory}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground mb-4">No tienes patrones guardados aún.</p>
                    <Link href="/app">
                        <Button>Generar el primero</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => (
                        <Card key={item.id} className="cursor-pointer hover:border-primary transition-all" onClick={() => setSelectedPattern(item.pattern)}>
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>{new Date(item.date).toLocaleDateString()} • {item.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
                                    Vista Previa
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
