import { ThemeProvider } from '@/components/contexts/theme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SavedAnswersProvider } from '@/components/contexts/saved-answers-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider>
        <TooltipProvider>
          <SavedAnswersProvider>
            {children}
            <Toaster richColors />
          </SavedAnswersProvider>
        </TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
