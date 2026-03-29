
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DATING_GOALS, INTEREST_OPTIONS, CAPITALS, CIRCADIAN_RHYTHM_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: any;
  onApplyFilters: (newFilters: any) => void;
}

export function FiltersDialog({
  open,
  onOpenChange,
  currentFilters,
  onApplyFilters,
}: FiltersDialogProps) {
  const [ageRange, setAgeRange] = useState(currentFilters.ageRange || [18, 40]);
  const [distance, setDistance] = useState(currentFilters.distance || [50]);
  const [selectedCity, setSelectedCity] = useState(currentFilters.selectedCity || "Все");
  const [genderPref, setGenderPref] = useState(currentFilters.genderPref || "all");
  const [selectedDatingGoal, setSelectedDatingGoal] = useState(currentFilters.selectedDatingGoal || "all");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentFilters.selectedInterests || []);
  const [selectedCircadian, setSelectedCircadian] = useState(currentFilters.selectedCircadian || "all");
  
  const cities = useMemo(() => ["Все", ...CAPITALS], []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      ageRange,
      distance,
      selectedCity,
      genderPref,
      selectedDatingGoal,
      selectedInterests,
      selectedCircadian,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] w-[95vw] rounded-3xl border-0 p-0 bg-white app-shadow flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-black tracking-tight">Фильтры поиска</DialogTitle>
          <DialogDescription>Настройте параметры, чтобы найти идеального партнера.</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 pb-4">
          <div className="space-y-6">
            {/* Dating Goal */}
            <div className="space-y-3">
              <Label className="font-bold">Цель знакомства</Label>
              <Select value={selectedDatingGoal} onValueChange={setSelectedDatingGoal}>
                <SelectTrigger className="rounded-xl h-12 font-medium"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Все</SelectItem>
                  {DATING_GOALS.map(goal => <SelectItem key={goal} value={goal}>{goal}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="space-y-3">
              <Label className="font-bold">Возраст: <span className="text-primary font-black">{ageRange[0]} - {ageRange[1]}</span></Label>
              <Slider
                min={18}
                max={60}
                step={1}
                value={ageRange}
                onValueChange={setAgeRange}
                className="[&>span:first-child]:h-1"
              />
            </div>
            
            {/* Distance */}
            <div className="space-y-3">
                <Label className="font-bold">Дистанция: <span className="text-primary font-black">до {distance[0]} км</span></Label>
                <Slider min={1} max={100} step={1} value={distance} onValueChange={setDistance} />
            </div>

            {/* City */}
            <div className="space-y-3">
              <Label className="font-bold">Город</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="rounded-xl h-12 font-medium"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {/* Gender Preference */}
            <div className="space-y-3">
              <Label className="font-bold">Ищу</Label>
               <Select value={genderPref} onValueChange={setGenderPref}>
                  <SelectTrigger className="rounded-xl h-12 font-medium"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="male">Мужчину</SelectItem>
                    <SelectItem value="female">Женщину</SelectItem>
                    <SelectItem value="all">Всех</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {/* Circadian Rhythm */}
            <div className="space-y-3">
              <Label className="font-bold">Режим сна</Label>
               <Select value={selectedCircadian} onValueChange={setSelectedCircadian}>
                  <SelectTrigger className="rounded-xl h-12 font-medium"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Любой</SelectItem>
                    {CIRCADIAN_RHYTHM_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>

            {/* Interests */}
            <div className="space-y-3">
                <Label className="font-bold">Интересы</Label>
                <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(interest => (
                        <Badge
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                            className={cn(
                                "cursor-pointer px-3 py-1.5 rounded-lg transition-all border-0 font-bold text-xs shadow-sm",
                                selectedInterests.includes(interest) 
                                    ? "gradient-bg text-white hover:brightness-110" 
                                    : "bg-muted text-muted-foreground hover:bg-border"
                            )}
                        >
                            {interest}
                        </Badge>
                    ))}
                </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 flex-row gap-3 justify-end bg-muted/30 rounded-b-3xl mt-auto">
          <Button variant="ghost" className="rounded-xl" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleApply} className="rounded-xl gradient-bg text-white shadow-lg shadow-primary/20">Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
