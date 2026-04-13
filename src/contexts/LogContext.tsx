import React, { createContext, useContext, useState, useCallback } from 'react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'error' | 'ai-request' | 'ai-response';
  agent?: string;
  message: string;
  data?: any;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    console.log(`[${newLog.type.toUpperCase()}] ${newLog.agent ? `(${newLog.agent}) ` : ''}${newLog.message}`, newLog.data || '');
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) throw new Error('useLogs must be used within a LogProvider');
  return context;
};
