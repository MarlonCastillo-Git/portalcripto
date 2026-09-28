export interface Categoria { id: number;
nombre: string; slug: string;
descripcion: string | null;
}

export type Marketcap = "Bajo" | "Mediano" | "Alto";

export interface Criptomoneda { id: number;
nombre: string; descripcion: string; preciousd: number; marketcap: Marketcap; totalmarketcap: number;  imagen_url: string | null; categoria_id: number; created_at: string;
// Viene del JOIN: select("*, categoria(nombre, slug)")
categorias: Pick<Categoria, "nombre" | "slug"> | null;
}
