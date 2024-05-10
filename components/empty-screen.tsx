import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Vivum
        </h1>
        <p className="leading-normal text-muted-foreground">
          Vivum AI is a sophisticated tool tailored for bio-medical research, offering users access to authenticated literature sourced directly from PubMed. With its advanced algorithms and database integration, Vivum AI delivers accurate and reliable answers to a wide range of medical inquiries.
        </p>
      </div>
    </div>
  )
}
