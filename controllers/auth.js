import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('accessToken');
    if (user && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      fetchProfileImage(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfileImage = async (userId) => {
    try {
      const response = await axios.get(`https://talent2show.onrender.com/api/userPhotos/${userId}`);
      if (response.data.profile_image) {
        const updatedUser = {
          ...currentUser,
          profileImage: response.data.profile_image,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar a imagem de perfil:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('https://talent2show.onrender.com/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      await fetchProfileImage(user.id);
    } catch (error) {
      console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
