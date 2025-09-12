import { create } from 'zustand';

// Mock data for news articles
const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'SIPORTS 2025 : Lancement Officiel du Salon International des Ports',
    excerpt: 'Le plus grand événement portuaire de l\'année ouvre ses portes avec plus de 500 exposants internationaux.',
    content: 'Le Salon International des Ports (SIPORTS) 2025 a officiellement ouvert ses portes aujourd\'hui avec une participation record...',
    author: 'Équipe SIPORTS',
    publishedAt: new Date('2025-01-15'),
    category: 'Événements',
    tags: ['salon', 'ouverture', 'exposants'],
    featured: true,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    readTime: 3,
    source: 'siports',
    views: 1250
  },
  {
    id: '2',
    title: 'Innovation Technologique dans les Ports Modernes',
    excerpt: 'Découvrez les dernières avancées technologiques présentées par les leaders de l\'industrie portuaire.',
    content: 'Les technologies de l\'information et de la communication transforment l\'industrie portuaire...',
    author: 'Marie Dubois',
    publishedAt: new Date('2025-01-10'),
    category: 'Innovation',
    tags: ['technologie', 'innovation', 'numérique'],
    featured: false,
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
    readTime: 5,
    source: 'siports',
    views: 890
  }
];

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  featured: boolean;
  image?: string;
  readTime: number;
  source: 'siports' | 'external';
  sourceUrl?: string;
  views: number;
}

interface NewsState {
  articles: NewsArticle[];
  featuredArticles: NewsArticle[];
  categories: string[];
  isLoading: boolean;
  selectedCategory: string;
  searchTerm: string;
  
  // Actions
  fetchNews: () => Promise<void>;
  fetchFromOfficialSite: () => Promise<void>;
  getArticleById: (id: string) => NewsArticle | null;
  setCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  getFilteredArticles: () => NewsArticle[];
  createNewsArticle: (articleData: Partial<NewsArticle>) => Promise<void>;
  updateNewsArticle: (id: string, updates: Partial<NewsArticle>) => Promise<void>;
  deleteNewsArticle: (id: string) => Promise<void>;
}


export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  featuredArticles: [],
  categories: [],
  isLoading: false,
  selectedCategory: '',
  searchTerm: '',

  fetchNews: async () => {
    set({ isLoading: true });
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const articles = mockNewsArticles;
      const featuredArticles = articles.filter((article: NewsArticle) => article.featured);
      const categories = [...new Set(articles.map((article: NewsArticle) => article.category))];
      
      set({ 
        articles,
        featuredArticles,
        categories,
        isLoading: false 
      });
    } catch (_error) {
      console.error('Erreur chargement articles:', _error);
      set({ isLoading: false });
    }
  },

  fetchFromOfficialSite: async () => {
    set({ isLoading: true });
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const articles = mockNewsArticles;
      const featuredArticles = articles.filter((article: NewsArticle) => article.featured);
      const categories = [...new Set(articles.map((article: NewsArticle) => article.category))];
      
      set({ 
        articles,
        featuredArticles,
        categories,
        isLoading: false 
      });
    } catch (_error) {
      console.error('Erreur synchronisation articles:', _error);
      set({ isLoading: false });
    }
  },

  setCategory: (category) => {
    set({ selectedCategory: category });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  getFilteredArticles: () => {
    const { articles, selectedCategory, searchTerm } = get();
    
    return articles.filter(article => {
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  },

  getArticleById: (id: string) => {
    const { articles } = get();
    return articles.find(article => article.id === id) || null;
  },

  createNewsArticle: async (articleData: Partial<NewsArticle>) => {
    set({ isLoading: true });
    
    try {
      // Simulation de création
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newArticle: NewsArticle = {
        id: Date.now().toString(),
        title: articleData.title || 'Sans titre',
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        author: articleData.author || 'Anonyme',
        publishedAt: new Date(),
        category: articleData.category || 'Général',
        tags: articleData.tags || [],
        featured: articleData.featured || false,
        image: articleData.image,
        readTime: articleData.readTime || 1,
        source: 'siports',
        views: 0
      };
      
      const { articles } = get();
      const updatedArticles = [newArticle, ...articles];
      const featuredArticles = updatedArticles.filter((article: NewsArticle) => article.featured);
      const categories = [...new Set(updatedArticles.map((article: NewsArticle) => article.category))];
      
      set({ 
        articles: updatedArticles,
        featuredArticles,
        categories,
        isLoading: false 
      });
    } catch (_error) {
      console.error('Erreur création article:', _error);
      set({ isLoading: false });
      throw _error;
    }
  },

  updateNewsArticle: async (id: string, updates: Partial<NewsArticle>) => {
    try {
      // Simulation de mise à jour
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { articles } = get();
      const updatedArticle = articles.find(article => article.id === id);
      if (!updatedArticle) throw new Error('Article non trouvé');
      
      const finalArticle = { ...updatedArticle, ...updates };
      const updatedArticles = articles.map(article => 
        article.id === id ? finalArticle : article
      );
      const featuredArticles = updatedArticles.filter((article: NewsArticle) => article.featured);
      
      set({ 
        articles: updatedArticles,
        featuredArticles
      });
    } catch (_error) {
      console.error('Erreur mise à jour article:', _error);
      throw _error;
    }
  },

  deleteNewsArticle: async (id: string) => {
    try {
      // Simulation de suppression
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const { articles } = get();
      const updatedArticles = articles.filter(article => article.id !== id);
      const featuredArticles = updatedArticles.filter((article: NewsArticle) => article.featured);
      
      set({ 
        articles: updatedArticles,
        featuredArticles
      });
    } catch (_error) {
      console.error('Erreur suppression article:', _error);
      throw _error;
    }
  }
}));