import { Module } from '@nestjs/common';
import { CreateAccountUseCase } from './application/create-account.use-case.js';
import { DeleteAccountUseCase } from './application/delete-account.use-case.js';
import { GetAccountTreeUseCase } from './application/get-account-tree.use-case.js';
import { ACCOUNT_REPOSITORY, AccountRepository } from './domain/account.repository.js';
import { InMemoryAccountRepository } from './infrastructure/in-memory-account.repository.js';
import { AccountsController } from './infrastructure/http/accounts.controller.js';

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