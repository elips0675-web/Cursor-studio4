
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'RU' | 'EN';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  RU: {
    // Bottom Nav
    'nav.home': 'Главная',
    'nav.swipes': 'Свайпы',
    'nav.activity': 'Активность',
    'nav.chats': 'Чаты',
    'nav.profile': 'Профиль',
    // Profile
    'profile.edit': 'Изменить',
    'profile.about': 'О себе',
    'profile.lifestyle': 'Стиль жизни',
    'profile.interests': 'Интересы',
    'profile.gallery': 'Галерея',
    'profile.add': 'Добавить',
    'profile.likes': 'Лайков',
    'profile.matches': 'Мэтчей',
    'profile.city': 'Москва',
    'profile.goal': 'Цель',
    'profile.goal_value': 'Серьезные отношения',
    'profile.height': 'Рост',
    'profile.pro': 'PRO 💎',
    // Edit Profile
    'edit.title': 'Изменить профиль',
    'edit.main_data': 'Основные данные',
    'edit.name': 'Имя',
    'edit.age': 'Возраст',
    'edit.save': 'Сохранить',
    'edit.ai_improve': 'AI Улучшить',
  },
  EN: {
    // Bottom Nav
    'nav.home': 'Home',
    'nav.swipes': 'Swipes',
    'nav.activity': 'Activity',
    'nav.chats': 'Chats',
    'nav.profile': 'Profile',
    // Profile
    'profile.edit': 'Edit',
    'profile.about': 'About Me',
    'profile.lifestyle': 'Lifestyle',
    'profile.interests': 'Interests',
    'profile.gallery': 'Gallery',
    'profile.add': 'Add',
    'profile.likes': 'Likes',
    'profile.matches': 'Matches',
    'profile.city': 'Moscow',
    'profile.goal': 'Goal',
    'profile.goal_value': 'Serious relationship',
    'profile.height': 'Height',
    'profile.pro': 'PRO 💎',
    // Edit Profile
    'edit.title': 'Edit Profile',
    'edit.main_data': 'Main Info',
    'edit.name': 'Name',
    'edit.age': 'Age',
    'edit.save': 'Save Changes',
    'edit.ai_improve': 'AI Improve',
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('RU');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['RU']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
