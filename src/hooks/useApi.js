// src/hooks/useApi.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

// User-related queries
export const useUserProfile = (userId = null) => {
  return useQuery({
    queryKey: ['user', userId || 'me'],
    queryFn: async () => {
      const endpoint = userId ? `users/${userId}/` : 'users/me/';
      const { data } = await api.get(endpoint);
      return data;
    },
    enabled: !!userId || true, // Always enabled for 'me'
    staleTime: 5 * 60 * 1000,
  });
};

// Mods queries
export const useMods = (filters = {}, page = 1, pageSize = 20) => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    ...filters,
  }).toString();

  return useQuery({
    queryKey: ['mods', filters, page],
    queryFn: async () => {
      const { data } = await api.get(`mods/?${params}`);
      return data;
    },
    keepPreviousData: true, // Smooth pagination
  });
};

export const useMod = (modId) => {
  return useQuery({
    queryKey: ['mod', modId],
    queryFn: async () => {
      const { data } = await api.get(`mods/${modId}/`);
      return data;
    },
    enabled: !!modId,
    staleTime: 2 * 60 * 1000,
  });
};

// Categories queries
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('categories/');
      // Handle both array response and paginated response
      if (Array.isArray(data)) {
        return data;
      } else if (data && data.results) {
        return data.results;
      }
      return [];
    },
    staleTime: 30 * 60 * 1000,
  });
};

// Forums queries
export const useThreads = (categorySlug = null) => {
  return useQuery({
    queryKey: ['threads', categorySlug],
    queryFn: async () => {
      const url = categorySlug 
        ? `forums/threads/?category=${categorySlug}`
        : 'forums/threads/';
      const { data } = await api.get(url);
      return data;
    },
  });
};

// Mutations
export const useUploadMod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('mods/', formData);
      return data;
    },
    onSuccess: () => {
      // Invalidate mods queries
      queryClient.invalidateQueries(['mods']);
      // Also invalidate user's mods if needed
      queryClient.invalidateQueries(['user', 'me', 'mods']);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });
};

export const useDownloadMod = () => {
  return useMutation({
    mutationFn: async (modId) => {
      const response = await api.post(`mods/${modId}/track_download/`, {}, {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ modId, rating, content }) => {
      const { data } = await api.post('reviews/', {
        mod: modId,
        rating,
        content,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate mod reviews and mod data
      queryClient.invalidateQueries(['mod', variables.modId]);
      queryClient.invalidateQueries(['reviews', variables.modId]);
    },
  });
};