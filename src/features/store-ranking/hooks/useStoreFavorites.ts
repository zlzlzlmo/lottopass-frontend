import { useState, useEffect } from 'react';
import { message } from 'antd';

const FAVORITES_KEY = 'lottopass_favorite_stores';

export const useStoreFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (storeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(storeId)) {
        newFavorites.delete(storeId);
        message.info('즐겨찾기에서 제거되었습니다');
      } else {
        newFavorites.add(storeId);
        message.success('즐겨찾기에 추가되었습니다');
      }
      return newFavorites;
    });
  };

  const isFavorite = (storeId: string) => favorites.has(storeId);

  const getFavoriteCount = () => favorites.size;

  const clearFavorites = () => {
    setFavorites(new Set());
    localStorage.removeItem(FAVORITES_KEY);
    message.info('모든 즐겨찾기가 삭제되었습니다');
  };

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    clearFavorites,
  };
};