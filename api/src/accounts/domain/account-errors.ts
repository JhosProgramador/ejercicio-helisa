export class EmptyNameError extends DomainError {
  constructor() { super('El nombre es obligatorio', 'EMPTY_NAME', 'name'); }
}