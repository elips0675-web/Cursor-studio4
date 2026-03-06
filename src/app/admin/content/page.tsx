'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Package } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { INTEREST_OPTIONS, DATING_GOALS, EDUCATION_OPTIONS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const EditableList = ({ initialItems, onSave, noun_ru, noun_en }: { initialItems: string[], onSave: (items: string[]) => void, noun_ru: string, noun_en: string }) => {
    const { language } = useLanguage();
    const [items, setItems] = useState(initialItems);
    const [newItem, setNewItem] = useState("");
    const noun = language === 'RU' ? noun_ru : noun_en;

    const handleAddItem = () => {
        if (newItem.trim() && !items.includes(newItem.trim())) {
            const updatedItems = [...items, newItem.trim()];
            setItems(updatedItems);
            setNewItem("");
            onSave(updatedItems);
            toast({ title: `${noun} добавлен` });
        }
    };

    const handleDeleteItem = (itemToDelete: string) => {
        const updatedItems = items.filter(item => item !== itemToDelete);
        setItems(updatedItems);
        onSave(updatedItems);
        toast({ title: `${noun} удален`, variant: 'destructive' });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 p-4 rounded-2xl border bg-muted/30 min-h-[120px]">
                {items.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-sm font-semibold py-1.5 px-3 flex items-center gap-2 border bg-white shadow-sm h-fit">
                        {item}
                        <button onClick={() => handleDeleteItem(item)} className="text-muted-foreground hover:text-destructive transition-colors -mr-1">
                            <Trash2 size={13} />
                        </button>
                    </Badge>
                ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
                <Input
                    placeholder={`${language === 'RU' ? 'Новый' : 'New'} ${noun.toLowerCase()}...`}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    className="h-11 rounded-xl"
                />
                <Button onClick={handleAddItem} className="rounded-xl h-11 shrink-0">
                    <Plus size={16} className="mr-2" /> {language === 'RU' ? 'Добавить' : 'Add'}
                </Button>
            </div>
        </div>
    );
};

export default function ContentManagementPage() {
    const { t, language } = useLanguage();
    const [interests, setInterests] = useState(INTEREST_OPTIONS);
    const [datingGoals, setDatingGoals] = useState(DATING_GOALS);
    const [educationLevels, setEducationLevels] = useState(EDUCATION_OPTIONS);

    const handleSave = (type: string) => {
        // In a real app, this would save to a database.
        // Here we just show a toast.
        toast({ title: t(`admin.content.${type}.save_toast`) });
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {t('admin.content.title')}
                </CardTitle>
                <CardDescription>{t('admin.content.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="interests" className="w-full">
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="interests">{t('admin.content.interests.title')}</TabsTrigger>
                        <TabsTrigger value="goals">{t('admin.content.dating_goals.title')}</TabsTrigger>
                        <TabsTrigger value="education">{t('admin.content.education.title')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="interests" className="pt-6">
                        <EditableList 
                            initialItems={interests} 
                            onSave={(items) => { setInterests(items); handleSave('interests'); }}
                            noun_ru="Интерес"
                            noun_en="Interest"
                        />
                    </TabsContent>
                    <TabsContent value="goals" className="pt-6">
                        <EditableList 
                            initialItems={datingGoals}
                            onSave={(items) => { setDatingGoals(items); handleSave('goals'); }}
                            noun_ru="Цель"
                            noun_en="Goal"
                        />
                    </TabsContent>
                    <TabsContent value="education" className="pt-6">
                        <EditableList 
                            initialItems={educationLevels}
                            onSave={(items) => { setEducationLevels(items); handleSave('education'); }}
                            noun_ru="Уровень"
                            noun_en="Level"
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
