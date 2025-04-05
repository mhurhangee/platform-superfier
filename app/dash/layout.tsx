import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { DashSidebar } from '@/components/layout/dash-sidebar'

export default function OrgsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="absolute left-2 top-2" />
          </TooltipTrigger>
          <TooltipContent>Sidebar</TooltipContent>
        </Tooltip>
        {children}
      </SidebarInset>
    </>
  )
}
