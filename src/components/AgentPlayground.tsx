import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateUserStories, generateCode, generateTests } from '@/src/services/gemini';
import { Loader2, Play, FileText, Code, CheckCircle, Zap, Terminal, Trash2, Sparkles, Eye, Layout } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLogs } from '@/src/contexts/LogContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";

const ArtifactCard = ({ 
  title, 
  content, 
  icon: Icon, 
  color, 
  borderColor, 
  bgColor,
  type
}: { 
  title: string; 
  content: string; 
  icon: any; 
  color: string; 
  borderColor: string; 
  bgColor: string;
  type: 'BA' | 'Dev' | 'QA'
}) => {
  const [viewMode, setViewMode] = useState<'markdown' | 'preview'>('markdown');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const extractCode = (md: string) => {
    const match = md.match(/```(?:html|javascript|typescript|tsx|jsx)?\n([\s\S]*?)```/);
    return match ? match[1] : md;
  };

  return (
    <Card className={`border-l-4 ${borderColor} shadow-sm overflow-hidden`}>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-3 border-b ${bgColor}`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-background/50 p-1 rounded-md border mr-2">
            <Button 
              variant={viewMode === 'markdown' ? 'secondary' : 'ghost'} 
              size="xs" 
              className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider"
              onClick={() => setViewMode('markdown')}
            >
              <Terminal className="w-3 h-3 mr-1" />
              Raw
            </Button>
            <Button 
              variant={viewMode === 'preview' ? 'secondary' : 'ghost'} 
              size="xs" 
              className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className={`h-8 hover:${bgColor}`}
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {viewMode === 'markdown' ? (
          <div className="prose prose-sm max-w-none dark:prose-invert bg-muted/10 p-6 overflow-auto max-h-[500px] font-sans leading-relaxed custom-scrollbar">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="p-6 bg-background overflow-auto max-h-[500px] custom-scrollbar">
            {type === 'Dev' ? (
              <div className="border rounded-xl overflow-hidden bg-white shadow-inner">
                <div className="bg-zinc-100 px-4 py-2 text-[10px] font-mono border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm" />
                    </div>
                    <span className="ml-2 text-zinc-400 font-bold uppercase tracking-widest">localhost:3000/preview</span>
                  </div>
                  <Layout className="w-3 h-3 text-zinc-400" />
                </div>
                <div className="p-6 min-h-[300px] text-zinc-900 bg-white selection:bg-blue-100">
                  {/* Simple HTML injection for demo purposes */}
                  <div 
                    className="preview-container"
                    dangerouslySetInnerHTML={{ __html: extractCode(content) }} 
                  />
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert bg-card p-8 rounded-xl border shadow-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AgentPlayground: React.FC = () => {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<{ BA?: string; Dev?: string; QA?: string }>({});
  const [activeAgent, setActiveAgent] = useState<'BA' | 'Dev' | 'QA'>('BA');
  const [loading, setLoading] = useState(false);
  const { logs, addLog, clearLogs } = useLogs();

  const logger = {
    log: (type: any, agent: string, message: string, data?: any) => {
      addLog({ type, agent, message, data });
    }
  };

  const handleRun = async () => {
    if (!input) return;
    setLoading(true);
    try {
      let result = '';
      if (activeAgent === 'BA') {
        result = await generateUserStories(input, logger) || '';
      } else if (activeAgent === 'Dev') {
        result = await generateCode(input, logger) || '';
      } else if (activeAgent === 'QA') {
        result = await generateTests(input, logger) || '';
      }
      setOutputs(prev => ({ ...prev, [activeAgent]: result }));
      toast.success(`${activeAgent} Agent completed successfully`);
    } catch (error) {
      toast.error(`Error in ${activeAgent} Agent`);
    } finally {
      setLoading(false);
    }
  };

  const handleChainRun = async () => {
    if (!input) return;
    setLoading(true);
    setOutputs({});
    try {
      toast.info("Starting AI SDLC Chain...");
      
      // Step 1: BA
      const stories = await generateUserStories(input, logger) || '';
      setOutputs(prev => ({ ...prev, BA: stories }));
      toast.success("BA Agent finished");

      // Step 2: Dev
      const code = await generateCode(stories, logger) || '';
      setOutputs(prev => ({ ...prev, Dev: code }));
      toast.success("Dev Agent finished");

      // Step 3: QA
      const tests = await generateTests(code, logger) || '';
      setOutputs(prev => ({ ...prev, QA: tests }));
      toast.success("QA Agent finished");

      toast.success("Full SDLC Chain completed!");
    } catch (error) {
      toast.error("Chain execution failed");
    } finally {
      setLoading(false);
    }
  };

  const clearOutputs = () => {
    setOutputs({});
    toast.info("Outputs cleared");
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="playground" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="playground" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
            Playground
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Terminal className="w-4 h-4 mr-2 text-blue-500" />
            Execution Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="playground" className="space-y-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'BA', icon: FileText, color: 'text-blue-500', label: 'BA Agent', desc: 'BRD → User Stories' },
              { id: 'Dev', icon: Code, color: 'text-green-500', label: 'Dev Agent', desc: 'Stories → Code' },
              { id: 'QA', icon: CheckCircle, color: 'text-purple-500', label: 'QA Agent', desc: 'Code → Tests' }
            ].map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md group relative overflow-hidden ${activeAgent === agent.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-primary/30'}`}
                  onClick={() => setActiveAgent(agent.id as any)}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${activeAgent === agent.id ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/30'}`} />
                  <CardHeader className="p-5">
                    <div className="flex items-center gap-3">
                      <agent.icon className={`w-6 h-6 ${agent.color}`} />
                      <div>
                        <CardTitle className="text-base">{agent.label}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{agent.desc}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="border-2 border-muted overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-muted/20">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-muted-foreground" />
                  Input for {activeAgent} Agent
                </CardTitle>
                <CardDescription>
                  {activeAgent === 'BA' && 'Enter your business requirements...'}
                  {activeAgent === 'Dev' && 'Enter user stories...'}
                  {activeAgent === 'QA' && 'Enter source code...'}
                </CardDescription>
              </div>
              {activeAgent === 'BA' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-background hover:bg-muted"
                  onClick={() => setInput("Build a task management system with user authentication, real-time updates, and a dashboard for project metrics.")}
                >
                  <Sparkles className="w-3 h-3 mr-2 text-amber-500" />
                  Load Example
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Textarea 
                placeholder="Type here..." 
                className="min-h-[180px] font-mono text-sm bg-muted/10 border-muted focus-visible:ring-primary/20 resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleRun} 
                  disabled={loading || !input} 
                  className="flex-1 h-14 text-base font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  Run {activeAgent} Agent
                </Button>
                <Button 
                  onClick={handleChainRun} 
                  disabled={loading || !input} 
                  variant="secondary"
                  className="flex-1 h-14 text-base font-bold border-2 border-primary/10 hover:border-primary/30 hover:bg-background transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2 text-amber-500" />}
                  Run Full SDLC Chain
                </Button>
              </div>
              {activeAgent !== 'BA' && input && (
                <p className="text-[11px] text-muted-foreground text-center italic font-medium">
                  Note: Full Chain always starts by treating input as a Business Requirement.
                </p>
              )}
            </CardContent>
          </Card>

          <AnimatePresence>
            {Object.entries(outputs).length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pt-4">
                  <h3 className="text-xl font-bold tracking-tight">Agent Artifacts</h3>
                  <Button variant="ghost" size="sm" onClick={clearOutputs} className="text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {outputs.BA && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      <ArtifactCard 
                        type="BA"
                        title="BA Artifact: User Stories"
                        content={outputs.BA}
                        icon={FileText}
                        color="text-blue-500"
                        borderColor="border-l-blue-500"
                        bgColor="bg-blue-500/5"
                      />
                    </motion.div>
                  )}

                  {outputs.Dev && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                      <ArtifactCard 
                        type="Dev"
                        title="Dev Artifact: Source Code"
                        content={outputs.Dev}
                        icon={Code}
                        color="text-green-500"
                        borderColor="border-l-green-500"
                        bgColor="bg-green-500/5"
                      />
                    </motion.div>
                  )}

                  {outputs.QA && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                      <ArtifactCard 
                        type="QA"
                        title="QA Artifact: Test Suite"
                        content={outputs.QA}
                        icon={CheckCircle}
                        color="text-purple-500"
                        borderColor="border-l-purple-500"
                        bgColor="bg-purple-500/5"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="logs" className="mt-8">
          <Card className="bg-zinc-950 text-zinc-400 font-mono text-xs border-zinc-800 overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 py-4 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
                <CardTitle className="text-sm text-zinc-200 font-bold tracking-widest uppercase">System_Orchestrator_Logs</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={clearLogs} className="h-8 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800">
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Flush_Buffer
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[650px] overflow-auto p-6 space-y-4 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
                    <Terminal className="w-12 h-12" />
                    <span className="text-sm tracking-widest uppercase">Waiting_for_input...</span>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-l-2 border-zinc-800 pl-4 py-2 hover:bg-zinc-900/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">{log.timestamp.toLocaleTimeString()}</span>
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter ${
                          log.type === 'ai-request' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          log.type === 'ai-response' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          log.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {log.type}
                        </span>
                        {log.agent && <span className="text-zinc-100 font-black tracking-tight">{log.agent}_CORE</span>}
                      </div>
                      <div className="text-zinc-400 leading-relaxed">{log.message}</div>
                      {log.data && (
                        <details className="mt-3 group/details">
                          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors list-none flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/details:bg-zinc-400" />
                            Inspect_Payload
                          </summary>
                          <pre className="mt-3 p-4 bg-black/80 rounded-lg border border-zinc-800/50 overflow-auto max-w-full text-[11px] leading-tight text-zinc-500">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
