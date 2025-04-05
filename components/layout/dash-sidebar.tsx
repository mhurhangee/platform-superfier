'use client'

import * as React from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { UserButton } from '@/components/layout/user-button'
import { OrganizationSwitcher } from '@/components/layout/organization-switcher'
import { ChatSidebar } from '@/components/chat/sidebar'
import { ChatMain } from '@/components/chat/main'

import { AnswersSidebar } from '@/app/dash/(answers)/components/sidebar'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { Bot, Flame, MessageCircleQuestion } from 'lucide-react'

const data = {
  navMain: [
    {
      title: 'Superfier',
      url: '/dash',
      icon: Flame,
      sidebarTitle: (
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 inline-block" /> Superfier
        </div>
      ),
      sidebarContent: <div>Welcome to Superfier!</div>,
    },
    {
      title: 'Answers',
      url: '/dash/answers',
      icon: MessageCircleQuestion,
      sidebarTitle: (
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="w-4 h-4 inline-block" /> Answers
        </div>
      ),
      sidebarContent: <AnswersSidebar />,
    },
    {
      title: 'Chat',
      url: '/dash/chat',
      icon: Bot,
      sidebarTitle: <ChatSidebar />,
      sidebarContent: <ChatMain />,
    },
  ],
}

export function DashSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <OrganizationSwitcher />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        router.push(item.url)
                      }}
                      isActive={pathname.startsWith(item.url)}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserButton />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {data.navMain.find((item) => item.url === pathname)?.sidebarTitle}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <div className="p-4">
                {data.navMain.find((item) => item.url === pathname)?.sidebarContent}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
