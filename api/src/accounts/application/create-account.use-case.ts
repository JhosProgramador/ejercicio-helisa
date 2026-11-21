import { Account, Nature } from '../domain/account';
import { DuplicateCodeError, ParentNotFoundError } from '../domain/account-errors';
import { AccountRepository } from '../domain/account.repository';

export interface CreateAccountInput { code: string; name: string; nature?: Nature }

export class CreateAccountUseCase {
  constructor(private readonly repo: AccountRepository) {}

  async execute(input: CreateAccountInput): Promise<Account> {
    const parentCode = Account.parentCodeOf(input.code); // valida formato y longitud
    if (await this.repo.findByCode(input.code)) throw new DuplicateCodeError(input.code);

    let parent: Account | null = null;
    if (parentCode) {
      parent = await this.repo.findByCode(parentCode);
      if (!parent) throw new ParentNotFoundError(parentCode);
    }

    const account = Account.create({ ...input, parent });
    await this.repo.save(account);
    return account;
  }
}