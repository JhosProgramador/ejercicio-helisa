import { useState } from 'react'
import { ApiError } from '../../../api/client'
import { useCreateAccount } from '../hooks'
import type { Nature } from '../types'

const VALID_LENGTHS = [1, 2, 4, 6]

type Field = 'code' | 'name' | 'nature'

function validate(code: string, name: string, nature: string): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!/^\d+$/.test(code)) errors.code = 'El código debe ser numérico'
  else if (!VALID_LENGTHS.includes(code.length)) errors.code = 'El código debe tener 1, 2, 4 o 6 dígitos'
  if (!name.trim()) errors.name = 'El nombre es obligatorio'
  if (code.length === 1 && !nature) errors.nature = 'Elige la naturaleza de la clase'
  return errors
}

export function AccountForm({ initialCode = '' }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode)
  const [name, setName] = useState('')
  const [nature, setNature] = useState<Nature | ''>('')
  const [clientErrors, setClientErrors] = useState<Partial<Record<Field, string>>>({})
  const create = useCreateAccount()

  const apiError = create.error instanceof ApiError ? create.error : null
  const apiField = (apiError?.field ?? null) as Field | null
  const errorFor = (f: Field) => clientErrors[f] ?? (apiField === f ? apiError?.message : undefined)
  const generalError = create.error && !apiField ? create.error.message : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validate(code, name, nature)
    setClientErrors(errors)
    if (Object.keys(errors).length > 0) return
    create.mutate(
      { code, name: name.trim(), nature: nature || undefined },
      {
        onSuccess: () => {
          setCode('')
          setName('')
          setNature('')
        },
      },
    )
  }

  function clear(f: Field) {
    setClientErrors((prev) => ({ ...prev, [f]: undefined }))
    if (create.error) create.reset()
  }

  const inputClass = (f: Field) =>
    `mt-1 w-full rounded border px-2 py-1.5 text-sm ${errorFor(f) ? 'border-red-500' : 'border-slate-300'}`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label htmlFor="code" className="text-sm font-medium">Código</label>
        <input
            id="code"
            value={code}
            onChange={(e) => { setCode(e.target.value); clear('code') }}
            inputMode="numeric"
            placeholder="Ej: 110505"
            autoFocus={initialCode !== ''}
            aria-invalid={!!errorFor('code')}
            className={inputClass('code')}
            />
        {errorFor('code') && <p role="alert" className="mt-1 text-xs text-red-600">{errorFor('code')}</p>}
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium">Nombre</label>
        <input
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value); clear('name') }}
          aria-invalid={!!errorFor('name')}
          className={inputClass('name')}
        />
        {errorFor('name') && <p role="alert" className="mt-1 text-xs text-red-600">{errorFor('name')}</p>}
      </div>

      {code.length === 1 && (
        <div>
          <label htmlFor="nature" className="text-sm font-medium">Naturaleza</label>
          <select
            id="nature"
            value={nature}
            onChange={(e) => { setNature(e.target.value as Nature | ''); clear('nature') }}
            className={inputClass('nature')}
          >
            <option value="">Selecciona…</option>
            <option value="DEBIT">Débito</option>
            <option value="CREDIT">Crédito</option>
          </select>
          {errorFor('nature') && <p role="alert" className="mt-1 text-xs text-red-600">{errorFor('nature')}</p>}
        </div>
      )}

      {generalError && (
        <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{generalError}</p>
      )}

      <button
        type="submit"
        disabled={create.isPending}
        className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {create.isPending ? 'Creando…' : 'Crear cuenta'}
      </button>
    </form>
  )
}