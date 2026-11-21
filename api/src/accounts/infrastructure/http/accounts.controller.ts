import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, UseFilters } from '@nestjs/common';
import { CreateAccountUseCase } from '../../application/create-account.use-case.js';
import { DeleteAccountUseCase } from '../../application/delete-account.use-case.js';
import { GetAccountTreeUseCase } from '../../application/get-account-tree.use-case.js';
import { Nature } from '../../domain/account.js';
import { DomainErrorFilter } from './domain-error.filter.js';

@Controller('accounts')
@UseFilters(DomainErrorFilter)
export class AccountsController {
  constructor(
    private readonly createAccount: CreateAccountUseCase,
    private readonly getTree: GetAccountTreeUseCase,
    private readonly deleteAccount: DeleteAccountUseCase,
  ) {}

  @Post()
  create(@Body() body: { code: string; name: string; nature?: Nature }) {
    return this.createAccount.execute({
      code: String(body.code ?? ''), name: body.name, nature: body.nature,
    });
  }

  @Get('tree')
  tree() { return this.getTree.execute(); }

  @Delete(':code')
  @HttpCode(204)
  remove(@Param('code') code: string) { return this.deleteAccount.execute(code); }
}