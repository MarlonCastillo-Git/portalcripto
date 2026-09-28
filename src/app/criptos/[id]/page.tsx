import { formatMarketCap } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCriptomonedaById, getCriptomoneda } from "@/lib/queries";

export const revalidate = 60;


// En Next.js 16 `params` es una Promise → hay que hacer await
type Props = { params: Promise<{ id: string }> };

// SSG: genera en build una página por cada ruta existente
export async function generateStaticParams() {
const criptomonedas = await getCriptomoneda();
return criptomonedas.map((r) => ({ id: String(r.id) }));
}

// SEO dinámico: título y descripción distintos por criptomoneda
export async function generateMetadata({ params }: Props): Promise<Metadata> {
const { id } = await params;
const cripto = (/^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0) ? await getCriptomonedaById(Number(id)) : null; if (!cripto) return { title: "Cripto no encontrada" };
return { title: cripto.nombre, description: cripto.descripcion ?? undefined };
}

export default async function CriptoPage({ params }: Props) {
const { id } = await params;
const criptoId = Number(id);
if (!/^\d+$/.test(id) || !Number.isSafeInteger(criptoId) || criptoId <= 0) notFound();

const cripto = await getCriptomonedaById(criptoId);
if (!cripto) notFound();

return (
<article className="mx-auto max-w-3xl space-y-8">

<Link href="/" className="text-sm text-stone-500 hover:text-teal-700">
  ← Volver al inicio
</Link>


<div className="relative aspect-video overflow-hidden rounded-3xl bg-stone-100">
{cripto.imagen_url && (
<Image
src={cripto.imagen_url} alt={cripto.nombre} fill
priority
sizes="(min-width: 768px) 768px, 100vw" className="object-cover"
/>
)}
</div>
<header className="space-y-3">
{cripto.categorias && (
<Link
href={`/categorias/${cripto.categorias.slug}`}
className="text-sm font-semibold uppercase tracking-wide text-teal-700 hover:underline"
>
{cripto.categorias.nombre}
</Link>
)}
<h1 className="text-4xl font-extrabold">{cripto.nombre}</h1>
<p className="text-lg text-stone-600">{cripto.descripcion}</p>
<div className="space-y-1 text-sm text-stone-500">
<p><span className="font-semibold">Precio :</span> {cripto.preciousd} USD</p>
<p><span className="font-semibold">Capitalización Total :</span> {formatMarketCap(cripto.totalmarketcap)} USD</p>
</div>
</header>
</article>
);
}
