
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useIdleTimer } from '@/hooks/use-idle-timer';
import { toast } from '@/hooks/use-toast';

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
    // Common Buttons
    'button.continue': 'Продолжить',
    'button.skip': 'Пропустить',
    'button.save': 'Сохранить',
    'button.back': 'Назад',
    'button.like': 'Лайк',
    'button.message': 'Сообщение',
    'button.send': 'Отправить',
    'button.search': 'Поиск',
    'button.filters': 'Фильтры',
    'button.autosearch': 'Автопоиск',
    'button.load_more': 'Показать еще',
    'button.start': 'Начать знакомства',
    'button.write_first': 'Написать первым',
    'button.close': 'Закрыть',
    'button.unlock': 'Разблокировать бесплатно',
    'button.watch': 'Смотреть',
    'button.not_now': 'Не сейчас',
    'button.report': 'Пожаловаться',
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
    'profile.someone': 'Кто-то',
    // Activity
    'activity.title': 'События',
    'activity.likes': 'Лайки',
    'activity.visits': 'Визиты',
    'activity.all': 'Все',
    'activity.new': 'новых',
    'activity.empty': 'Ничего не найдено',
    'activity.today_activity': 'Ваша активность сегодня',
    'activity.msg_like': 'поставила вам лайк',
    'activity.msg_visit': 'посетила ваш профиль',
    'activity.msg_match': 'новое совпадение с вами!',
    'activity.unlock_title': 'Бонус',
    'activity.unlock_desc': 'Посмотрите рекламу, чтобы открыть анкету бесплатно на 24 часа.',
    'activity.premium_title': 'Premium Доступ',
    'activity.premium_desc': 'Узнайте, кому вы понравились, и получите безлимитные лайки!',
    // Chats
    'chats.title': 'Сообщения',
    'chats.subtitle': 'Твои диалоги',
    'chats.search': 'Поиск по чатам...',
    'chats.online': 'В сети',
    'chats.offline': 'Был(а) недавно',
    'chats.today': 'Сегодня',
    'chats.typing': 'печатает...',
    'chats.ai_themes': 'Темы ответов AI',
    'chats.close_themes': 'Закрыть темы',
    'chats.placeholder': 'Ваше сообщение...',
    // Home / Search
    'home.popular': 'Популярное сейчас',
    'home.headline': 'Твой идеальный мэтч ждет тебя',
    'home.subheadline': 'Знакомься, общайся и находи любовь',
    'home.top_week': 'Топ недели',
    'home.recommend': 'Рекомендуем',
    'home.nearby': 'Рядом',
    'home.searching': 'Ищем лучших для вас...',
    'home.results': 'Результаты',
    'home.no_results': 'По вашим параметрам пока никого нет.',
    'match.title': 'Это совпадение!',
    'match.desc': 'Вы понравились друг другу. Не заставляйте ждать!',
    'match.insight': 'AI Инсайт',
    'swipes.nearby': 'анкет рядом',
    'match.insight_default': 'Вы отлично подходите друг другу!',
    // Onboarding
    'onboarding.step1.title': 'Как тебя зовут?',
    'onboarding.step1.desc': 'Имя будет отображаться в твоем профиле.',
    'onboarding.step1.label': 'Имя',
    'onboarding.step1.placeholder': 'Твое имя',
    'onboarding.step1.gender_label': 'Твой пол',
    'onboarding.step1.male': 'Мужчина',
    'onboarding.step1.female': 'Женщина',
    'onboarding.step2.title': 'Немного деталей',
    'onboarding.step2.desc': 'Это поможет нам найти людей поблизости.',
    'onboarding.step2.age': 'Возраст',
    'onboarding.step2.height': 'Рост (см)',
    'onboarding.step2.city': 'Город (опционально)',
    'onboarding.step2.city_placeholder': 'Где ты находишься?',
    'onboarding.step3.title': 'Личное',
    'onboarding.step3.desc': 'Расскажи о своих целях и знаке зодиака.',
    'onboarding.step3.goal_label': 'Цель знакомства',
    'onboarding.step3.goal_placeholder': 'Выберите цель',
    'onboarding.step3.zodiac_label': 'Знак зодиака',
    'onboarding.step3.zodiac_placeholder': 'Выберите знак',
    'onboarding.step4.title': 'Твои интересы',
    'onboarding.step4.desc': 'Выбери минимум 1, чтобы AI составил крутое био.',
    'onboarding.step5.title': 'Почти готово!',
    'onboarding.step5.desc': 'Добавь яркое фото и расскажи о себе или позволь AI помочь.',
    'onboarding.step5.photo_label': 'Выбрать фото',
    'onboarding.step5.bio_label': 'О себе',
    'onboarding.step5.bio_placeholder': 'Расскажи о своих увлечениях...',
    'onboarding.toast.photo_added': 'Фото добавлено!',
    'onboarding.toast.photo_desc': 'Ваш профиль теперь выглядит отлично.',
    'onboarding.toast.bio_ai': 'Био создано AI',
    'onboarding.toast.finish_title': 'Профиль готов!',
    'onboarding.toast.finish_desc': 'Добро пожаловать в SwiftMatch.',
    'onboarding.loc.detecting': 'Определяем местоположение...',
    'onboarding.loc.success': 'Город определен: ',
    'onboarding.loc.fail': 'Не удалось определить город',
    'onboarding.loc.denied': 'Доступ к геолокации отклонен',
    // Report
    'report.title': 'Жалоба на пользователя',
    'report.description': 'Ваша жалоба анонимна. Выберите причину, и мы рассмотрим ситуацию.',
    'report.reason.spam': 'Спам',
    'report.reason.abuse': 'Оскорбительное поведение',
    'report.reason.fake': 'Фейковый профиль',
    'report.reason.scam': 'Мошенничество',
    'report.reason.content': 'Неприемлемый контент',
    'report.details_placeholder': 'Дополнительные детали (необязательно)',
    'report.button.send': 'Отправить жалобу',
    'report.button.cancel': 'Отмена',
    'report.toast.success_title': 'Жалоба отправлена',
    'report.toast.success_desc': 'Спасибо! Мы рассмотрим вашу жалобу на',
    'report.toast.no_reason_title': 'Выберите причину',
    'report.toast.no_reason_desc': 'Необходимо указать причину для отправки жалобы.',
    // Settings
    'settings.account': 'Аккаунт',
    'settings.notifications': 'Уведомления',
    'settings.location': 'Геолокация',
    'settings.discovery': 'Показывать меня',
    'settings.privacy': 'Приватность',
    'settings.incognito': 'Инкогнито',
    'settings.security': 'Безопасность',
    'settings.security.status': 'OK',
    'settings.support': 'Поддержка',
    'settings.support.chat_title': 'Написать в поддержку',
    'settings.support.chat_desc': 'Чат с нашей командой',
    'logout.title': 'Вы вышли из системы',
    'logout.button': 'Выйти',
    'delete_profile.button': 'Удалить профиль',
    // Support Chat
    'support.title': 'Служба поддержки',
    'support.placeholder': 'Напишите ваше сообщение...',
    'support.greeting': 'Здравствуйте! Чем мы можем вам помочь?',
    'support.response': 'Спасибо за ваше сообщение! Наш специалист скоро с вами свяжется.',
  },
  EN: {
    // Bottom Nav
    'nav.home': 'Home',
    'nav.swipes': 'Swipes',
    'nav.activity': 'Activity',
    'nav.chats': 'Chats',
    'nav.profile': 'Profile',
    // Common Buttons
    'button.continue': 'Continue',
    'button.skip': 'Skip',
    'button.save': 'Save',
    'button.back': 'Back',
    'button.like': 'Like',
    'button.message': 'Message',
    'button.send': 'Send',
    'button.search': 'Search',
    'button.filters': 'Filters',
    'button.autosearch': 'Auto-search',
    'button.load_more': 'Load more',
    'button.start': 'Start dating',
    'button.write_first': 'Write first',
    'button.close': 'Close',
    'button.unlock': 'Unlock for free',
    'button.watch': 'Watch',
    'button.not_now': 'Not now',
    'button.report': 'Report',
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
    'profile.someone': 'Someone',
    // Activity
    'activity.title': 'Activity',
    'activity.likes': 'Likes',
    'activity.visits': 'Visits',
    'activity.all': 'All',
    'activity.new': 'new',
    'activity.empty': 'Nothing found',
    'activity.today_activity': 'Your activity today',
    'activity.msg_like': 'liked you',
    'activity.msg_visit': 'visited your profile',
    'activity.msg_match': 'new match with you!',
    'activity.unlock_title': 'Bonus',
    'activity.unlock_desc': 'Watch an ad to unlock the profile for free for 24 hours.',
    'activity.premium_title': 'Premium Access',
    'activity.premium_desc': 'Find out who liked you and get unlimited likes!',
    // Chats
    'chats.title': 'Messages',
    'chats.subtitle': 'Your dialogs',
    'chats.search': 'Search chats...',
    'chats.online': 'Online',
    'chats.offline': 'Was recently',
    'chats.today': 'Today',
    'chats.typing': 'typing...',
    'chats.ai_themes': 'AI Reply Themes',
    'chats.close_themes': 'Close themes',
    'chats.placeholder': 'Your message...',
    // Home / Search
    'home.popular': 'Popular now',
    'home.headline': 'Your ideal match is waiting',
    'home.subheadline': 'Meet, chat and find love',
    'home.top_week': 'Top of the week',
    'home.recommend': 'Recommended',
    'home.nearby': 'Nearby',
    'home.searching': 'Searching for the best...',
    'home.results': 'Results',
    'home.no_results': 'No one found with these parameters.',
    'match.title': 'It\'s a Match!',
    'match.desc': 'You liked each other. Don\'t keep them waiting!',
    'match.insight': 'AI Insight',
    'swipes.nearby': 'profiles nearby',
    'match.insight_default': 'You are a great match!',
    // Onboarding
    'onboarding.step1.title': "What's your name?",
    'onboarding.step1.desc': 'Name will be displayed in your profile.',
    'onboarding.step1.label': 'Name',
    'onboarding.step1.placeholder': 'Your name',
    'onboarding.step1.gender_label': 'Your gender',
    'onboarding.step1.male': 'Male',
    'onboarding.step1.female': 'Female',
    'onboarding.step2.title': 'A few details',
    'onboarding.step2.desc': 'This helps us find people nearby.',
    'onboarding.step2.age': 'Age',
    'onboarding.step2.height': 'Height (cm)',
    'onboarding.step2.city': 'City (optional)',
    'onboarding.step2.city_placeholder': 'Where are you located?',
    'onboarding.step3.title': 'Personal',
    'onboarding.step3.desc': 'Tell us about your goals and zodiac sign.',
    'onboarding.step3.goal_label': 'Dating goal',
    'onboarding.step3.goal_placeholder': 'Select goal',
    'onboarding.step3.zodiac_label': 'Zodiac sign',
    'onboarding.step3.zodiac_placeholder': 'Select sign',
    'onboarding.step4.title': 'Your interests',
    'onboarding.step4.desc': 'Select at least 1 so AI can draft a cool bio.',
    'onboarding.step5.title': 'Almost ready!',
    'onboarding.step5.desc': 'Add a bright photo and tell us about yourself or let AI help.',
    'onboarding.step5.photo_label': 'Select photo',
    'onboarding.step5.bio_label': 'About me',
    'onboarding.step5.bio_placeholder': 'Tell us about your hobbies...',
    'onboarding.toast.photo_added': 'Photo added!',
    'onboarding.toast.photo_desc': 'Your profile looks great now.',
    'onboarding.toast.bio_ai': 'Bio created by AI',
    'onboarding.toast.finish_title': 'Profile is ready!',
    'onboarding.toast.finish_desc': 'Welcome to SwiftMatch.',
    'onboarding.loc.detecting': 'Determining location...',
    'onboarding.loc.success': 'City determined: ',
    'onboarding.loc.fail': 'Could not determine city accurately',
    'onboarding.loc.denied': 'Geolocation access denied',
    // Report
    'report.title': 'Report User',
    'report.description': 'Your report is anonymous. Please select a reason, and we will review the situation.',
    'report.reason.spam': 'Spam',
    'report.reason.abuse': 'Abusive behavior',
    'report.reason.fake': 'Fake profile',
    'report.reason.scam': 'Scam',
    'report.reason.content': 'Inappropriate content',
    'report.details_placeholder': 'Additional details (optional)',
    'report.button.send': 'Send Report',
    'report.button.cancel': 'Cancel',
    'report.toast.success_title': 'Report sent',
    'report.toast.success_desc': 'Thank you! We will review your report on',
    'report.toast.no_reason_title': 'Select a reason',
    'report.toast.no_reason_desc': 'A reason is required to send a report.',
    // Settings
    'settings.account': 'Account',
    'settings.notifications': 'Notifications',
    'settings.location': 'Geolocation',
    'settings.discovery': 'Show me',
    'settings.privacy': 'Privacy',
    'settings.incognito': 'Incognito',
    'settings.security': 'Security',
    'settings.security.status': 'OK',
    'settings.support': 'Support',
    'settings.support.chat_title': 'Contact Support',
    'settings.support.chat_desc': 'Chat with our team',
    'logout.title': 'You have been logged out',
    'logout.button': 'Logout',
    'delete_profile.button': 'Delete Profile',
    // Support Chat
    'support.title': 'Support',
    'support.placeholder': 'Write your message...',
    'support.greeting': 'Hello! How can we help you?',
    'support.response': 'Thank you for your message! Our specialist will contact you soon.',
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('RU');
  const router = useRouter();
  const pathname = usePathname();

  const handleIdle = useCallback(() => {
    // Don't log out if on a public page like login/onboarding
    if (pathname === '/login' || pathname === '/onboarding') return;

    toast({
      title: language === 'RU' ? 'Сессия истекла' : 'Session Expired',
      description: language === 'RU' ? 'Вы были неактивны в течение 30 минут.' : 'You have been inactive for 30 minutes.',
    });
    router.push('/login');
  }, [router, language, pathname]);

  // 30 minutes in milliseconds
  const IDLE_TIMEOUT = 30 * 60 * 1000;
  useIdleTimer(handleIdle, IDLE_TIMEOUT);


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
