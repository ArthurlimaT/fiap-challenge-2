import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    // ⚠ SE QUISER AUTENTICAÇÃO DE VERDADE, COLOQUE AQUI
    if (email !== "teste@teste.com" || password !== "123456") {
      return NextResponse.json(
        { error: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
