import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Shield, Settings, Activity, AlertTriangle, ListTodo, BrainCircuit, Rocket, Terminal } from "lucide-react"

const items = [
  {
    title: "Overview",
    group: "General",
    items: [
      { title: "README", icon: LayoutDashboard, path: "/README.md" },
      { title: "Roadmap", icon: Rocket, path: "/ROADMAP.md" },
      { title: "Changelog", icon: Activity, path: "/CHANGELOG.md" },
    ]
  },
  {
    title: "Documentation",
    group: "SDLC",
    items: [
      { title: "Requirements", icon: FileText, path: "/docs/REQUIREMENTS.md" },
      { title: "Architecture", icon: BrainCircuit, path: "/docs/ARCHITECTURE.md" },
      { title: "API Spec", icon: Terminal, path: "/docs/API.md" },
      { title: "Testing", icon: Shield, path: "/docs/TESTING.md" },
      { title: "Evaluation", icon: Activity, path: "/docs/EVALUATION.md" },
      { title: "Security", icon: Shield, path: "/docs/SECURITY.md" },
      { title: "Deployment", icon: Rocket, path: "/docs/DEPLOYMENT.md" },
      { title: "Troubleshooting", icon: AlertTriangle, path: "/docs/TROUBLESHOOTING.md" },
    ]
  },
  {
    title: "AI & Agents",
    group: "AI Layer",
    items: [
      { title: "Agents", icon: BrainCircuit, path: "/ai/AGENTS.md" },
      { title: "Skills", icon: ListTodo, path: "/ai/SKILLS.md" },
      { title: "Prompts", icon: Terminal, path: "/ai/PROMPTS.md" },
      { title: "Models", icon: Settings, path: "/ai/MODELS.md" },
      { title: "Tasks", icon: ListTodo, path: "/ai/TASKS.md" },
      { title: "Data Sources", icon: FileText, path: "/ai/DATA_SOURCES.md" },
    ]
  },
  {
    title: "Governance",
    group: "PMO",
    items: [
      { title: "Risks", icon: AlertTriangle, path: "/RISKS.md" },
      { title: "Metrics", icon: Activity, path: "/METRICS.md" },
    ]
  }
]

export function AppSidebar({ onSelect, activePath }: { onSelect: (path: string) => void, activePath: string }) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span>AI SDLC</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Framework_v1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => onSelect('playground')}
                isActive={activePath === 'playground'}
                className={`w-full justify-start px-4 py-8 mb-4 transition-all duration-300 ${
                  activePath === 'playground' 
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'hover:bg-primary/5'
                }`}
              >
                <Terminal className={`w-5 h-5 mr-3 ${activePath === 'playground' ? 'text-primary-foreground' : 'text-blue-500'}`} />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm">Agent Playground</span>
                  <span className={`text-[10px] opacity-70 ${activePath === 'playground' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>Interactive Orchestrator</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {items.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => onSelect(item.path)}
                      isActive={activePath === item.path}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <div className="mt-auto p-4 border-t border-sidebar-border/50 bg-sidebar-accent/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest">System_Online</span>
            <span className="text-[9px] text-muted-foreground font-mono">ASIA-SE1-NODE-04</span>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
