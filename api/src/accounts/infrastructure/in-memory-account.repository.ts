import { Account } from '../domain/account.js';
import { AccountRepository } from '../domain/account.repository.js';

export class InMemoryAccountRepository implements AccountRepository {
  private readonly store = new Map<string, Account>();

  async findByCode(code: string) { return this.store.get(code) ?? null; }
  async findAll() { return [...this.store.values()]; }
  async hasChildren(code: string) {
    return [...this.store.values()].some((a) => a.parentCode === code);
  }
  async save(account: Account) { this.store.set(account.code, account); }
  async delete(code: string) { this.store.delete(code); }
}