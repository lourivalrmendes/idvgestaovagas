export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidatos: {
        Row: {
          cidade: string | null
          created_at: string
          created_by_user_id: string
          email: string | null
          estado: string | null
          id: string
          linkedin: string | null
          nome: string
          telefone_celular: string | null
          telefone_outro: string | null
          ultimo_cv_nome: string | null
          ultimo_cv_tipo: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          created_by_user_id: string
          email?: string | null
          estado?: string | null
          id?: string
          linkedin?: string | null
          nome: string
          telefone_celular?: string | null
          telefone_outro?: string | null
          ultimo_cv_nome?: string | null
          ultimo_cv_tipo?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          created_by_user_id?: string
          email?: string | null
          estado?: string | null
          id?: string
          linkedin?: string | null
          nome?: string
          telefone_celular?: string | null
          telefone_outro?: string | null
          ultimo_cv_nome?: string | null
          ultimo_cv_tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      envios: {
        Row: {
          candidato_id: string
          created_at: string
          created_by_user_id: string
          data_envio: string
          id: string
          observacoes: string | null
          status_candidato_na_vaga: string
          updated_at: string
          vaga_id: string
        }
        Insert: {
          candidato_id: string
          created_at?: string
          created_by_user_id: string
          data_envio?: string
          id?: string
          observacoes?: string | null
          status_candidato_na_vaga?: string
          updated_at?: string
          vaga_id: string
        }
        Update: {
          candidato_id?: string
          created_at?: string
          created_by_user_id?: string
          data_envio?: string
          id?: string
          observacoes?: string | null
          status_candidato_na_vaga?: string
          updated_at?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "envios_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          area: string | null
          ativo: boolean
          created_at: string
          email: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          ativo?: boolean
          created_at?: string
          email?: string | null
          id: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          ativo?: boolean
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          sla_dias_uteis: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          sla_dias_uteis?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sla_dias_uteis?: number
          updated_at?: string
        }
        Relationships: []
      }
      unidades_negocio: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vaga_status_historico: {
        Row: {
          alterado_por: string | null
          criado_em: string
          id: string
          observacao: string | null
          status_anterior: string | null
          status_novo: string
          vaga_id: string
        }
        Insert: {
          alterado_por?: string | null
          criado_em?: string
          id?: string
          observacao?: string | null
          status_anterior?: string | null
          status_novo: string
          vaga_id: string
        }
        Update: {
          alterado_por?: string | null
          criado_em?: string
          id?: string
          observacao?: string | null
          status_anterior?: string | null
          status_novo?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaga_status_historico_alterado_por_fkey"
            columns: ["alterado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaga_status_historico_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      vagas: {
        Row: {
          area_solicitante: string | null
          categoria_id: string | null
          certificacoes: string | null
          cliente_id: string | null
          codigo: string | null
          created_at: string
          data_criacao: string
          data_prevista_inicio: string | null
          data_solicitacao: string | null
          data_ultima_alteracao: string
          data_validacao_rh: string | null
          endereco_local_trabalho: string | null
          espanhol_nivel: string | null
          faixa_salarial: string | null
          formacao: string | null
          funcao: string
          hibrido_dias_presencial: number | null
          horario_trabalho: string | null
          id: string
          ingles_nivel: string | null
          linguagens_e_frameworks_necessarios: string | null
          modalidade: string | null
          motivo_abertura_vaga: string | null
          motivo_reprovacao_rh: string | null
          necessario_equipamento: boolean | null
          nivel_senioridade: string | null
          nome_cliente: string | null
          nome_solicitante: string | null
          observacoes: string | null
          principais_responsabilidades: string | null
          proprietario_user_id: string
          quantidade_de_vagas: number | null
          quantidade_horas_mes: number | null
          recrutador_user_id: string | null
          requisitos_tecnicos: string | null
          soft_skills: string | null
          status: string
          tempo_de_contrato: string | null
          tipo_contratacao: string | null
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          area_solicitante?: string | null
          categoria_id?: string | null
          certificacoes?: string | null
          cliente_id?: string | null
          codigo?: string | null
          created_at?: string
          data_criacao?: string
          data_prevista_inicio?: string | null
          data_solicitacao?: string | null
          data_ultima_alteracao?: string
          data_validacao_rh?: string | null
          endereco_local_trabalho?: string | null
          espanhol_nivel?: string | null
          faixa_salarial?: string | null
          formacao?: string | null
          funcao?: string
          hibrido_dias_presencial?: number | null
          horario_trabalho?: string | null
          id?: string
          ingles_nivel?: string | null
          linguagens_e_frameworks_necessarios?: string | null
          modalidade?: string | null
          motivo_abertura_vaga?: string | null
          motivo_reprovacao_rh?: string | null
          necessario_equipamento?: boolean | null
          nivel_senioridade?: string | null
          nome_cliente?: string | null
          nome_solicitante?: string | null
          observacoes?: string | null
          principais_responsabilidades?: string | null
          proprietario_user_id: string
          quantidade_de_vagas?: number | null
          quantidade_horas_mes?: number | null
          recrutador_user_id?: string | null
          requisitos_tecnicos?: string | null
          soft_skills?: string | null
          status?: string
          tempo_de_contrato?: string | null
          tipo_contratacao?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          area_solicitante?: string | null
          categoria_id?: string | null
          certificacoes?: string | null
          cliente_id?: string | null
          codigo?: string | null
          created_at?: string
          data_criacao?: string
          data_prevista_inicio?: string | null
          data_solicitacao?: string | null
          data_ultima_alteracao?: string
          data_validacao_rh?: string | null
          endereco_local_trabalho?: string | null
          espanhol_nivel?: string | null
          faixa_salarial?: string | null
          formacao?: string | null
          funcao?: string
          hibrido_dias_presencial?: number | null
          horario_trabalho?: string | null
          id?: string
          ingles_nivel?: string | null
          linguagens_e_frameworks_necessarios?: string | null
          modalidade?: string | null
          motivo_abertura_vaga?: string | null
          motivo_reprovacao_rh?: string | null
          necessario_equipamento?: boolean | null
          nivel_senioridade?: string | null
          nome_cliente?: string | null
          nome_solicitante?: string | null
          observacoes?: string | null
          principais_responsabilidades?: string | null
          proprietario_user_id?: string
          quantidade_de_vagas?: number | null
          quantidade_horas_mes?: number | null
          recrutador_user_id?: string | null
          requisitos_tecnicos?: string | null
          soft_skills?: string | null
          status?: string
          tempo_de_contrato?: string | null
          tipo_contratacao?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vagas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_proprietario_user_id_fkey"
            columns: ["proprietario_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_recrutador_user_id_fkey"
            columns: ["recrutador_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_negocio"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_comercial: { Args: { _user_id: string }; Returns: boolean }
      is_coord_rh: { Args: { _user_id: string }; Returns: boolean }
      is_recrutador: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "ADMIN" | "COORDENADOR_RH" | "RECRUTADOR" | "COMERCIAL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["ADMIN", "COORDENADOR_RH", "RECRUTADOR", "COMERCIAL"],
    },
  },
} as const
