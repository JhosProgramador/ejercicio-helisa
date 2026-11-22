export type Nature = 'DEBIT' | 'CREDIT'

export interface Account {
  code: string
  name: string
  nature: Nature
  parentCode: string | null
}

export interface AccountNode {
  code: string
  name: string
  level: string
  nature: Nature
  isLeaf: boolean
  children: AccountNode[]
}

export interface CreateAccountInput {
  code: string
  name: string
  nature?: Nature
}