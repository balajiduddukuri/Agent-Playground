import { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { AgentPlayground } from "./components/AgentPlayground";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogProvider } from "./contexts/LogContext";
import { Toaster } from "sonner";

export default function App() {
  const [activePath, setActivePath] = useState<string>('/README.md');

  return (
    <LogProvider>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar onSelect={setActivePath} activePath={activePath} />
            <SidebarInset className="flex flex-col">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/95 backdrop-blur z-10">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {activePath === 'playground' ? 'Agent Playground' : activePath.split('/').pop()?.replace('.md', '')}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    Enterprise v1.0
                  </Badge>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-6 md:p-10 max-w-5xl mx-auto w-full relative">
                <div className="absolute inset-0 technical-grid opacity-[0.03] pointer-events-none" />
                <div className="relative slam-in">
                  {activePath === 'playground' ? (
                    <AgentPlayground />
                  ) : (
                    <div className="bg-card border rounded-xl p-8 shadow-sm glass-panel">
                      <MarkdownViewer filePath={activePath} />
                    </div>
                  )}
                </div>
              </main>
              <footer className="border-t p-4 text-center text-xs text-muted-foreground">
                AI SDLC Framework &copy; 2026. Built with Google Gemini.
              </footer>
            </SidebarInset>
          </div>
          <Toaster position="top-right" richColors />
        </SidebarProvider>
      </TooltipProvider>
    </LogProvider>
  );
}
