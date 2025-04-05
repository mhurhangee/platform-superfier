import { Skeleton } from '@/components/ui/skeleton'
import { OrganizationSwitcher as ClerkOrganizationSwitcher } from '@clerk/nextjs'

export function OrganizationSwitcher() {
  return (
    <ClerkOrganizationSwitcher
      hidePersonal={true}
      hideSlug={true}
      appearance={{
        elements: {
          rootBox: 'truncate',
          organizationSwitcherTrigger: `z-0 x-overflow-hidden`,
        },
      }}
      fallback={
        <div className="flex items-center gap-2">
          <Skeleton className="h-full w-full" />
        </div>
      }
    />
  )
}
