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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          attachment_url: string | null
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          proposed_rate: number | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          proposed_rate?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          proposed_rate?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      client_profiles: {
        Row: {
          client_kind: Database["public"]["Enums"]["client_kind"]
          company_name: string | null
          industry: string | null
          is_verified: boolean
          profile_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          client_kind?: Database["public"]["Enums"]["client_kind"]
          company_name?: string | null
          industry?: string | null
          is_verified?: boolean
          profile_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          client_kind?: Database["public"]["Enums"]["client_kind"]
          company_name?: string | null
          industry?: string | null
          is_verified?: boolean
          profile_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          agreed_rate: number | null
          application_id: string
          completed_at: string | null
          id: string
          started_at: string
          status: Database["public"]["Enums"]["contract_status"]
          submitted_at: string | null
        }
        Insert: {
          agreed_rate?: number | null
          application_id: string
          completed_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
        }
        Update: {
          agreed_rate?: number | null
          application_id?: string
          completed_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          job_id: string
          skill_id: string
        }
        Insert: {
          job_id: string
          skill_id: string
        }
        Update: {
          job_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category_id: string | null
          client_id: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          location_detail: string | null
          location_type: Database["public"]["Enums"]["location_type"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          published_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          client_id: string
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          location_detail?: string | null
          location_type?: Database["public"]["Enums"]["location_type"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          published_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          location_detail?: string | null
          location_type?: Database["public"]["Enums"]["location_type"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          published_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          location: string | null
          nickname: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          location?: string | null
          nickname?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          nickname?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          contract_id: string
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          contract_id: string
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          contract_id?: string
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string
          job_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          hourly_rate: number | null
          major: string | null
          portfolio_url: string | null
          profile_id: string
          resume_url: string | null
          semester: number | null
          university: string | null
          updated_at: string
        }
        Insert: {
          hourly_rate?: number | null
          major?: string | null
          portfolio_url?: string | null
          profile_id: string
          resume_url?: string | null
          semester?: number | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          hourly_rate?: number | null
          major?: string | null
          portfolio_url?: string | null
          profile_id?: string
          resume_url?: string | null
          semester?: number | null
          university?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skills: {
        Row: {
          level: Database["public"]["Enums"]["proficiency"]
          skill_id: string
          student_id: string
        }
        Insert: {
          level?: Database["public"]["Enums"]["proficiency"]
          skill_id: string
          student_id: string
        }
        Update: {
          level?: Database["public"]["Enums"]["proficiency"]
          skill_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      profile_ratings: {
        Row: {
          average_rating: number | null
          profile_id: string | null
          review_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_counterpart_email: {
        Args: { p_application_id: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_client: { Args: never; Returns: boolean }
      is_student: { Args: never; Returns: boolean }
      push_notification: {
        Args: {
          p_body?: string
          p_link?: string
          p_title: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      client_kind: "individual" | "company"
      contract_status: "active" | "submitted" | "completed" | "cancelled"
      job_status:
        | "draft"
        | "open"
        | "in_progress"
        | "closed"
        | "completed"
        | "cancelled"
      location_type: "remote" | "onsite" | "hybrid"
      notification_type:
        | "application_received"
        | "application_accepted"
        | "application_rejected"
        | "contract_started"
        | "contract_submitted"
        | "contract_completed"
        | "review_received"
        | "system"
      payment_type: "fixed" | "hourly"
      proficiency: "beginner" | "intermediate" | "advanced" | "expert"
      user_role: "student" | "client" | "admin"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: ["pending", "accepted", "rejected", "withdrawn"],
      client_kind: ["individual", "company"],
      contract_status: ["active", "submitted", "completed", "cancelled"],
      job_status: [
        "draft",
        "open",
        "in_progress",
        "closed",
        "completed",
        "cancelled",
      ],
      location_type: ["remote", "onsite", "hybrid"],
      notification_type: [
        "application_received",
        "application_accepted",
        "application_rejected",
        "contract_started",
        "contract_submitted",
        "contract_completed",
        "review_received",
        "system",
      ],
      payment_type: ["fixed", "hourly"],
      proficiency: ["beginner", "intermediate", "advanced", "expert"],
      user_role: ["student", "client", "admin"],
    },
  },
} as const
