"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get('redirect') || '/';
  const denied = search.get('denied');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error', error);
        setError(error.message);
      } else if (data.session) {
        // Cookies are automatically set by Supabase client
        router.push(redirect);
      } else {
        setError('Falha ao autenticar.');
      }
    } catch (err:any) {
      console.error('Unexpected login failure', err);
      setError('Erro inesperado. Ver console.');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-neutral-900 p-6 rounded-xl border border-neutral-800">
        <h1 className="text-xl font-semibold">Acessar</h1>
        {denied && <div className="text-amber-400 text-sm">Acesso negado para o recurso solicitado.</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" required />
        </div>
        <button disabled={loading} className="btn w-full" type="submit">{loading ? 'Entrando...' : 'Entrar'}</button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-sm text-neutral-400 hover:text-white transition"
          >
            Não tem conta? Criar uma
          </button>
        </div>
        
        <p className="text-xs text-neutral-500">Debug: ver console do navegador para erros de login.</p>
      </form>
    </main>
  );
}
