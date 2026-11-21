import { AccountHasChildrenError, AccountNotFoundError } from '../domain/account-errors';
import { AccountRepository } from '../domain/account.repository';

export class DeleteAccountUseCase {
  constructor(private readonly repo: AccountRepository) {}

  async execute(code: string): Promise<void> {
    if (!(await this.repo.findByCode(code))) throw new AccountNotFoundError(code);
    if (await this.repo.hasChildren(code)) throw new AccountHasChildrenError(code);
    await this.repo.delete(code);
  }
}