import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Tenta pegar o cookie
  const token = request.cookies.get('auth_token')?.value

  // Define as rotas que queremos proteger
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  // SE NÃO TIVER TOKEN e tentar entrar no DASHBOARD -> Expulsa para o Login
  if (isDashboardPage && !token) {
    console.log("Sem token! Redirecionando...");
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// O Matcher diz ao Next.js em quais páginas o middleware deve rodar
export const config = {
  matcher: ['/dashboard/:path*'],
}