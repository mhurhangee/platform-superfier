'use client'

import { useState, useMemo, useEffect } from 'react'

/**
 * Custom hook for searching and filtering items
 * @param items Array of items to search through
 * @param searchKey Key of the item to search in
 * @param initialQuery Initial search query
 * @returns Object with filtered items and search state
 */
export function useSearch<T extends Record<K, any>, K extends keyof T>(
  items: T[],
  searchKey: K,
  initialQuery: string = ''
) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [page, setPage] = useState(1)

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items

    return items.filter((item) => {
      const value = String(item[searchKey]).toLowerCase()
      return value.includes(searchQuery.toLowerCase())
    })
  }, [items, searchKey, searchQuery])

  // Paginate results
  const paginateResults = (itemsPerPage: number) => {
    return {
      paginatedItems: filteredItems.slice(0, page * itemsPerPage),
      hasMore: filteredItems.length > page * itemsPerPage,
      loadMore: () => setPage((prev) => prev + 1),
      resetPagination: () => setPage(1),
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    paginateResults,
    resetSearch: () => {
      setSearchQuery('')
      setPage(1)
    },
  }
}
