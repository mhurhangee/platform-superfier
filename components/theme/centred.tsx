import { ReactNode } from 'react'

export async function Centred({
  icon,
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  icon?: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <main className="container flex h-full flex-col items-center mx-auto justify-center max-w-3xl text-center gap-6">
      <h1 className="text-5xl font-bold tracking-tighter">
        {icon}
        {title}
      </h1>

      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}

      <div className="w-full max-w-3xl p-4 flex justify-center">{children}</div>
    </main>
  )
}
