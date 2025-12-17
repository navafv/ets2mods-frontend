import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

// --- Mods ---

export const useMods = (filters = {}, page = 1) => {
  // Construct query params
  const params = new URLSearchParams();
  params.append('page', page);
  
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category); // Assuming backend uses 'category' query param for slug or ID
  if (filters.ordering) params.append('ordering', filters.ordering);

  return useQuery({
    queryKey: ['mods', filters, page],
    queryFn: async () => {
      const { data } = await api.get(`mods/items/?${params.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
};

export const useMod = (slug) => {
  return useQuery({
    queryKey: ['mod', slug],
    queryFn: async () => {
      const { data } = await api.get(`mods/items/${slug}/`);
      return data;
    },
    enabled: !!slug,
  });
};

export const useUploadMod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('mods/items/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mods']);
    },
  });
};

export const useUploadModImage = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('mods/images/', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
};

export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modId, ...data }) => {
      return api.post('mods/comments/', { mod: modId, ...data });
    },
    onSuccess: () => {
      // Invalidate specific mod to refresh comments
      queryClient.invalidateQueries(['mod']); 
    },
  });
};

// --- Categories ---

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('categories/');
      return data.results || data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// --- Contact ---

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('contact/', formData);
      return data;
    },
  });
};