"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'secretaria', label: 'Secretaria' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'professor', label: 'Professor' },
  { value: 'responsavel', label: 'Responsável' },
  { value: 'aluno', label: 'Aluno' },
  { value: 'nutricionista', label: 'Nutricionista' },
  { value: 'bibliotecario', label: 'Bibliotecário' },
  { value: 'instrutor', label: 'Instrutor' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    role: 'aluno' as const
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const demoUsers = [
    { email: 'admin@demo.com', role: 'admin', nome: 'Admin Demo' },
    { email: 'secretaria@demo.com', role: 'secretaria', nome: 'Secretaria Demo' },
    { email: 'professor@demo.com', role: 'professor', nome: 'Professor Demo' },
    { email: 'aluno@demo.com', role: 'aluno', nome: 'Aluno Demo' },
  ];

  async function handleDemoLogin(demoUser: typeof demoUsers[0]) {
    setLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoUser.email,
        password: 'demo123'
      });

      if (signInError) {
        setError(`Usuário demo não encontrado. Senha: demo123`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call our registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao registrar usuário');
      }

      setSuccess(true);
      
      // Now try to log in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        setError('Usuário criado, mas falha no login automático. Tente fazer login manualmente.');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-green-400">Usuário Criado!</h1>
            <p className="text-sm text-neutral-400 mt-2">
              Redirecionando para o sistema...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Demo Users Section */}
        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
          <h2 className="text-lg font-semibold text-blue-400 mb-3">🚀 Usuários Demo</h2>
          <p className="text-sm text-neutral-400 mb-3">
            Use estes usuários para testar o sistema:
          </p>
          <div className="space-y-2">
            {demoUsers.map(user => (
              <button
                key={user.email}
                onClick={() => handleDemoLogin(user)}
                disabled={loading}
                className="w-full text-left p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-sm"
              >
                <div className="font-medium text-white">{user.nome}</div>
                <div className="text-neutral-400">{user.email} • Senha: demo123</div>
                <div className="text-xs text-blue-400 capitalize">Função: {user.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <div className="text-center mb-4">
            <h1 className="text-xl font-semibold">Criar Nova Conta</h1>
            <p className="text-sm text-neutral-400">SME SaaS Demo</p>
          </div>
        
        {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded">{error}</div>}
        
        <div>
          <label className="block text-sm mb-1">Nome Completo</label>
          <input
            type="text"
            value={formData.nome}
            onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            className="input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="input"
            required
            minLength={6}
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Função</label>
          <select
            value={formData.role}
            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
            className="input"
            required
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        
        <button disabled={loading} className="btn w-full" type="submit">
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-sm text-neutral-400 hover:text-white transition"
          >
            Já tem conta? Fazer login
          </button>
        </div>
        </form>
      </div>
    </main>
  );
}
