import { request } from '../../api/client'
import type { Account, AccountNode, CreateAccountInput } from './types'

export const accountsApi = {
  tree: () => request<AccountNode[]>('/accounts/tree'),
  create: (input: CreateAccountInput) =>
    request<Account>('/accounts', { method: 'POST', body: JSON.stringify(input) }),
  remove: (code: string) => request<void>(`/accounts/${code}`, { method: 'DELETE' }),
}