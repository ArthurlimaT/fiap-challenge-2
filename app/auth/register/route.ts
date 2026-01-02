// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });

    // Simulação: qualquer senha "123456" é aceita
    if (password === '123456') {
      return NextResponse.json({ ok: true, token: 'fake-token', user: { name: 'Joana', email } }, { status: 200 });
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
