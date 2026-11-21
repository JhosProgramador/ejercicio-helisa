import { Module } from '@nestjs/common';
import { CreateAccountUseCase } from '../src/accounts/application/create-account.use-case.js';
import { DeleteAccountUseCase } from '../src/accounts/application/delete-account.use-case.js';
import { GetAccountTreeUseCase } from '../src/accounts/application/get-account-tree.use-case.js';
import { ACCOUNT_REPOSITORY, AccountRepository } from '../src/accounts/domain/account.repository.js';
import { InMemoryAccountRepository } from '../src/accounts/infrastructure/in-memory-account.repository.js';
import { AccountsController } from '../src/accounts/infrastructure/http/accounts.controller.js';

@Module({
  controllers: [AccountsController],
  providers: [
    { provide: ACCOUNT_REPOSITORY, useClass: InMemoryAccountRepository },
    { provide: CreateAccountUseCase, useFactory: (r: AccountRepository) => new CreateAccountUseCase(r), inject: [ACCOUNT_REPOSITORY] },
    { provide: GetAccountTreeUseCase, useFactory: (r: AccountRepository) => new GetAccountTreeUseCase(r), inject: [ACCOUNT_REPOSITORY] },
    { provide: DeleteAccountUseCase, useFactory: (r: AccountRepository) => new DeleteAccountUseCase(r), inject: [ACCOUNT_REPOSITORY] },
  ],
})
export class AccountsModule {}