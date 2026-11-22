import { useState } from 'react'
import { AccountForm } from './features/accounts/components/AccountForm'
import { AccountTree } from './features/accounts/components/AccountTree'
import { ConfirmDialog } from './features/accounts/components/ConfirmDialog'
import { useAccountTree, useDeleteAccount } from './features/accounts/hooks'
import type { AccountNode } from './features/accounts/types'

export default function App() {
  const tree = useAccountTree()
  const remove = useDeleteAccount()
  const [toDelete, setToDelete] = useState<AccountNode | null>(null)
  const [prefill, setPrefill] = useState({ code: '', key: 0 })

  function closeDialog() {
    setToDelete(null)
    remove.reset()
  }

  function confirmDelete() {
    if (!toDelete) return
    remove.mutate(toDelete.code, { onSuccess: closeDialog })
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Catálogo de cuentas</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <section aria-label="Árbol del catálogo" className="rounded-lg border border-slate-200 p-4">
          {tree.isPending && <p className="text-sm text-slate-500">Cargando catálogo…</p>}
          {tree.isError && (
            <div role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
              <p>{tree.error.message}</p>
              <button type="button" onClick={() => tree.refetch()} className="mt-2 underline">
                Reintentar
              </button>
            </div>
          )}
          {tree.isSuccess && (
            <AccountTree
              nodes={tree.data}
              onDelete={setToDelete}
              onAddChild={(n) => setPrefill((p) => ({ code: n.code, key: p.key + 1 }))}
            />
          )}
        </section>

        <aside className="rounded-lg border border-slate-200 p-4">
          <h2 className="mb-3 font-medium">Nueva cuenta</h2>
          <AccountForm key={prefill.key} initialCode={prefill.code} />
        </aside>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Eliminar cuenta"
          message={`¿Eliminar la cuenta ${toDelete.code} — ${toDelete.name}?`}
          error={remove.error?.message}
          pending={remove.isPending}
          onConfirm={confirmDelete}
          onCancel={closeDialog}
        />
      )}
    </main>
  )
}