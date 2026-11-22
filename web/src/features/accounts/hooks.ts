import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountsApi } from './api'

const TREE_KEY = ['accounts', 'tree']

export function useAccountTree() {
  return useQuery({ queryKey: TREE_KEY, queryFn: accountsApi.tree })
}

export function useCreateAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: TREE_KEY }),
  })
}

export function useDeleteAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: accountsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: TREE_KEY }),
  })
}