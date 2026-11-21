import {
  EmptyNameError, InvalidCodeError, InvalidLengthError, NatureRequiredError,
} from './account-errors.js';

export type Nature = 'DEBIT' | 'CREDIT';
const LENGTHS = [1, 2, 4, 6] as const;
const LEVEL_NAMES = ['Clase', 'Grupo', 'Cuenta', 'Subcuenta'] as const;

export class Account {
  private constructor(
    readonly code: string,
    readonly name: string,
    readonly nature: Nature,
    readonly parentCode: string | null,
  ) {}

  /** Valida formato y devuelve el código del padre (null si es clase). */
  static parentCodeOf(code: string): string | null {
    if (!/^\d+$/.test(code)) throw new InvalidCodeError();
    const i = LENGTHS.indexOf(code.length as any);
    if (i === -1) throw new InvalidLengthError();
    return i === 0 ? null : code.slice(0, LENGTHS[i - 1]);
  }

  static create(input: { code: string; name: string; nature?: Nature; parent: Account | null }): Account {
    const parentCode = Account.parentCodeOf(input.code);
    const nature = parentCode === null ? input.nature : input.parent!.nature;
    if (!nature) throw new NatureRequiredError();
    const name = input.name?.trim();
    if (!name) throw new EmptyNameError();
    return new Account(input.code, name, nature, parentCode);
  }

  get level(): string {
    return LEVEL_NAMES[LENGTHS.indexOf(this.code.length as any)];
  }
}