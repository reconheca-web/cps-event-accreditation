export type StatusInscricao = 'pendente' | 'aprovado' | 'rejeitado';

export interface Inscricao {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  tipo_unidade: string;
  nome_unidade: string;
  cargo?: string;
  check_in?: Date;
  created_at?: Date;
  updated_at?: Date;
  user_id?: string;
  enviado_qrcode?: boolean;
  bloqueado_ia?: boolean;
  status_inscricao?: StatusInscricao;
}

export interface InscricaoInput {
  nome_completo: string;
  email: string;
  telefone: string;
  tipo_unidade: string;
  nome_unidade: string;
  cargo?: string;
  aceite_termo: boolean;
}

export interface Database {
  public: {
    Tables: {
      inscricoes_evento_cps: {
        Row: Inscricao;
        Insert: InscricaoInput;
        Update: Partial<InscricaoInput>;
      };
    };
    Functions: {};
    Enums: {
      status_inscricao_enum: StatusInscricao;
    };
  };
}
