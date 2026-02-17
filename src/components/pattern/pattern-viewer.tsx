"use client";

import { CrochetPattern } from "@/lib/pattern/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Need to install badge? No, I didn't install it. I'll use a span or install it.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";


// I'll stick to components I installed: card, tabs, scroll-area, separator
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function PatternViewer({ pattern }: { pattern: CrochetPattern }) {
    return (
        <div className="container mx-auto p-6 md:p-8 print:p-0 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8 print:block">
                {/* Sidebar / Summary */}
                <div className="w-full lg:w-1/3 space-y-6 print:w-full print:mb-6">
                    <Card className="print:border-0 print:shadow-none border-stone-200 shadow-sm bg-stone-50/50">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20 capitalize">
                                        {pattern.category}
                                    </Badge>
                                    <CardTitle className="text-3xl font-serif text-stone-800">{pattern.title}</CardTitle>
                                    <CardDescription className="print:hidden mt-1 text-base">
                                        Modo: <span className="font-medium text-foreground capitalize">{pattern.mode}</span>
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="icon" onClick={() => window.print()} className="print:hidden shrink-0 h-10 w-10 text-stone-600">
                                    🖨️
                                </Button>
                            </div>
                            {pattern.mode === 'exact' && (
                                <div className="mt-3 text-xs font-bold text-green-700 border border-green-200 bg-green-50 p-2 rounded-md w-full text-center uppercase tracking-wider">
                                    ✨ Exacto 100% Calibrado
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-stone-100 shadow-sm">
                                    <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-1">Confianza IA</h3>
                                    <div className="text-2xl font-bold text-primary">{pattern.confidence}%</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-stone-100 shadow-sm">
                                    <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-1">Dificultad</h3>
                                    <div className="text-sm font-medium text-stone-700">Intermedio</div>
                                </div>
                            </div>

                            <Separator className="bg-stone-200" />

                            <div>
                                <h3 className="font-bold text-sm text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    🧶 Materiales
                                </h3>
                                <ul className="text-sm space-y-2 text-stone-600">
                                    {pattern.materials.yarn.map((y, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="block w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                                            <span>
                                                <strong className="text-stone-800">{y.weight} {y.fiber}</strong>
                                                <span className="block text-xs text-muted-foreground">Colores: {y.colors.join(", ")} ({y.meters_est || "?"}m)</span>
                                            </span>
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2 bg-stone-100 p-2 rounded-md font-medium text-stone-800">
                                        <span className="text-lg">🪡</span> Gancho recomendado: {pattern.materials.hook_mm_recommended}mm
                                    </li>
                                </ul>
                            </div>

                            <Separator className="bg-stone-200" />

                            <div>
                                <h3 className="font-bold text-sm text-stone-800 uppercase tracking-wider mb-2">Muestra (Gauge)</h3>
                                <p className="text-sm text-stone-600 bg-stone-100 p-3 rounded-md border border-stone-200 italic">
                                    "{pattern.gauge.target}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-2/3 print:w-full">
                    <Tabs defaultValue="instructions" className="print:hidden w-full">
                        <TabsList className="w-full h-12 bg-stone-100 p-1 mb-6 rounded-xl">
                            <TabsTrigger value="instructions" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">📝 Instrucciones</TabsTrigger>
                            <TabsTrigger value="abbreviations" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">🔤 Abreviaturas</TabsTrigger>
                            <TabsTrigger value="assembly" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">🧩 Ensamblaje</TabsTrigger>
                        </TabsList>

                        <div className="min-h-[500px]">
                            <TabsContent value="instructions" className="mt-0 focus-visible:ring-0">
                                <InstructionsView pattern={pattern} />
                            </TabsContent>

                            <TabsContent value="abbreviations" className="mt-0 focus-visible:ring-0">
                                <AbbreviationsView pattern={pattern} />
                            </TabsContent>

                            <TabsContent value="assembly" className="mt-0 focus-visible:ring-0">
                                <AssemblyView pattern={pattern} />
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Print view: Show all */}
                    <div className="hidden print:block space-y-10">
                        <InstructionsView pattern={pattern} />
                        <div className="grid grid-cols-2 gap-8 break-inside-avoid">
                            <AbbreviationsView pattern={pattern} />
                            <AssemblyView pattern={pattern} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InstructionsView({ pattern }: { pattern: CrochetPattern }) {
    return (
        <div className="space-y-4">
            {pattern.parts.map((part, i) => (
                <Card key={i} className="print:border-0 print:shadow-none break-inside-avoid">
                    <CardHeader>
                        <CardTitle className="text-lg">{part.name}</CardTitle>
                        <CardDescription>Worked {part.worked}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-auto pr-4">
                            <ul className="space-y-2">
                                {part.instructions.map((step, si) => (
                                    <li key={si} className="flex gap-4">
                                        <div className="min-w-[60px] font-mono font-bold text-muted-foreground text-sm">
                                            {step.label}
                                        </div>
                                        <div className="flex-1">
                                            <p>{step.text}</p>
                                        </div>
                                        {step.stitch_count !== null && (
                                            <div className="text-xs font-mono text-muted-foreground border px-1 rounded h-fit">
                                                {step.stitch_count} sts
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function AbbreviationsView({ pattern }: { pattern: CrochetPattern }) {
    return (
        <Card className="print:border-0 print:shadow-none break-inside-avoid">
            <CardHeader className="print:py-2">
                <CardTitle>Abbreviations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {pattern.abbreviations.map((abbr, i) => (
                        <div key={i} className="flex justify-between border-b py-2">
                            <span className="font-bold">{abbr.abbr}</span>
                            <span className="text-muted-foreground">{abbr.meaning}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function AssemblyView({ pattern }: { pattern: CrochetPattern }) {
    return (
        <Card className="print:border-0 print:shadow-none break-inside-avoid">
            <CardHeader className="print:py-2">
                <CardTitle>Assembly</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <ul className="list-decimal pl-4 space-y-2">
                    {pattern.assembly.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                    {pattern.finishing.map((step, i) => (
                        <li key={`fin-${i}`}>{step}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
