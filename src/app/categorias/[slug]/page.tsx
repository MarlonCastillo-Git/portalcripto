import Link from "next/link";
import { notFound } from "next/navigation";
import CriptomonedaCard from "@/components/CriptomonedaCard";
import { getCategoriaBySlug, getCriptomonedaByCategoria } from "@/lib/queries";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const categoria = await getCategoriaBySlug(slug);
  if (!categoria) notFound();
  const criptomonedas = await getCriptomonedaByCategoria(categoria.id);

  return (
    <div className="space-y-8">
      <Link href="/#categorias" className="text-sm text-stone-500 hover:text-teal-700">
        ← Volver a categorías
      </Link>
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold">{categoria.nombre}</h1>
        {categoria.descripcion && <p className="text-lg text-stone-600">{categoria.descripcion}</p>}
      </header>
      {criptomonedas.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {criptomonedas.map((cripto) => <CriptomonedaCard key={cripto.id} cripto={cripto} />)}
        </div>
      ) : (
        <p className="text-stone-600">Todavía no hay criptomonedas en esta categoría.</p>
      )}
    </div>
  );
}
