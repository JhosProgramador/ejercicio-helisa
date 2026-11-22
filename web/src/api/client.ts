const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  code: string
  field: string | null
  status: number

  constructor(message: string, code: string, field: string | null, status: number) {
    super(message)
    this.code = code
    this.field = field
    this.status = status
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 'NETWORK_ERROR', null, 0)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(
      body?.message ?? 'Error inesperado del servidor',
      body?.code ?? 'UNKNOWN',
      body?.field ?? null,
      res.status,
    )
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}