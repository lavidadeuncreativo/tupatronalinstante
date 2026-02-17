"use client";

import Link from "next/link";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { PatternViewer } from "@/components/pattern/pattern-viewer";
import { toast } from "sonner"; // Using sonner as recommended
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GeneratorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"instant" | "exact">("instant");
    const [calibrationValue, setCalibrationValue] = useState("");
    const [generatedPattern, setGeneratedPattern] = useState(null);

    const router = useRouter();

    const onDrop = (acceptedFiles: File[]) => {
        const f = acceptedFiles[0];
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleGenerate = async () => {
        console.log("Handle Generate clicked", { file, mode, calibrationValue });
        if (!file && !preview) {
            console.log("No file/preview");
            return;
        }
        if (mode === "exact" && !calibrationValue) {
            console.log("Missing calibration");
            toast.error("Para el modo Exacto, debes ingresar una medida de referencia (ej: Moneda = 2.5cm)");
            return;
        }

        setLoading(true);
        setGeneratedPattern(null);

        try {
            let base64 = "";
            let imageUrl = "";

            if (file) {
                // Convert file to base64
                const reader = new FileReader();
                reader.readAsDataURL(file!);
                await new Promise((resolve) => {
                    reader.onload = () => {
                        base64 = reader.result as string;
                        resolve(null);
                    };
                });
            } else if (preview && preview.startsWith("http")) {
                imageUrl = preview;
            }

            if (!base64 && !imageUrl) {
                toast.error("No image data found");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64, imageUrl, mode })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");

            setGeneratedPattern(data.pattern);

            // Save to local history for demo
            const history = JSON.parse(localStorage.getItem("pattern_history") || "[]");
            history.unshift({
                id: Date.now().toString(),
                title: data.pattern.title,
                category: data.pattern.category,
                date: new Date().toISOString(),
                pattern: data.pattern
            });
            localStorage.setItem("pattern_history", JSON.stringify(history));

            toast.success("Patrón generado con éxito!");

        } catch (e) {
            toast.error("Error al generar el patrón. Intenta de nuevo.");
            console.error(e);
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-primary cursor-pointer" onClick={() => router.push('/')}>
                        Patrón al instante
                    </div>
                    <nav className="flex gap-4 text-sm font-medium">
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
                        <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">Comunidad</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto p-4 max-w-5xl py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Generador de Patrones</h1>
                    <p className="text-muted-foreground">Sube tu imagen y deja que la IA haga la magia.</p>
                </div>

                <div className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg mb-6 border border-yellow-500/30 flex items-start gap-3">
                    <div className="mt-1">⚠️</div>
                    <div>
                        <h4 className="font-bold">Modo Demostración Activo</h4>
                        <p className="text-sm">
                            El sistema está ejecutándose sin una API Key de Gemini configurada.
                            Los patrones generados son <strong>ejemplos estáticos</strong> y NO corresponderán a la imagen que subas.
                            Para obtener resultados reales, configura la variable <code>GOOGLE_GENERATIVE_AI_API_KEY</code> en el servidor.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <Tabs defaultValue="upload" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="upload">Subir Imagen</TabsTrigger>
                                        <TabsTrigger value="url">Pegar URL</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload">
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
                                        >
                                            <input {...getInputProps()} />
                                            {preview ? (
                                                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-md shadow-md" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <UploadCloud className="h-10 w-10" />
                                                    <p>Arrastra tu imagen aquí o haz click</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="url">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="url-input">URL de la imagen</Label>
                                                <Input
                                                    id="url-input"
                                                    placeholder="https://ejemplo.com/imagen.jpg"
                                                    onChange={(e) => {
                                                        const url = e.target.value;
                                                        if (url) {
                                                            setPreview(url);
                                                            // Fake file object for logic consistency or handle URL separately
                                                            // For now, we will handle URL in handleGenerate if file is null but preview is set
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {preview && (
                                                <div className="rounded-md border p-2 bg-muted/20">
                                                    <img src={preview} alt="Preview from URL" className="max-h-64 mx-auto rounded-md" />
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <Label className="text-base font-semibold">Modo de Generación</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setMode("instant")}
                                        className={`border rounded-lg p-4 cursor-pointer hover:bg-muted ${mode === 'instant' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    >
                                        <div className="font-bold">⚡️ Instante</div>
                                        <div className="text-xs text-muted-foreground">Estimación rápida basada en visuales. Bueno para inspiración.</div>
                                    </div>
                                    <div
                                        onClick={() => setMode("exact")}
                                        className={`border rounded-lg p-4 cursor-pointer hover:bg-muted ${mode === 'exact' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    >
                                        <div className="font-bold">🎯 Exacto 100%</div>
                                        <div className="text-xs text-muted-foreground">
                                            Requiere calibración (foto con regla). Garantiza medidas.
                                        </div>
                                    </div>
                                </div>

                                {mode === "exact" && (
                                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800 space-y-3 animate-in slide-in-from-top-2">
                                        <Label className="text-amber-800 dark:text-amber-200">Calibración Requerida</Label>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Para asegurar el tamaño exacto, necesitamos una referencia. Sube la foto con una regla o introduce la medida del objeto.
                                        </p>
                                        <Input
                                            placeholder="Ej: La moneda mide 2.5cm"
                                            value={calibrationValue}
                                            onChange={(e) => setCalibrationValue(e.target.value)}
                                        />
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={!file || loading}
                                    className="w-full h-12 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {mode === 'exact' ? 'Calibrando y generando...' : 'Generando patrón...'}
                                        </>
                                    ) : (
                                        <>
                                            Generar Patrón
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        {generatedPattern ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold mb-4">Resultado</h2>
                                <div className="bg-muted/30 p-4 rounded-xl border">
                                    <PatternViewer pattern={generatedPattern} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl min-h-[400px]">
                                <div className="text-center p-8">
                                    <p>El resultado aparecerá aquí.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
