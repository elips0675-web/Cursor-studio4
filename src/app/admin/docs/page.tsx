
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Cpu, Layers, Sparkles, Zap, ShieldCheck, Target, Users, ShieldAlert, MessageSquare, Settings2, Rocket, TestTube } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function AdminDocsPage() {
  const { t, language } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">{t('admin.docs.title')}</h2>
        <p className="text-muted-foreground">{t('admin.docs.desc')}</p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        {/* About Project & Tech Stack */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm h-full flex flex-col">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Cpu size={20} />
              </div>
              <CardTitle className="text-xl font-bold">{t('admin.docs.about_title')}</CardTitle>
              <CardDescription>{language === 'RU' ? 'Технологический стек и архитектура' : 'Tech stack and architecture'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 flex-1">
              <div className="space-y-2">
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js 15</Badge>
                  <Badge variant="secondary">React 19</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">ShadCN UI</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-orange-200 text-orange-700">Firebase Auth</Badge>
                  <Badge variant="outline" className="border-orange-200 text-orange-700">Firestore</Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700">Genkit (AI)</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'RU' 
                  ? 'Приложение использует архитектуру Server Components для минимизации JS-бандла и Firebase для работы в реальном времени. Все AI функции работают через Google Gemini 2.5 Flash.'
                  : 'The app uses Server Components architecture to minimize JS bundle and Firebase for real-time capabilities. All AI features are powered by Google Gemini 2.5 Flash.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features List */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm h-full flex flex-col">
            <CardHeader className="bg-blue-500/5 rounded-t-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-2">
                <Layers size={20} />
              </div>
              <CardTitle className="text-xl font-bold">{t('admin.docs.features_title')}</CardTitle>
              <CardDescription>{language === 'RU' ? 'Реализованные возможности MVP' : 'Implemented MVP features'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <ul className="space-y-2.5">
                {[
                  { icon: <ShieldCheck size={14}/>, text: language === 'RU' ? 'Полноценная Auth система (Google/Email)' : 'Full Auth system (Google/Email)' },
                  { icon: <Sparkles size={14}/>, text: language === 'RU' ? 'AI-генерация био и айсбрейкеров' : 'AI Bio and Icebreaker generation' },
                  { icon: <Zap size={14}/>, text: language === 'RU' ? 'Система мэтчей с AI-анализом' : 'Match system with AI analysis' },
                  { icon: <Users size={14}/>, text: language === 'RU' ? 'Тематические группы и чаты' : 'Thematic groups and chats' },
                  { icon: <Zap size={14}/>, text: language === 'RU' ? 'Геймификация (задания, уровни)' : 'Gamification (tasks, levels)' },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-blue-500">{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* CI/CD & Testing */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm h-full flex flex-col">
            <CardHeader className="bg-purple-500/5 rounded-t-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-2">
                <Rocket size={20} />
              </div>
              <CardTitle className="text-xl font-bold">{language === 'RU' ? 'CI/CD и Тесты' : 'CI/CD & Tests'}</CardTitle>
              <CardDescription>{language === 'RU' ? 'Автоматизация и качество' : 'Automation and quality'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <TestTube size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold">{language === 'RU' ? 'Unit и UI тесты' : 'Unit & UI Tests'}</h5>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Jest + React Testing Library для проверки логики и интерфейса.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold">{language === 'RU' ? 'GitHub Actions CI' : 'GitHub Actions CI'}</h5>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Автоматическая проверка кода при каждом пуше в репозиторий.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <Zap size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold">{language === 'RU' ? 'Firebase App Hosting' : 'Firebase App Hosting'}</h5>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Автоматический деплой стабильных версий в облако Google.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety & Moderation */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm h-full flex flex-col">
            <CardHeader className="bg-green-500/5 rounded-t-lg">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                <ShieldAlert size={20} />
              </div>
              <CardTitle className="text-xl font-bold">{language === 'RU' ? 'Безопасность' : 'Safety'}</CardTitle>
              <CardDescription>{language === 'RU' ? 'Антимат и система жалоб' : 'Anti-profanity and Reporting'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 flex-1">
              <div className="space-y-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <MessageSquare size={12} /> {language === 'RU' ? 'Фильтр сообщений' : 'Message Filter'}
                </h5>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {language === 'RU' 
                    ? 'Внедрена автоматическая проверка сообщений на наличие нецензурной лексики, спама, политических тем и ссылок. Система блокирует отправку вредоносного контента в реальном времени.'
                    : 'Automatic checking of messages for profanity, spam, political topics, and links is implemented. The system blocks malicious content in real-time.'}
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <ShieldAlert size={12} /> {language === 'RU' ? 'Жалобы' : 'Reporting'}
                </h5>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {language === 'RU' 
                    ? 'Пользователи могут пожаловаться на профиль или чат. Все жалобы мгновенно поступают в раздел «Жалобы» панели администратора для принятия мер.'
                    : 'Users can report profiles or chats. All reports instantly appear in the "Reports" section of the admin panel for action.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Capabilities */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm h-full flex flex-col">
            <CardHeader className="bg-amber-500/5 rounded-t-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-2">
                <Settings2 size={20} />
              </div>
              <CardTitle className="text-xl font-bold">{language === 'RU' ? 'Управление' : 'Management'}</CardTitle>
              <CardDescription>{language === 'RU' ? 'Возможности администратора' : 'Admin capabilities'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span>{language === 'RU' ? 'Feature Flags: Включение/выключение функций (видеозвонки, AI) без деплоя.' : 'Feature Flags: Toggle features (video calls, AI) without redeploying.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span>{language === 'RU' ? 'Рассылки: Массовая отправка уведомлений пользователям (In-app и Email).' : 'Broadcasts: Mass notification delivery (In-app and Email).'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span>{language === 'RU' ? 'Контент: Управление глобальными списками интересов и целей.' : 'Content: Managing global lists of interests and goals.'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Autosearch Logic */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-orange-500/5 rounded-t-lg">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-2">
                <Target size={20} />
              </div>
              <CardTitle className="text-xl font-bold">{t('admin.docs.logic_title')}</CardTitle>
              <CardDescription>{language === 'RU' ? 'Как работает умный подбор' : 'How smart matching works'}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2 p-4 rounded-2xl bg-muted/30">
                  <h5 className="font-black text-[10px] uppercase tracking-widest text-primary">Этап 1: Фильтр</h5>
                  <p className="text-xs leading-relaxed">
                    {language === 'RU' 
                      ? 'Жесткая фильтрация по полу, возрасту и городу. Отсекаем всех, кто не проходит по базовым критериям.' 
                      : 'Strict filtering by gender, age, and city. Removing everyone who doesn\'t meet basic criteria.'}
                  </p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-muted/30 border-2 border-primary/10">
                  <h5 className="font-black text-[10px] uppercase tracking-widest text-primary">Этап 2: Скоринг</h5>
                  <p className="text-xs leading-relaxed">
                    {language === 'RU' 
                      ? '+1000 баллов за совпадение целей, +100 баллов за каждый общий интерес. Ранжируем список.' 
                      : '+1000 points for matching goals, +100 points for each shared interest. Ranking the list.'}
                  </p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-muted/30">
                  <h5 className="font-black text-[10px] uppercase tracking-widest text-primary">Результат</h5>
                  <p className="text-xs leading-relaxed">
                    {language === 'RU' 
                      ? 'Пользователь видит сначала самых релевантных кандидатов, отобранных алгоритмом.' 
                      : 'User sees the most relevant candidates selected by the algorithm first.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
