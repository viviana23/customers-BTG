/** Categoría de un fondo de inversión */
export type FundCategory = 'FPV' | 'FIC';

/** Representa un fondo de inversión disponible */
export interface Fund {
  id: number;
  name: string;
  minimumAmount: number;
  category: FundCategory;
}
