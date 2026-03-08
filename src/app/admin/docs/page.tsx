
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, Cpu, Layers, Sparkles, Zap, ShieldCheck, Target, Users, ShieldAlert, 
  MessageSquare, Settings2, Rocket, TestTube, CheckCircle2, Trophy, Camera, 
  Flame, Mail, DollarSign, Heart, Gift, Info, Video, Flag, SlidersHorizontal, Scale,
  BarChart3, Activity, Gauge
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminDocsPage() {
  const { t } = useLanguage();

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

  const ArchitectureContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2">
      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-primary/5 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Cpu size={32} />
            </div>
            <CardTitle className="text-2xl font-black">{t('admin.docs.about_title')}</CardTitle>
            <CardDescription className="text-lg">Технологический стек проекта</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Frontend (Next.js 15)</h4>
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                Использование <b>React 19</b> и <b>Server Components</b> позволяет минимизировать объем JavaScript на клиенте, обеспечивая мгновенную загрузку даже на слабых устройствах. Оптимизация LCP через приоритетную загрузку фото.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Backend & DB (Firebase)</h4>
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                <b>Firestore</b> обеспечивает синхронизацию данных в реальном времени (Real-time чаты, уведомления). <b>Firebase Auth</b> управляет безопасным входом через Google и Email.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">AI Engine (Genkit)</h4>
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                Все интеллектуальные функции реализованы через <b>Google Genkit</b> с использованием моделей Gemini 2.5 Flash. Архитектура готова к подключению <b>DeepSeek</b>.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-purple-500/5 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
              <Rocket size={32} />
            </div>
            <CardTitle className="text-2xl font-black">CI/CD и Тесты</CardTitle>
            <CardDescription className="text-lg">Автоматизация разработки</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-purple-50 shrink-0">
                  <TestTube className="text-purple-500" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black">Unit-тестирование (Jest)</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Покрывает критическую бизнес-логику: расчет званий, фильтры сообщений и вспомогательные функции.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-purple-50 shrink-0">
                  <ShieldCheck className="text-purple-500" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black">GitHub Actions</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Автоматическая проверка кода (Lint, Typecheck, Test) при каждом Push в репозиторий.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-purple-50 shrink-0">
                  <Zap className="text-purple-500" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black">Firebase App Hosting</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Автоматический деплой стабильных версий в облачную инфраструктуру Google Cloud.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const FeaturesContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 mb-3">
              <Heart size={28} />
            </div>
            <CardTitle className="text-xl font-black">Чаты и AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>Real-time:</b> Мгновенная доставка сообщений через Firestore Listeners.</p>
            <p>• <b>AI Icebreakers:</b> Генерация персонализированных фраз для начала диалога на основе 6 разных настроений.</p>
            <p>• <b>Индикация:</b> Статусы "в сети", "печатает", подтверждение прочтения.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-3">
              <Users size={28} />
            </div>
            <CardTitle className="text-xl font-black">Группы (Сообщества)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>20+ категорий:</b> Музыка, Спорт, IT, Путешествия и другие тематические хабы.</p>
            <p>• <b>Групповые чаты:</b> Массовое общение участников одной категории.</p>
            <p>• <b>Anti-Spam:</b> Cooldown система (5 секунд) для поддержания чистоты общения.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-3">
              <Trophy size={28} />
            </div>
            <CardTitle className="text-xl font-black">Фотоконкурс</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>Голосование:</b> Ежемесячное голосование пользователей за лучшие анкеты.</p>
            <p>• <b>Пьедестал:</b> Визуальное выделение топ-3 участников с анимациями и коронами.</p>
            <p>• <b>Квесты:</b> Задание "Проголосуй за 5 человек" для получения бонусов.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-3">
              <Flame size={28} />
            </div>
            <CardTitle className="text-xl font-black">Квесты и Звания</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>Daily Quests:</b> Обновляемый список задач для повышения вовлеченности (Retention).</p>
            <p>• <b>Титулы:</b> Автоматическое присвоение званий ("Король свиданий") на основе активности.</p>
            <p>• <b>Rewards:</b> Календарь наград за ежедневный вход в приложение.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-3">
              <Sparkles size={28} />
            </div>
            <CardTitle className="text-xl font-black">AI Возможности</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>AI Bio:</b> Генерация креативного описания профиля по интересам пользователя.</p>
            <p>• <b>Match Insight:</b> Анализ совместимости пары при мэтче с выделением точек соприкосновения.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 mb-3">
              <Video size={28} />
            </div>
            <CardTitle className="text-xl font-black">Видеозвонки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>WebRTC Ready:</b> Интерфейс видеозвонка с управлением камерой и микрофоном.</p>
            <p>• <b>Интерфейс:</b> Поддержка полноэкранного режима и плавающего окна (PiP).</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const LogicContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className="bg-orange-500/5 border-b border-orange-500/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <Target size={32} />
            </div>
            <div>
              <CardTitle className="text-2xl font-black">{t('admin.docs.logic_title')}</CardTitle>
              <CardDescription className="text-lg font-medium">Многоуровневый алгоритм ранжирования анкет</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-10 space-y-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 p-6 rounded-3xl bg-muted/30 border border-border/50 relative">
              <Badge className="absolute -top-3 left-6 bg-orange-500 text-white border-0 font-black px-3 py-1">Этап 1</Badge>
              <h5 className="font-black text-sm uppercase tracking-widest text-primary pt-2">Жесткий фильтр</h5>
              <ul className="text-base space-y-3 text-muted-foreground font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-[#2ecc71]"/> Пол и ориентация</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-[#2ecc71]"/> Возраст (+/- 5 лет)</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-[#2ecc71]"/> Город / Геолокация</li>
              </ul>
            </div>

            <div className="space-y-4 p-6 rounded-3xl bg-white border-2 border-orange-500/20 shadow-2xl shadow-orange-500/5 relative">
              <Badge className="absolute -top-3 left-6 bg-orange-500 text-white border-0 font-black px-3 py-1">Этап 2</Badge>
              <h5 className="font-black text-sm uppercase tracking-widest text-primary pt-2">Умный скоринг</h5>
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center text-base font-black">
                  <span>Совпадение цели</span>
                  <span className="text-orange-600">+1000 pts</span>
                </div>
                <div className="flex justify-between items-center text-base font-black">
                  <span>Общий интерес</span>
                  <span className="text-orange-600">+100 pts / шт</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground font-bold italic pt-2">
                Алгоритм суммирует очки и ранжирует список. Те, кто больше всего подходит, оказываются в самом верху выдачи.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-3xl bg-muted/30 border border-border/50 relative">
              <Badge className="absolute -top-3 left-6 bg-orange-500 text-white border-0 font-black px-3 py-1">Этап 3</Badge>
              <h5 className="font-black text-sm uppercase tracking-widest text-primary pt-2">Правило пересечения</h5>
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                В выдачу попадают только те, у кого есть <b>хотя бы одно</b> совпадение (по цели ИЛИ интересам). Это гарантирует, что в ленте нет "случайных" людей.
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-tighter mt-4">
                <Sparkles size={18} /> Чистая лента без шума
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PerformanceContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2">
      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-emerald-500/5 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
              <Gauge size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Производительность</CardTitle>
            <CardDescription className="text-lg">Ключевые метрики (Core Web Vitals)</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid gap-6">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-wider text-muted-foreground">LCP (Загрузка фото)</p>
                  <p className="text-xs text-muted-foreground font-medium">Оптимизация через Next/Image и CDN</p>
                </div>
                <Badge className="bg-emerald-500 text-white font-black px-3 py-1">~1.2s</Badge>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-wider text-muted-foreground">Доставка сообщений</p>
                  <p className="text-xs text-muted-foreground font-medium">Real-time синхронизация Firestore</p>
                </div>
                <Badge className="bg-emerald-500 text-white font-black px-3 py-1">&lt; 200ms</Badge>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-wider text-muted-foreground">AI Генерация</p>
                  <p className="text-xs text-muted-foreground font-medium">Gemini 2.5 Flash API Latency</p>
                </div>
                <Badge className="bg-emerald-500 text-white font-black px-3 py-1">~1.5-3s</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-indigo-500/5 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-4">
              <Activity size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Мониторинг здоровья</CardTitle>
            <CardDescription className="text-lg">Инструменты контроля системы</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-indigo-50 shrink-0"><BarChart3 size={24} className="text-indigo-600" /></div>
                <div>
                  <p className="text-lg font-black">Google Cloud Operations</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Дашборды для отслеживания активных соединений, ошибок БД и таймаутов AI-запросов.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-indigo-50 shrink-0"><ShieldAlert size={24} className="text-indigo-600" /></div>
                <div>
                  <p className="text-lg font-black">Sentry & Firebase Perf</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Сбор исключений на клиенте и автоматический замер производительности каждого сетевого запроса.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const AdminContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2">
      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Settings2 size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Панель управления</CardTitle>
            <CardDescription className="text-slate-400 text-lg">Инструменты модератора</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid gap-8">
              <div className="flex gap-4">
                <div className="mt-1 p-3 rounded-xl bg-slate-100 shrink-0"><Users size={24} /></div>
                <div>
                  <p className="text-lg font-black">Управление пользователями</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Просмотр, редактирование персональных данных, блокировка нарушителей и удаление аккаунтов.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-3 rounded-xl bg-slate-100 shrink-0"><SlidersHorizontal size={24} /></div>
                <div>
                  <p className="text-lg font-black">Feature Flags</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Включение и выключение функций (видеозвонки, ИИ-инсайты) в реальном времени без необходимости деплоя.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-3 rounded-xl bg-slate-100 shrink-0"><DollarSign size={24} /></div>
                <div>
                  <p className="text-lg font-black">Монетизация</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Настройка ID рекламных блоков для Google AdMob и Yandex Ads для управления доходностью.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-blue-600 text-white rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Mail size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Коммуникации</CardTitle>
            <CardDescription className="text-blue-100 text-lg">Рассылки и контент</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid gap-8">
              <div className="flex gap-4">
                <div className="mt-1 p-3 rounded-xl bg-blue-50 shrink-0"><MessageSquare size={24} className="text-blue-600" /></div>
                <div>
                  <p className="text-lg font-black">Массовые рассылки</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Отправка системных уведомлений (In-App) или Email-кампаний по всей базе или сегментам.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-3 rounded-xl bg-blue-50 shrink-0"><Layers size={24} className="text-blue-600" /></div>
                <div>
                  <p className="text-lg font-black">Управление контентом</p>
                  <p className="text-base text-muted-foreground leading-relaxed">Редактирование глобальных справочников: обновляйте списки интересов, целей и уровней образования.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const SecurityContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2">
      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-green-500/5 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 mb-4">
              <ShieldAlert size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Безопасность контента</CardTitle>
            <CardDescription className="text-lg">Автоматическая фильтрация</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <h5 className="text-lg font-black flex items-center gap-3"><CheckCircle2 size={24} className="text-green-500" /> Фильтр сообщений (Антимат)</h5>
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                Система в реальном времени анализирует текст всех сообщений. Если обнаружено нарушение, отправка блокируется с уведомлением пользователя.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="text-xs font-black uppercase py-1 px-3">Нецензурная лексика</Badge>
                <Badge variant="outline" className="text-xs font-black uppercase py-1 px-3">Спам / Ссылки</Badge>
                <Badge variant="outline" className="text-xs font-black uppercase py-1 px-3">Политика</Badge>
                <Badge variant="outline" className="text-xs font-black uppercase py-1 px-3">Оскорбления</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-red-500/5 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 mb-4">
              <Flag size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Система жалоб</CardTitle>
            <CardDescription className="text-lg">Модерация по обращениям</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <p className="text-base leading-relaxed text-muted-foreground font-medium">
              Каждый пользователь имеет возможность подать анонимную жалобу на анкету или чат. Жалобы мгновенно поступают в раздел <b>«Жалобы»</b> админки для принятия мер.
            </p>
            <ul className="text-base space-y-2 text-muted-foreground font-bold list-disc pl-5 pt-2">
              <li>История взаимодействий reporter/reported</li>
              <li>Конкретная причина (Фейк, Спам, Агрессия)</li>
              <li>Автоматическое логирование даты события</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const LegalContent = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-2">
      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader className="bg-slate-100 rounded-t-xl pb-8">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-600 mb-4 shadow-sm">
              <Scale size={32} />
            </div>
            <CardTitle className="text-2xl font-black">Юридическая база</CardTitle>
            <CardDescription className="text-lg">Compliance и документы</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                Проект укомплектован полным набором юридических шаблонов, необходимых для официального запуска в РФ и Европе:
              </p>
              <ul className="text-base space-y-3 text-muted-foreground font-bold">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-blue-500"/> GDPR Compliance (Европа)</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-blue-500"/> 152-ФЗ (Россия)</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-blue-500"/> Cookie Consent & Privacy</li>
              </ul>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm font-medium leading-relaxed italic">
                Примечание: Перед продажей необходимо заменить плейсхолдеры в текстах на реальные реквизиты юридического лица.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-0 shadow-md h-full">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
              <ShieldCheck size={28} />
            </div>
            <CardTitle className="text-xl font-black">Обработка данных</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground font-medium">
            <p>• <b>Контроль:</b> Каждый пользователь может отозвать согласие на обработку данных в настройках.</p>
            <p>• <b>Прозрачность:</b> Прямые ссылки на политику конфиденциальности в профиле и при регистрации.</p>
            <p>• <b>Защита:</b> Описание методов хранения данных на базе Google Cloud Trust Center.</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-24 px-4">
      <header className="space-y-4">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
          <BookOpen className="text-primary" size={48} />
          {t('admin.docs.title')}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed">
          Полное техническое, функциональное и юридическое описание платформы SwiftMatch для администраторов и инвесторов.
        </p>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto p-1.5 bg-muted/50 rounded-xl mb-10 gap-1">
          <TabsTrigger value="all" className="flex-1 min-w-[80px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">ВСЕ</TabsTrigger>
          <TabsTrigger value="architecture" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Архитектура</TabsTrigger>
          <TabsTrigger value="performance" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Метрики</TabsTrigger>
          <TabsTrigger value="features" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Функционал</TabsTrigger>
          <TabsTrigger value="logic" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Алгоритмы</TabsTrigger>
          <TabsTrigger value="admin" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Управление</TabsTrigger>
          <TabsTrigger value="security" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Безопасность</TabsTrigger>
          <TabsTrigger value="legal" className="flex-1 min-w-[120px] rounded-lg py-3 font-black text-sm uppercase tracking-wider">Юридическое</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-20 outline-none">
          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <Cpu className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Архитектура и CI/CD</h3>
            </div>
            <ArchitectureContent />
          </section>
          
          <Separator />

          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <Gauge className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Производительность и Мониторинг</h3>
            </div>
            <PerformanceContent />
          </section>

          <Separator />

          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <Sparkles className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Основные возможности</h3>
            </div>
            <FeaturesContent />
          </section>

          <Separator />

          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <Target className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Логика мэтчинга</h3>
            </div>
            <LogicContent />
          </section>

          <Separator />

          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <Settings2 className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Инструменты администрирования</h3>
            </div>
            <AdminContent />
          </section>

          <Separator />

          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <ShieldAlert className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Безопасность и Модерация</h3>
            </div>
            <SecurityContent />
          </section>

          <Separator />

          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <Scale className="text-primary" size={28} />
              <h3 className="text-3xl font-black uppercase tracking-tight">Юридическое соответствие</h3>
            </div>
            <LegalContent />
          </section>
        </TabsContent>

        <TabsContent value="architecture" className="outline-none">
          <ArchitectureContent />
        </TabsContent>

        <TabsContent value="performance" className="outline-none">
          <PerformanceContent />
        </TabsContent>

        <TabsContent value="features" className="outline-none">
          <FeaturesContent />
        </TabsContent>

        <TabsContent value="logic" className="outline-none">
          <LogicContent />
        </TabsContent>

        <TabsContent value="admin" className="outline-none">
          <AdminContent />
        </TabsContent>

        <TabsContent value="security" className="outline-none">
          <SecurityContent />
        </TabsContent>

        <TabsContent value="legal" className="outline-none">
          <LegalContent />
        </TabsContent>
      </Tabs>

      <footer className="text-center pt-16 border-t mt-16">
        <p className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/30">
          SwiftMatch Platform Documentation • Version 1.0.0 • 2024
        </p>
      </footer>
    </div>
  );
}
