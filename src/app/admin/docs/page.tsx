
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, Cpu, Layers, Sparkles, Zap, ShieldCheck, Target, Users, ShieldAlert, 
  MessageSquare, Settings2, Rocket, TestTube, CheckCircle2, Trophy, Camera, 
  Flame, Mail, DollarSign, Heart, Gift, Info
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminDocsPage() {
  const { t, language } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      <header className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <BookOpen className="text-primary" size={32} />
          {t('admin.docs.title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Полное техническое и функциональное описание платформы SwiftMatch для администраторов и разработчиков.
        </p>
      </header>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl mb-8">
          <TabsTrigger value="architecture" className="rounded-lg py-2.5 font-bold text-xs uppercase tracking-tight">Архитектура</TabsTrigger>
          <TabsTrigger value="features" className="rounded-lg py-2.5 font-bold text-xs uppercase tracking-tight">Функционал</TabsTrigger>
          <TabsTrigger value="logic" className="rounded-lg py-2.5 font-bold text-xs uppercase tracking-tight">Алгоритмы</TabsTrigger>
          <TabsTrigger value="admin" className="rounded-lg py-2.5 font-bold text-xs uppercase tracking-tight">Управление</TabsTrigger>
          <TabsTrigger value="security" className="hidden lg:flex rounded-lg py-2.5 font-bold text-xs uppercase tracking-tight">Безопасность</TabsTrigger>
        </TabsList>

        {/* ARCHITECTURE TAB */}
        <TabsContent value="architecture">
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Cpu size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold">{t('admin.docs.about_title')}</CardTitle>
                  <CardDescription>Технологический стек проекта</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Frontend (Next.js 15)</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Использование <b>React 19</b> и <b>Server Components</b> позволяет минимизировать объем JavaScript на клиенте, обеспечивая мгновенную загрузку даже на слабых устройствах.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Backend & DB (Firebase)</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      <b>Firestore</b> обеспечивает синхронизацию данных в реальном времени (Real-time чаты, уведомления). <b>Firebase Auth</b> управляет безопасным входом через Google и Email.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Engine (Genkit)</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Все интеллектуальные функции реализованы через <b>Google Genkit</b> с использованием моделей Gemini 2.5 Flash / DeepSeek.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="bg-purple-500/5 rounded-t-lg">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-2">
                    <Rocket size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold">CI/CD и Тесты</CardTitle>
                  <CardDescription>Автоматизация разработки</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <TestTube className="text-purple-500 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Unit-тестирование (Jest)</p>
                        <p className="text-[10px] text-muted-foreground">Покрывает критическую бизнес-логику (расчет званий, фильтры сообщений).</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="text-purple-500 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <p className="text-xs font-bold">GitHub Actions</p>
                        <p className="text-[10px] text-muted-foreground">Автоматическая проверка кода (Lint, Typecheck, Test) при каждом Push.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Zap className="text-purple-500 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Firebase App Hosting</p>
                        <p className="text-[10px] text-muted-foreground">Автоматический деплой стабильных версий в облачную инфраструктуру Google.</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* FEATURES TAB */}
        <TabsContent value="features">
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 mb-2">
                    <Heart size={20} />
                  </div>
                  <CardTitle className="text-lg">Чаты и AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p><b>Real-time сообщения:</b> Мгновенная доставка через Firestore snapshots.</p>
                  <p><b>AI Icebreakers:</b> Генерация персонализированных фраз для начала диалога на основе 6 настроений (Романтика, Юмор, Глубокое и др.).</p>
                  <p><b>Индикация:</b> Статусы "в сети", "печатает", подтверждение прочтения.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-2">
                    <Users size={20} />
                  </div>
                  <CardTitle className="text-lg">Группы (Сообщества)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p><b>20+ категорий:</b> Музыка, Спорт, IT, Путешествия и др.</p>
                  <p><b>Групповые чаты:</b> Возможность общения со всеми участниками категории.</p>
                  <p><b>Cooldown:</b> Система анти-спама ограничивает частоту сообщений (5 сек) для стабильности чата.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-2">
                    <Trophy size={20} />
                  </div>
                  <CardTitle className="text-lg">Фотоконкурс</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p><b>Механика:</b> Ежемесячное голосование пользователей за лучшие анкеты.</p>
                  <p><b>Пьедестал:</b> Визуальное выделение топ-3 участников с анимациями.</p>
                  <p><b>Геймификация:</b> Задание "Проголосуй за 5 человек" для получения бонусов.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                    <Flame size={20} />
                  </div>
                  <CardTitle className="text-lg">Квесты и Звания</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p><b>Daily Quests:</b> Список ежедневных задач для повышения вовлеченности.</p>
                  <p><b>Титулы:</b> Автоматическое присвоение званий ("Король свиданий", "Душа компании") на основе активности профиля.</p>
                  <p><b>Daily Rewards:</b> Календарь наград за ежедневный вход.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-2">
                    <Sparkles size={20} />
                  </div>
                  <CardTitle className="text-lg">AI Возможности</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p><b>AI Bio:</b> Генерация привлекательного описания профиля по ключевым словам пользователя.</p>
                  <p><b>Compatibility Insight:</b> Глубокий анализ совместимости пары при мэтче с выделением общих интересов.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 mb-2">
                    <Video size={20} />
                  </div>
                  <CardTitle className="text-lg">Видеозвонки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p><b>WebRTC Ready:</b> Полноценный интерфейс видеозвонка с доступом к камере.</p>
                  <p><b>Управление:</b> Возможность отключения микрофона/видео, полноэкранный режим.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* LOGIC TAB */}
        <TabsContent value="logic">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-orange-500/5 border-b border-orange-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <Target size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{t('admin.docs.logic_title')}</CardTitle>
                    <CardDescription>Многоуровневый алгоритм ранжирования анкет</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3 p-5 rounded-3xl bg-muted/30 border border-border/50 relative">
                    <Badge className="absolute -top-2 left-4 bg-orange-500 text-white border-0">Этап 1</Badge>
                    <h5 className="font-black text-[10px] uppercase tracking-widest text-primary">Жесткий фильтр</h5>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#2ecc71]"/> Пол и предпочтения</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#2ecc71]"/> Возраст (+/- 5 лет)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#2ecc71]"/> Город / Геолокация</li>
                    </ul>
                  </div>

                  <div className="space-y-3 p-5 rounded-3xl bg-white border-2 border-orange-500/20 shadow-xl shadow-orange-500/5 relative">
                    <Badge className="absolute -top-2 left-4 bg-orange-500 text-white border-0">Этап 2</Badge>
                    <h5 className="font-black text-[10px] uppercase tracking-widest text-primary">Умный скоринг</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span>Совпадение цели</span>
                        <span className="text-orange-600">+1000 pts</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span>Общий интерес</span>
                        <span className="text-orange-600">+100 pts / шт</span>
                      </div>
                    </div>
                    <p className="text-[10px] leading-relaxed text-muted-foreground pt-2">
                      Алгоритм суммирует очки и ранжирует список. Те, кто больше всего подходит, оказываются вверху.
                    </p>
                  </div>

                  <div className="space-y-3 p-5 rounded-3xl bg-muted/30 border border-border/50 relative">
                    <Badge className="absolute -top-2 left-4 bg-orange-500 text-white border-0">Этап 3</Badge>
                    <h5 className="font-black text-[10px] uppercase tracking-widest text-primary">Правило пересечения</h5>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      В выдачу попадают только те, у кого есть <b>хотя бы одно</b> совпадение (по цели ИЛИ интересам).
                    </p>
                    <div className="flex items-center gap-1.5 text-orange-600 font-bold text-[9px] uppercase tracking-tighter mt-2">
                      <Sparkles size={12} /> Чистая лента без шума
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ADMIN TAB */}
        <TabsContent value="admin">
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <Settings2 size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold">Панель управления</CardTitle>
                  <CardDescription className="text-slate-400">Инструменты модератора</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid gap-4">
                    <div className="flex gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-slate-100"><Users size={14} /></div>
                      <div>
                        <p className="text-xs font-bold">Управление пользователями</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Просмотр, редактирование данных, блокировка и удаление аккаунтов.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-slate-100"><SlidersHorizontal size={14} /></div>
                      <div>
                        <p className="text-xs font-bold">Feature Flags</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Включение/выключение функций (видеозвонки, ИИ) в реальном времени без деплоя кода.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-slate-100"><DollarSign size={14} /></div>
                      <div>
                        <p className="text-xs font-bold">Монетизация</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Настройка ID рекламных блоков для Google AdMob и Яндекс.Директ.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <Mail size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold">Коммуникации</CardTitle>
                  <CardDescription className="text-blue-100">Рассылки и контент</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid gap-4">
                    <div className="flex gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-blue-50"><MessageSquare size={14} className="text-blue-600" /></div>
                      <div>
                        <p className="text-xs font-bold">Массовые рассылки</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Отправка системных уведомлений или Email-кампаний по всей базе или сегментам (Premium, Новые).</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-blue-50"><Layers size={14} className="text-blue-600" /></div>
                      <div>
                        <p className="text-xs font-bold">Управление контентом</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Редактирование глобальных справочников: интересы, цели знакомства, уровни образования.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="bg-green-500/5 rounded-t-lg">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                    <ShieldAlert size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold">Безопасность контента</CardTitle>
                  <CardDescription>Автоматическая фильтрация</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Фильтр сообщений (Антимат)</h5>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                      Система в реальном времени анализирует текст сообщений и блокирует отправку при обнаружении:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <Badge variant="outline" className="text-[8px] uppercase">Нецензурная лексика</Badge>
                      <Badge variant="outline" className="text-[8px] uppercase">Спам / Ссылки</Badge>
                      <Badge variant="outline" className="text-[8px] uppercase">Политика</Badge>
                      <Badge variant="outline" className="text-[8px] uppercase">Оскорбления</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="bg-red-500/5 rounded-t-lg">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 mb-2">
                    <Flag size={20} />
                  </div>
                  <CardTitle className="text-xl font-bold">Система жалоб</CardTitle>
                  <CardDescription>Модерация по обращениям</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    Каждый пользователь может пожаловаться на анкету или чат. Жалобы поступают в раздел <b>«Жалобы»</b> админки, где модератор видит:
                  </p>
                  <ul className="text-[10px] space-y-1 text-muted-foreground list-disc pl-4">
                    <li>Кто и на кого пожаловался</li>
                    <li>Конкретную причину и описание нарушения</li>
                    <li>Дату события и статус обработки</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <footer className="text-center pt-8 border-t">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          SwiftMatch Platform Documentation • v1.0.0
        </p>
      </footer>
    </div>
  );
}
