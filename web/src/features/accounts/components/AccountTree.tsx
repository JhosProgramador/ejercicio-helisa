import { useState } from 'react'
import type { AccountNode } from '../types'

interface Props {
  nodes: AccountNode[]
  onDelete: (node: AccountNode) => void
}

const NATURE_LABEL = { DEBIT: 'Débito', CREDIT: 'Crédito' } as const

function NodeRow({ node, onDelete }: { node: AccountNode; onDelete: Props['onDelete'] }) {
  const [open, setOpen] = useState(node.level === 'Clase')
  const hasChildren = node.children.length > 0

  return (
    <li>
      <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-slate-50">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={!hasChildren}
          aria-expanded={hasChildren ? open : undefined}
          aria-label={open ? `Colapsar ${node.code}` : `Expandir ${node.code}`}
          className="w-5 text-slate-500 disabled:opacity-30"
        >
          {hasChildren ? (open ? '▾' : '▸') : '•'}
        </button>
        <span className="font-mono text-sm text-slate-500">{node.code}</span>
        <span className="flex-1 text-sm">{node.name}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{node.level}</span>
        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
          {NATURE_LABEL[node.nature]}
        </span>
        <button
          type="button"
          onClick={() => onDelete(node)}
          aria-label={`Eliminar ${node.code}`}
          className="text-xs text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
      {hasChildren && open && (
        <ul className="ml-5 border-l border-slate-200 pl-2">
          {node.children.map((child) => (
            <NodeRow key={child.code} node={child} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function AccountTree({ nodes, onDelete }: Props) {
  if (nodes.length === 0) {
    return <p className="text-sm text-slate-500">El catálogo está vacío. Crea una clase para empezar.</p>
  }
  return (
    <ul>
      {nodes.map((n) => (
        <NodeRow key={n.code} node={n} onDelete={onDelete} />
      ))}
    </ul>
  )
}