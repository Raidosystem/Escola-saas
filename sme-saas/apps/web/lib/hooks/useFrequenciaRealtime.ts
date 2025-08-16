import { useEffect, useRef, useState } from 'react';

interface EventoFrequencia {
  frequencia_id: string;
  turma_id: string;
  data: string;
  etapa: number;
}

interface Options {
  rtUrl?: string; // base ws URL, e.g. wss://rt.example.com/ws
  token?: string; // bearer token for RT auth
}

export function useFrequenciaRealtime(turma_id: string | undefined, opts: Options = {}) {
  const [eventos, setEventos] = useState<EventoFrequencia[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!turma_id) return;
    const base = opts.rtUrl || process.env.NEXT_PUBLIC_RT_WS_URL || 'ws://localhost:8081/ws';
    const url = new URL(base);
    url.searchParams.set('channel', `frequencia:${turma_id}`);
    if (opts.token) {
      // Some browsers allow passing headers via subprotocol hack; simpler: append token as query fallback
      url.searchParams.set('auth', opts.token);
    }
    const ws = new WebSocket(url.toString());
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      try {
        const obj = JSON.parse(ev.data);
        if (obj && obj.frequencia_id) {
          setEventos(prev => [obj as EventoFrequencia, ...prev].slice(0, 100));
        }
      } catch {
        // ignore
      }
    };
    ws.onclose = () => { wsRef.current = null; };
    return () => { ws.close(); };
  }, [turma_id]);

  return { eventos };
}
