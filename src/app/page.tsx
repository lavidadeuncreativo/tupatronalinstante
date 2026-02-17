import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, Ruler, Download, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter text-primary">
            Patrón al instante
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#how-it-works">Cómo funciona</Link>
            <Link href="#pricing">Precios</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/app">
              <Button>Probar ahora</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="absolute top-20 right-0 -z-10 opacity-10 rotate-12">
            <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FF0066" d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.7,-11.7,85.6,2.5C83.5,16.7,75.1,30.1,65.8,42.1C56.5,54.1,46.3,64.8,33.9,70.9C21.5,77,6.9,78.6,-7.1,77.3C-21.1,76,-34.5,71.8,-46.8,63.9C-59.1,56,-70.3,44.4,-77.8,30.6C-85.3,16.8,-89.1,0.8,-85.8,-13.9C-82.5,-28.6,-72.1,-42,-60.5,-51.7C-48.9,-61.4,-36.1,-67.4,-23.4,-71.6C-10.7,-75.8,1.9,-78.2,14.8,-80.6L14.8,0L-14.8,0Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-all font-serif">
              ✨ La herramienta #1 para crocheteros modernos
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-stone-900 leading-[1.1]">
              De tu <span className="text-primary relative inline-block">
                FOTO
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
              </span> a <br />
              <span className="text-stone-800">PATRÓN PDF</span> en segundos.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Sube la imagen de ese amigurumi o prenda que te enamoró y deja que nuestra IA cree las instrucciones paso a paso, lista de materiales y medidas exactas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
              <Link href="/app" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-10 text-xl w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-2xl bg-primary hover:bg-primary/90">
                  <Wand2 className="mr-2 h-6 w-6" />
                  Crear mi Patrón Gratis
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground mt-2 sm:mt-0 font-medium">
                ⚡️ Sin registros •  💸 100% Gratis
              </div>
            </div>

            <div className="mt-16 relative mx-auto max-w-4xl shadow-2xl rounded-2xl overflow-hidden border-8 border-white/50 bg-stone-100">
              <img src="https://images.unsplash.com/photo-1615486511484-92e172cc416d?q=80&w=2070&auto=format&fit=crop" alt="Demo Crochet App" className="w-full h-auto opacity-90 hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-transparent transition-colors pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg text-primary font-bold text-lg flex items-center gap-2">
                  <span className="animate-pulse">🔴</span> Ver cómo funciona
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Improved Features - Visual Steps */}
        <section id="how-it-works" className="py-24 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-stone-800">Tan fácil como tejer cadenetas</h2>
              <p className="text-muted-foreground text-lg">Tres simples pasos para obtener tu próximo proyecto.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-stone-200 dashed-border z-0"></div>

              <div className="relative z-10 text-center">
                <div className="mx-auto bg-white w-24 h-24 rounded-3xl shadow-lg border-2 border-primary/10 flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                  <span className="text-5xl">📸</span>
                </div>
                <h3 className="font-bold text-2xl mb-3 text-stone-800">1. Sube tu Foto</h3>
                <p className="text-muted-foreground px-4">Carga la imagen de referencia. Puede ser un amigurumi, un gorro o cualquier prenda tejida.</p>
              </div>

              <div className="relative z-10 text-center">
                <div className="mx-auto bg-white w-24 h-24 rounded-3xl shadow-lg border-2 border-primary/10 flex items-center justify-center mb-6 transform -rotate-3 hover:-rotate-6 transition-transform">
                  <span className="text-5xl">🤖</span>
                </div>
                <h3 className="font-bold text-2xl mb-3 text-stone-800">2. Análisis IA</h3>
                <p className="text-muted-foreground px-4">Nuestra inteligencia artificial identifica los puntos, cuenta las vueltas y calcula las medidas.</p>
              </div>

              <div className="relative z-10 text-center">
                <div className="mx-auto bg-white w-24 h-24 rounded-3xl shadow-lg border-2 border-primary/10 flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                  <span className="text-5xl">📄</span>
                </div>
                <h3 className="font-bold text-2xl mb-3 text-stone-800">3. Patrón Listo</h3>
                <p className="text-muted-foreground px-4">Recibe un archivo PDF limpio, con instrucciones claras, lista de materiales y diagrama.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & Community */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Lo que dice la comunidad</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardContent className="pt-6 text-left">
                  <p className="italic text-muted-foreground mb-4">"¡Increíble! Subí la foto de un suéter vintage y obtuve un patrón clarísimo. Me ahorró semanas de prueba y error."</p>
                  <div className="font-bold">- Sofia M.</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-left">
                  <p className="italic text-muted-foreground mb-4">"La función de calibración exacta es una locura. Mis amigurumis quedan del tamaño perfecto ahora."</p>
                  <div className="font-bold">- Carlos R.</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold mb-4">Únete a la Comunidad</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Comparte tus creaciones, sube tus propios patrones y descubre qué están tejiendo otros creadores.
              </p>
              <Link href="/community">
                <Button size="lg" variant="secondary" className="text-lg">
                  Explorar Comunidad
                </Button>
              </Link>
            </div>

            {/* Credits & Donation */}
            <div className="max-w-2xl mx-auto border-t pt-12">
              <h3 className="text-xl font-bold mb-4">Diseñado por la vida de un creativo</h3>
              <p className="text-muted-foreground mb-6">
                Este proyecto fue creado por <strong>Israel Granados</strong> para ayudar a tejedores de todo el mundo.
                Si esta herramienta te ha sido útil y quieres apoyar su mantenimiento (¡y mi cafeína!), puedes hacer una donación.
                Este sitio web siempre será gratuito.
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <Link href="https://buymeacoffee.com" target="_blank">
                  <Button variant="outline" className="gap-2">
                    ☕️ Invítame un café
                  </Button>
                </Link>
                <Link href="https://instagram.com/lavidadeuncreativo" target="_blank">
                  <Button variant="ghost" className="gap-2">
                    Instagram
                  </Button>
                </Link>
                <Link href="https://linkedin.com/in/lavidadeuncreativo" target="_blank">
                  <Button variant="ghost" className="gap-2">
                    LinkedIn
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t text-center text-sm text-muted-foreground bg-muted/20">
          <div className="container mx-auto">
            <p>© 2026 Patrón al instante. Todos los derechos reservados.</p>
            <p className="mt-2 text-xs flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Respetamos el copyright: No procesamos fotos de patrones escritos.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
