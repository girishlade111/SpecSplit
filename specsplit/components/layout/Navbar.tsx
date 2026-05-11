"use client";

import { Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSettingsClick: () => void;
}

export function Navbar({ onSettingsClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[--navbar-height] border-b bg-background/80 backdrop-blur-md px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap className="size-5 text-violet-500" />
        <span className="font-semibold">SpecSplit</span>
        <span className="text-xs text-muted-foreground">by LadeStack</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onSettingsClick}>
        <Settings className="size-4" />
      </Button>
    </header>
  );
}