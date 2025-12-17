export class CreatePecaDto {
  tenant_id: string; // Temporário até termos o Auth Guard
  nome: string;
  codigo_sku?: string;
  valor_venda?: number;
  unidade_medida?: string; // ex: 'un', 'cx', 'kg', 'l'
}
