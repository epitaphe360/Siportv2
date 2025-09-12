import { supabase } from '../lib/supabase';
import { isSupabaseReady } from '../lib/supabase';
import { User, Exhibitor, Product, Appointment, Event, ChatMessage, MiniSiteSection, MessageAttachment } from '../types';

// Interfaces pour les données de base de données
interface UserDB {
  id: string;
  email: string;
  name: string;
  type: 'exhibitor' | 'partner' | 'visitor' | 'admin';
  profile: Record<string, unknown>;
  status?: 'active' | 'pending' | 'suspended' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface ExhibitorDB {
  id: string;
  user_id: string;
  company_name: string;
  category: string;
  sector: string;
  description: string;
  logo_url?: string;
  website?: string;
  verified: boolean;
  featured: boolean;
  contact_info: Record<string, unknown>;
  products?: Record<string, unknown>[];
  mini_site?: Record<string, unknown>;
}

interface MiniSiteDB {
  id: string;
  exhibitor_id: string;
  theme: string;
  custom_colors: Record<string, unknown>;
  sections: Record<string, unknown>[];
  published: boolean;
  views: number;
  last_updated: string;
}

interface AnalyticsData {
  miniSiteViews: number;
  appointments: number;
  products: number;
  profileViews: number;
  connections: number;
  messages: number;
}

interface SearchFilters {
  category?: string;
  sector?: string;
}

export class SupabaseService {
  static async deleteUser(id: string): Promise<void> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { error } = await safeSupabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
  
  private static checkSupabaseConnection() {
    return isSupabaseReady() && supabase;
  }
  
  // ==================== USERS ====================

  static async getUsers(): Promise<User[]> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('users')
      .select('*');
    if (error) throw error;
    return (data || []).map(this.mapUserFromDB);
  }
  
  static async createUser(userData: Partial<User>): Promise<User> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        type: userData.type || 'visitor',
        profile: userData.profile || {}
      }])
      .select()
      .single();
    if (error) throw error;
    return this.mapUserFromDB(data);
  }

  static async getUserById(id: string): Promise<User | null> {
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return this.mapUserFromDB(data);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    if (!this.checkSupabaseConnection()) {
      return null;
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return this.mapUserFromDB(data);
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('users')
      .update({
        name: updates.name,
        type: updates.type,
        profile: updates.profile
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapUserFromDB(data);
  }

  // ==================== EXHIBITORS ====================
  
  static async getExhibitors(): Promise<Exhibitor[]> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('exhibitors')
      .select(`*, user:users(*), products(*), mini_site:mini_sites(*)`);
    if (error) throw error;
    return (data || []).map(this.mapExhibitorFromDB);
  }

  static async getExhibitorById(id: string): Promise<Exhibitor | null> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('exhibitors')
      .select(`
        *,
        user:users(*),
        products(*),
        mini_site:mini_sites(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return this.mapExhibitorFromDB(data);
  }

  static async createExhibitor(exhibitorData: Partial<Exhibitor>): Promise<Exhibitor> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('exhibitors')
      .insert([{
        user_id: exhibitorData.userId,
        company_name: exhibitorData.companyName,
        category: exhibitorData.category,
        sector: exhibitorData.sector,
        description: exhibitorData.description,
        logo_url: exhibitorData.logo,
        website: exhibitorData.website,
        contact_info: exhibitorData.contactInfo || {}
      }])
      .select(`
        *,
        user:users(*),
        products(*),
        mini_site:mini_sites(*)
      `)
      .single();

    if (error) throw error;
    return this.mapExhibitorFromDB(data);
  }

  static async updateExhibitor(id: string, updates: Partial<Exhibitor>): Promise<Exhibitor> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('exhibitors')
      .update({
        company_name: updates.companyName,
        category: updates.category,
        sector: updates.sector,
        description: updates.description,
        logo_url: updates.logo,
        website: updates.website,
        verified: updates.verified,
        featured: updates.featured,
        contact_info: updates.contactInfo
      })
      .eq('id', id)
      .select(`
        *,
        user:users(*),
        products(*),
        mini_site:mini_sites(*)
      `)
      .single();

    if (error) throw error;
    return this.mapExhibitorFromDB(data);
  }

  // ==================== MOCK DATA ====================
  

  // ==================== MINI SITES ====================
  
  static async getMiniSite(exhibitorId: string): Promise<MiniSiteDB | null> {
    if (!this.checkSupabaseConnection()) {
      return null;
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('mini_sites')
      .select('*')
      .eq('exhibitor_id', exhibitorId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data;
  }

  static async updateMiniSite(exhibitorId: string, siteData: Partial<MiniSiteDB>): Promise<MiniSiteDB> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('mini_sites')
      .upsert({
        exhibitor_id: exhibitorId,
        theme: siteData.theme,
        custom_colors: siteData.custom_colors,
        sections: siteData.sections,
        published: siteData.published
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async incrementMiniSiteViews(exhibitorId: string): Promise<void> {
    if (!this.checkSupabaseConnection()) {
      return;
    }
    
    const safeSupabase = supabase!;
    // Incrémentation manuelle (lecture + update)
    const { data, error: fetchError } = await safeSupabase
      .from('mini_sites')
      .select('views')
      .eq('exhibitor_id', exhibitorId)
      .single();
    if (fetchError) throw fetchError;
    const currentViews = data?.views || 0;
    const { error } = await safeSupabase
      .from('mini_sites')
      .update({ 
        views: currentViews + 1,
        last_updated: new Date().toISOString()
      })
      .eq('exhibitor_id', exhibitorId);

    if (error) throw error;
  }

  // ==================== PRODUCTS ====================
  
  static async getProductsByExhibitor(exhibitorId: string): Promise<Product[]> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('products')
      .select('*')
      .eq('exhibitor_id', exhibitorId)
      .order('featured', { ascending: false })
      .order('name');
    if (error) throw error;
    return (data || []).map(this.mapProductFromDB);
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('products')
      .insert([{
        exhibitor_id: (productData as { exhibitorId?: string }).exhibitorId,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        images: productData.images || [],
        specifications: productData.specifications,
        price: productData.price,
        featured: productData.featured || false
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapProductFromDB(data);
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        category: updates.category,
        images: updates.images,
        specifications: updates.specifications,
        price: updates.price,
        featured: updates.featured
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapProductFromDB(data);
  }

  static async deleteProduct(id: string): Promise<void> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { error } = await safeSupabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  // ==================== APPOINTMENTS ====================
  
  static async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    if (!this.checkSupabaseConnection()) {
      return [];
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('appointments')
      .select(`
        *,
        exhibitor:exhibitors(*),
        visitor:users(*),
        time_slot:time_slots(*)
      `)
      .or(`visitor_id.eq.${userId},exhibitor_id.in.(select id from exhibitors where user_id = '${userId}')`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(this.mapAppointmentFromDB);
  }

  static async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    if (!this.checkSupabaseConnection()) {
      throw new Error('Supabase non configuré. Veuillez configurer vos variables d\'environnement Supabase.');
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('appointments')
      .insert([{
        exhibitor_id: appointmentData.exhibitorId,
        visitor_id: appointmentData.visitorId,
        time_slot_id: appointmentData.timeSlotId,
        message: appointmentData.message,
        meeting_type: appointmentData.meetingType || 'in-person'
      }])
      .select(`
        *,
        exhibitor:exhibitors(*),
        visitor:users(*),
        time_slot:time_slots(*)
      `)
      .single();
    if (error) throw error;
    return this.mapAppointmentFromDB(data);
  }

  static async updateAppointmentStatus(id: string, status: string): Promise<void> {
    if (!this.checkSupabaseConnection()) {
      return;
    }
    const safeSupabase = supabase!;
    const { error } = await safeSupabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  }

  // ==================== EVENTS ====================
  
  static async getEvents(): Promise<Event[]> {
    if (!this.checkSupabaseConnection()) {
      return [];
    }
    const safeSupabase = supabase!;
    const { data, error } = await safeSupabase
      .from('events')
      .select('*')
      .order('featured', { ascending: false })
      .order('event_date');
    if (error) throw error;
    return data.map(this.mapEventFromDB);
  }

  // TODO: Implémenter l'inscription à un événement
  // static async registerForEvent(eventId: string, userId: string): Promise<void> {
  //   if (!this.checkSupabaseConnection()) {
  //     return;
  //   }
  //   // Fonction à implémenter correctement
  //   return;
  // }

  static async incrementArticleViews(id: string): Promise<void> {
    if (!this.checkSupabaseConnection()) {
      return;
    }
    const safeSupabase = supabase!;
    // Incrémentation manuelle (lecture + update)
    const { data, error: fetchError } = await safeSupabase
      .from('news_articles')
      .select('views')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;
    const currentViews = data?.views || 0;
    const { error } = await safeSupabase
      .from('news_articles')
      .update({ views: currentViews + 1 })
      .eq('id', id);
    if (error) throw error;
  }

  // ==================== MAPPING FUNCTIONS ====================
  
  private static mapUserFromDB(data: UserDB): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      type: data.type,
      profile: data.profile as unknown as User['profile'],
      status: data.status || 'active',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private static mapExhibitorFromDB(data: ExhibitorDB): Exhibitor {
    return {
      id: data.id,
      userId: data.user_id,
      companyName: data.company_name,
      category: data.category as Exhibitor['category'],
      sector: data.sector,
      description: data.description,
      logo: data.logo_url,
      website: data.website,
      verified: data.verified,
      featured: data.featured,
      contactInfo: data.contact_info as unknown as Exhibitor['contactInfo'],
      products: data.products?.map(this.mapProductFromDB) || [],
      availability: [], // À implémenter avec time_slots
      miniSite: data.mini_site ? {
        id: data.mini_site.id as string,
        exhibitorId: data.mini_site.exhibitor_id as string,
        theme: data.mini_site.theme as string,
        customColors: data.mini_site.custom_colors as { primary: string; secondary: string; accent: string },
        sections: data.mini_site.sections as MiniSiteSection[],
        published: data.mini_site.published as boolean,
        views: data.mini_site.views as number,
        lastUpdated: new Date(data.mini_site.last_updated as string)
      } : {
        id: '',
        exhibitorId: data.id,
        theme: 'modern',
        customColors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
        sections: [],
        published: false,
        views: 0,
        lastUpdated: new Date()
      },
      certifications: [],
      establishedYear: undefined,
      employeeCount: undefined,
      revenue: undefined,
      markets: []
    };
  }

  private static mapProductFromDB(data: Record<string, unknown>): Product {
    return {
      id: data.id as string,
      name: data.name as string,
      description: data.description as string,
      category: data.category as string,
      images: (data.images as string[]) || [],
      specifications: data.specifications as string,
      price: data.price as number,
      featured: data.featured as boolean,
      technicalSpecs: []
    };
  }

  private static mapAppointmentFromDB(data: Record<string, unknown>): Appointment {
    return {
      id: data.id as string,
      exhibitorId: data.exhibitor_id as string,
      visitorId: data.visitor_id as string,
      timeSlotId: data.time_slot_id as string,
      status: data.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
      message: data.message as string,
      notes: data.notes as string,
      rating: data.rating as number,
      createdAt: new Date(data.created_at as string),
      meetingType: data.meeting_type as 'in-person' | 'virtual' | 'hybrid',
      meetingLink: data.meeting_link as string
    };
  }

  private static mapEventFromDB(data: Record<string, unknown>): Event {
    return {
      id: data.id as string,
      title: data.title as string,
      description: data.description as string,
      type: data.type as 'webinar' | 'roundtable' | 'networking' | 'workshop' | 'conference',
      date: new Date(data.event_date as string),
      startTime: data.start_time as string,
      endTime: data.end_time as string,
      capacity: data.capacity as number,
      registered: data.registered as number,
      speakers: [], // À implémenter avec une table speakers
      category: data.category as string,
      virtual: data.virtual as boolean,
      featured: data.featured as boolean,
      location: data.location as string,
      meetingLink: data.meeting_link as string,
      tags: (data.tags as string[]) || []
    };
  }


  private static mapMessageFromDB(data: Record<string, unknown>): ChatMessage {
    return {
      id: data.id as string,
      senderId: data.sender_id as string,
      receiverId: '', // À déterminer depuis la conversation
      content: data.content as string,
      type: data.type as 'text' | 'file' | 'system',
      timestamp: new Date(data.timestamp as string),
      read: data.read as boolean,
      attachments: (data.attachments as MessageAttachment[]) || []
    };
  }

  // ==================== ANALYTICS ====================
  
  static async getAnalytics(exhibitorId: string): Promise<AnalyticsData> {
    if (!this.checkSupabaseConnection()) {
      return {
        miniSiteViews: 0,
        appointments: 0,
        products: 0,
        profileViews: 0,
        connections: 0,
        messages: 0
      };
    }
    const safeSupabase = supabase!;
    // Récupérer les vues du mini-site
    const { data: miniSite } = await safeSupabase
      .from('mini_sites')
      .select('views')
      .eq('exhibitor_id', exhibitorId)
      .single();

    // Compter les rendez-vous
    const { count: appointmentsCount } = await safeSupabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('exhibitor_id', exhibitorId);

    // Compter les produits
    const { count: productsCount } = await safeSupabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('exhibitor_id', exhibitorId);

    return {
      miniSiteViews: miniSite?.views || 0,
      appointments: appointmentsCount || 0,
      products: productsCount || 0,
      profileViews: miniSite?.views || 0,
      connections: 0, // À implémenter
      messages: 0 // À implémenter
    };
  }

  // ==================== SEARCH ====================
  
  static async searchExhibitors(query: string, filters: SearchFilters = {}): Promise<Exhibitor[]> {
    if (!this.checkSupabaseConnection()) {
      return [];
    }
    const safeSupabase = supabase!;
    let queryBuilder = safeSupabase
      .from('exhibitors')
      .select(`
        *,
        user:users(*),
        products(*),
        mini_site:mini_sites(*)
      `)
      .eq('verified', true);

    if (query) {
      queryBuilder = queryBuilder.or(`company_name.ilike.%${query}%,description.ilike.%${query}%,sector.ilike.%${query}%`);
    }

    if (filters.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }

    if (filters.sector) {
      queryBuilder = queryBuilder.ilike('sector', `%${filters.sector}%`);
    }

    const { data, error } = await queryBuilder
      .order('featured', { ascending: false })
      .order('company_name');

    if (error) throw error;
    return data.map(this.mapExhibitorFromDB);
  }

  // ==================== REAL-TIME SUBSCRIPTIONS ====================
  
  static subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    if (!this.checkSupabaseConnection()) {
      return null;
    }
    const safeSupabase = supabase!;
    return safeSupabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, 
        (payload) => {
          callback(this.mapMessageFromDB(payload.new));
        }
      )
      .subscribe();
  }

  static subscribeToAppointments(userId: string, callback: (appointment: Appointment) => void) {
    if (!this.checkSupabaseConnection()) {
      return null;
    }
    const safeSupabase = supabase!;
    return safeSupabase
      .channel(`appointments:${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments'
        }, 
        (payload) => {
          if (payload.new) {
            callback(this.mapAppointmentFromDB(payload.new));
          }
        }
      )
      .subscribe();
  }
}