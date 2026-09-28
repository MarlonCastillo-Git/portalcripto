import { formatMarketCap } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import type { Criptomoneda } from "@/lib/types";

const COLOR_MARKETCAP: Record<string , string> = { "Bajo": "bg-emerald-100 text-emerald-700", "Mediano": "bg-amber-100 text-amber-700", "Alto": "bg-rose-100 text-rose-700",
};

export default function CriptomonedaCard({ cripto }: { cripto: Criptomoneda }) {
return (
<Link
href={`/criptos/${cripto.id}`}
className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>
<div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
{cripto.imagen_url && (
<Image
src={cripto.imagen_url} alt={cripto.nombre} fill
sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105"
/>
)}
<span
className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
COLOR_MARKETCAP[cripto.marketcap] ?? "bg-stone-100 text-stone-700"
}`}
>
{cripto.marketcap}
</span>
</div>
<div className="space-y-2 p-5">
{cripto.categorias && (
<span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
{cripto.categorias.nombre}
</span>
)}
<h3 className="text-lg font-bold text-stone-900">{cripto.nombre}</h3>
<p className="line-clamp-2 text-sm text-stone-600">{cripto.descripcion}</p>
<div className="space-y-1 text-sm text-stone-500">
<p><span className="font-semibold">Precio :</span> {cripto.preciousd} USD</p>
<p><span className="font-semibold">Capitalización Total :</span> {formatMarketCap(cripto.totalmarketcap)} USD</p>
</div>
</div>
</Link>
);
}

