import * as React from 'react'
import Link from 'next/link'

// import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import Image from 'next/image';
import { Button } from '@/components/ui/button'
// import {
//   // IconGitHub,

//   IconSeparator,
//   // IconVercel
// } from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import logo from '@/public/profile.png'
import logo2 from '@/public/default.png'
async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <Image src={logo} alt="Description of your image" width={100} height={100} />
          {/* <IconNextChat className="size-6 mr-2 dark:hidden" inverted /> */}
          {/* <IconNextChat className="hidden size-6 mr-2 dark:block" /> */}
        </Link>
      )}
      <div className="flex items-center">
        {session?.user ? (
          <div>
        {/* <IconSeparator className="size-6 text-muted-foreground/50" /> */}

          <UserMenu user={session.user} />
          </div>
        ) : (
          <div className='pr-5'>
          <Button  asChild className="-ml-2">
            <Link href="/login">Login</Link>
          </Button>
          </div>
        )}  
            <div className='pr-2'>
              <Image src={logo2} alt="Description of your image" width={55} height={55} />
            </div>
      </div>
      {/* <Image src={logo2} alt="Description of your image" width={50} height={50} /> */}
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center w-full justify-between">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>

    </header>
  )
}
