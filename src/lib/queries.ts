import { cache } from "react";
import { supabase } from "./supabase";
import type { Criptomoneda, Categoria } from "./types";

const CRIPTO_SELECT = "*, categorias(nombre, slug)";

export const getCategorias = cache(async (): Promise<Categoria[]> => {
const { data, error } = await supabase
.from("categorias")
.select("*")
.order("nombre")
.overrideTypes<Categoria[], { merge: false }>();

if (error) throw new Error(`No se pudieron cargar las Categorias: ${error.message}`);
return data;
});

export const getCriptomoneda = cache(async (): Promise<Criptomoneda[]> => {
const { data, error } = await supabase
.from("criptomonedas")
.select(CRIPTO_SELECT)
.order("created_at", { ascending: false })
.overrideTypes<Criptomoneda[], { merge: false }>();

if (error) throw new Error(`No se pudieron cargar las Criptos: ${error.message}`);
return data;
});

export const getCriptomonedaById = cache(async (id: number): Promise<Criptomoneda | null> => {
const { data, error } = await supabase
.from("criptomonedas")
.select(CRIPTO_SELECT)
.eq("id", id)
.maybeSingle<Criptomoneda>();

if (error) throw new Error(`Error al buscar la criptomoneda: ${error.message}`);
return data;
});

// Reto
// Una cripto inexistente devuelve null; los errores de Supabase se propagan.
// getCategoriaBySlug y getCritomonedaByCategoria

export const getCategoriaBySlug = cache(async (slug: string): Promise<Categoria | null> => {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Categoria>();

  if (error) throw new Error(`No se pudo cargar la categoría: ${error.message}`);
  return data;
});

export const getCriptomonedaByCategoria = cache(async (categoriaId: number): Promise<Criptomoneda[]> => {
  const { data, error } = await supabase
    .from("criptomonedas")
    .select(CRIPTO_SELECT)
    .eq("categoria_id", categoriaId)
    .order("nombre")
    .overrideTypes<Criptomoneda[], { merge: false }>();

  if (error) throw new Error(`No se pudieron cargar las criptos de la categoria: ${error.message}`);
  return data;
});
