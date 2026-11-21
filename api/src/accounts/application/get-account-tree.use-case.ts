import { AccountRepository } from '../domain/account.repository';

export interface AccountNode {
  code: string; name: string; level: string; nature: string;
  isLeaf: boolean; children: AccountNode[];
}

export class GetAccountTreeUseCase {
  constructor(private readonly repo: AccountRepository) {}

  async execute(): Promise<AccountNode[]> {
    const accounts = (await this.repo.findAll()).sort((a, b) => a.code.localeCompare(b.code));
    const nodes = new Map<string, AccountNode>();
    for (const a of accounts) {
      nodes.set(a.code, {
        code: a.code, name: a.name, level: a.level, nature: a.nature,
        isLeaf: true, children: [],
      });
    }
    const roots: AccountNode[] = [];
    for (const a of accounts) {
      const node = nodes.get(a.code)!;
      if (a.parentCode) {
        const parent = nodes.get(a.parentCode)!;
        parent.children.push(node);
        parent.isLeaf = false;
      } else roots.push(node);
    }
    return roots;
  }
}