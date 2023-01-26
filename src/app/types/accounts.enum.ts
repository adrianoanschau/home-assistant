export enum Accounts {
  NuConta__Adriano = 'NuConta__Adriano',
  Cartao_de_Credito__Adriano = 'Cartao_de_Credito__Adriano',
  NuConta__Fernanda = 'NuConta__Fernanda',
  Cartao_de_Credito__Fernanda = 'Cartao_de_Credito__Fernanda',
}

export const AccountsNames: Record<Accounts, string> = {
  [Accounts.NuConta__Adriano]: 'NuConta Adriano',
  [Accounts.Cartao_de_Credito__Adriano]: 'Cartão de Crédito Adriano',
  [Accounts.NuConta__Fernanda]: 'NuConta Fernanda',
  [Accounts.Cartao_de_Credito__Fernanda]: 'Cartão de Crédito Fernanda',
};
