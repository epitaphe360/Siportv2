import { createClient } from '@supabase/supabase-js';
import { UserProfile, ContactInfo, MiniSiteSection } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifier si Supabase est configuré avec de vraies valeurs
const isSupabaseConfigured = supabaseUrl && 
                             supabaseAnonKey &&
                             (supabaseUrl.startsWith('https://') &&
                              !supabaseUrl.includes('placeholder') &&
                              !supabaseUrl.includes('votre-project-id')) &&
                             (supabaseAnonKey.length > 50 ||
                              supabaseAnonKey.startsWith('demo_') ||
                              supabaseAnonKey.includes('demo')) &&
                             !supabaseAnonKey.includes('placeholder');

if (!isSupabaseConfigured) {
  console.info('ℹ️ Mode développement - Utilisation des valeurs de démonstration');
  console.info('Pour la production, configurez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env');
  console.info('URL actuelle:', supabaseUrl);
}

// Créer le client Supabase seulement si configuré correctement
export const supabase = isSupabaseConfigured && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Export de la fonction de vérification
export const isSupabaseReady = () => isSupabaseConfigured && supabase !== null;

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          type: 'exhibitor' | 'partner' | 'visitor' | 'admin';
          profile: UserProfile;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          type: 'exhibitor' | 'partner' | 'visitor' | 'admin';
          profile: UserProfile;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          type?: 'exhibitor' | 'partner' | 'visitor' | 'admin';
          profile?: UserProfile;
          created_at?: string;
          updated_at?: string;
        };
      };
      exhibitors: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          category: string;
          sector: string;
          description: string;
          logo_url: string | null;
          website: string | null;
          verified: boolean;
          featured: boolean;
          contact_info: ContactInfo;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          category: string;
          sector: string;
          description: string;
          logo_url?: string | null;
          website?: string | null;
          verified?: boolean;
          featured?: boolean;
          contact_info?: ContactInfo;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          category?: string;
          sector?: string;
          description?: string;
          logo_url?: string | null;
          website?: string | null;
          verified?: boolean;
          featured?: boolean;
          contact_info?: ContactInfo;
          created_at?: string;
          updated_at?: string;
        };
      };
      mini_sites: {
        Row: {
          id: string;
          exhibitor_id: string;
          theme: string;
          custom_colors: { primary: string; secondary: string; accent: string };
          sections: MiniSiteSection[];
          published: boolean;
          views: number;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          exhibitor_id: string;
          theme: string;
          custom_colors?: { primary: string; secondary: string; accent: string };
          sections?: MiniSiteSection[];
          published?: boolean;
          views?: number;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          exhibitor_id?: string;
          theme?: string;
          custom_colors?: { primary: string; secondary: string; accent: string };
          sections?: MiniSiteSection[];
          published?: boolean;
          views?: number;
          last_updated?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          exhibitor_id: string;
          name: string;
          description: string;
          category: string;
          images: string[];
          specifications: string | null;
          price: number | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exhibitor_id: string;
          name: string;
          description: string;
          category: string;
          images?: string[];
          specifications?: string | null;
          price?: number | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exhibitor_id?: string;
          name?: string;
          description?: string;
          category?: string;
          images?: string[];
          specifications?: string | null;
          price?: number | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          exhibitor_id: string;
          visitor_id: string;
          time_slot_id: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          message: string | null;
          notes: string | null;
          rating: number | null;
          created_at: string;
          meeting_type: 'in-person' | 'virtual' | 'hybrid';
          meeting_link: string | null;
        };
        Insert: {
          id?: string;
          exhibitor_id: string;
          visitor_id: string;
          time_slot_id: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          message?: string | null;
          notes?: string | null;
          rating?: number | null;
          created_at?: string;
          meeting_type?: 'in-person' | 'virtual' | 'hybrid';
          meeting_link?: string | null;
        };
        Update: {
          id?: string;
          exhibitor_id?: string;
          visitor_id?: string;
          time_slot_id?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          message?: string | null;
          notes?: string | null;
          rating?: number | null;
          created_at?: string;
          meeting_type?: 'in-person' | 'virtual' | 'hybrid';
          meeting_link?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: 'webinar' | 'roundtable' | 'networking' | 'workshop' | 'conference';
          event_date: string;
          start_time: string;
          end_time: string;
          capacity: number;
          registered: number;
          category: string;
          virtual: boolean;
          featured: boolean;
          location: string | null;
          meeting_link: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: 'webinar' | 'roundtable' | 'networking' | 'workshop' | 'conference';
          event_date: string;
          start_time: string;
          end_time: string;
          capacity?: number;
          registered?: number;
          category: string;
          virtual?: boolean;
          featured?: boolean;
          location?: string | null;
          meeting_link?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: 'webinar' | 'roundtable' | 'networking' | 'workshop' | 'conference';
          event_date?: string;
          start_time?: string;
          end_time?: string;
          capacity?: number;
          registered?: number;
          category?: string;
          virtual?: boolean;
          featured?: boolean;
          location?: string | null;
          meeting_link?: string | null;
          tags?: string[];
          created_at?: string;
        };
      };
    };
  };
};