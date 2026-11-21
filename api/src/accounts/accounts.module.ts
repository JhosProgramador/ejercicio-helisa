import { Module } from '@nestjs/common';
import { CreateAccountUseCase } from './application/create-account.use-case';
import { DeleteAccountUseCase } from './application/delete-account.use-case';
import { GetAccountTreeUseCase } from './application/get-account-tree.use-case';
import { ACCOUNT_REPOSITORY, AccountRepository } from './domain/account.repository';
import { InMemoryAccountRepository } from './infrastructure/in-memory-account.repository';
import { AccountsController } from './infrastructure/http/accounts.controller';

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