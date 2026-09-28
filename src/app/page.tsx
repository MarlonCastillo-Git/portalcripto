import Link from "next/link";
import CriptomonedaCard from "@/components/CriptomonedaCard";
import { getCriptomoneda, getCategorias } from "@/lib/queries";


// ISR: la página es estática y se regenera en segundo plano cada 60 s
export const revalidate = 60;

export default async function HomePage() {
const [categorias, criptomoneda] = await Promise.all([getCategorias(), getCriptomoneda()]);

return (
<div className="space-y-16">
<section className="rounded-3xl bg-teal-50 px-8 py-16 text-center">
<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl"> Portal de Criptomonedas
</h1>
<p className="mx-auto mt-4 max-w-xl text-lg text-stone-700">
Portal para visualizar diversos tipos de criptomonedas.
</p>
<a
href="#criptomoneda"
className="mt-8 inline-block rounded-full bg-teal-700 px-8 py-3 font-semibold text-white transition hover:bg-teal-800"
>
Ver Criptomonedas
</a>
</section>

{/* Navegación a las diferentes criptomonedas por categoria. */}
<section id="categorias" className="scroll-mt-8">
<h2 className="mb-6 text-2xl font-bold">Categorias</h2>
<div className="grid gap-4 sm:grid-cols-3">
{categorias.map((z) => (
<Link key={z.id} href={`/categorias/${z.slug}`} className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-teal-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
<h3 className="text-lg font-bold">{z.nombre}</h3>
<p className="mt-1 text-sm text-stone-600">{z.descripcion}</p>
</Link>
))}
</div>
</section>

<section id="criptomoneda" className="scroll-mt-8">
<h2 className="mb-6 text-2xl font-bold">Todas las criptomonedas</h2>
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{criptomoneda.map((r) => (
<CriptomonedaCard key={r.id} cripto={r} />
))}
</div>
</section>
</div>
);
}
