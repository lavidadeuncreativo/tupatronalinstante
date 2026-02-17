export default function PricingPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-4">Precios</h1>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="border p-6 rounded-lg text-center">
                    <h2 className="text-xl font-bold">Free</h2>
                    <p className="text-3xl font-bold my-4">$0</p>
                    <ul className="text-left space-y-2 mb-6">
                        <li>✓ Modo Instante</li>
                        <li>✓ 3 Patrones/mes</li>
                    </ul>
                </div>
                <div className="border p-6 rounded-lg text-center bg-primary/5 border-primary">
                    <h2 className="text-xl font-bold">Pro</h2>
                    <p className="text-3xl font-bold my-4">$9.99</p>
                    <ul className="text-left space-y-2 mb-6">
                        <li>✓ Modo Exacto 100%</li>
                        <li>✓ PDF Export</li>
                        <li>✓ Ilimitado</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
