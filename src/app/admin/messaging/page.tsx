'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Mail, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function AdminMessagingPage() {
    const { t } = useLanguage();
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
                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.messaging.subject')}</Label>
                    <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-12 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('admin.messaging.message')}</Label>
                    <Textarea 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
