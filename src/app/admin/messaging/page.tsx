'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Mail, Send, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SUPPORT_USER } from '@/lib/demo-data';
import { Badge } from '@/components/ui/badge';

export default function AdminMessagingPage() {
    const { t, language } = useLanguage();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        if (!subject || !message) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Тема и сообщение не могут быть пустыми.',
            });
            return;
        }

        setIsSending(true);
        // Simulate sending
        setTimeout(() => {
            setIsSending(false);
            toast({
                title: t('admin.messaging.send_success_title'),
                description: t('admin.messaging.send_success_desc'),
            });
            setSubject('');
            setMessage('');
        }, 1500);
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {t('admin.messaging.title')}
                </CardTitle>
                <CardDescription>{t('admin.messaging.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <img src={SUPPORT_USER.img} alt="Support" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-sm">{language === 'RU' ? SUPPORT_USER.name_ru : SUPPORT_USER.name_en}</h4>
                            <ShieldCheck size={14} className="text-primary" />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Отправитель рассылки</p>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-white text-[9px] font-black uppercase tracking-tighter text-primary border-primary/20">System</Badge>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.messaging.subject')}</Label>
                    <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Напр. Важное обновление системы"
                        className="h-12 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.messaging.message')}</Label>
                    <Textarea 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Текст сообщения, которое получат все пользователи..."
                        className="min-h-[200px] rounded-2xl p-4"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-3 border-t bg-muted/5 px-6 py-4">
                <Button 
                    onClick={handleSend} 
                    disabled={isSending || !subject || !message}
                    className="min-w-[160px] rounded-full gradient-bg text-white font-black uppercase tracking-widest h-11 px-8 shadow-lg shadow-primary/20 border-0"
                >
                    {isSending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            {t('admin.messaging.send')}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
