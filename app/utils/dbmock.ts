// app/dashboard/utils/dbMock.ts

export interface Transacao {
  id: string;
  tipo: 'pix' | 'doc' | 'deposito';
  valor: number;
  data: string;
  favorecido?: string;
}

export const usuarioMock = {
  nome: "Joana Fonseca Gomes",
  conta: "12345-6",
  agencia: "0001",
  saldo: 2500.00,
  extrato: [
    { id: '1', tipo: 'deposito', valor: 500.00, data: '2023-10-01', favorecido: 'Própria Conta' },
    { id: '2', tipo: 'pix', valor: -150.00, data: '2023-10-02', favorecido: 'Mercado Central' },
  ] as Transacao[]
};