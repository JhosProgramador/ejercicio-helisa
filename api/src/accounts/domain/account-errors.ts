export abstract class DomainError extends Error {
  constructor(message: string, readonly code: string, readonly field?: string) {
    super(message);
  }
}
export class InvalidCodeError extends DomainError {
  constructor() { super('El código debe ser numérico', 'INVALID_CODE', 'code'); }
}
export class InvalidLengthError extends DomainError {
  constructor() { super('El código debe tener 1, 2, 4 o 6 dígitos', 'INVALID_LENGTH', 'code'); }
}
export class DuplicateCodeError extends DomainError {
  constructor(code: string) { super(`Ya existe la cuenta ${code}`, 'DUPLICATE_CODE', 'code'); }
}
export class ParentNotFoundError extends DomainError {
  constructor(parent: string) { super(`No existe la cuenta padre ${parent}`, 'PARENT_NOT_FOUND', 'code'); }
}
export class NatureRequiredError extends DomainError {
  constructor() { super('Las clases requieren naturaleza', 'NATURE_REQUIRED', 'nature'); }
}
export class EmptyNameError extends DomainError {
  constructor() { super('El nombre es obligatorio', 'EMPTY_NAME', 'name'); }
}
export class AccountNotFoundError extends DomainError {
  constructor(code: string) { super(`No existe la cuenta ${code}`, 'ACCOUNT_NOT_FOUND'); }
}
export class AccountHasChildrenError extends DomainError {
  constructor(code: string) { super(`La cuenta ${code} tiene cuentas hijas`, 'HAS_CHILDREN'); }
}