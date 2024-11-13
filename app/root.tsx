import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'
import { Container } from '~/components/container'
import { PyramidIcon } from 'lucide-react'

import './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Budget Wise" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function Header() {
  return (
    <Container>
      <div className="flex items-center gap-x-2">
        <Link to="/" className="flex w-fit items-center gap-2">
          <PyramidIcon
            className="size-8"
            aria-hidden="true"
            aria-label="Budget Wise Logo"
          />
          <div>
            <h1 className="font-black">Budget Wise</h1>
            <p className="text-muted-foreground -mt-1 text-sm">
              ERP for project expense monitoring
            </p>
          </div>
        </Link>
      </div>
    </Container>
  )
}

export default function App() {
  return (
    <div className="py-8">
      <Header />
      <Outlet />
    </div>
  )
}

export function HydrateFallback() {
  return null
}
