import { lazy, Suspense } from 'react'
import { useLocation } from './hooks/useClient'
import { TranslationProvider } from './contexts/TranslationProvider'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'

const TicketSideBar = lazy(() => import('./locations/TicketSideBar'))
const TopBar = lazy(() => import('./locations/TopBar'))
const Modal = lazy(() => import('./locations/Modal'))
const UserSideBar = lazy(() => import('./locations/UserSideBar'))
const NavBar = lazy(() => import('./locations/NavBar'))
const NewTicketSideBar = lazy(() => import('./locations/NewTicketSideBar'))
const OrganizationSideBar = lazy(() => import('./locations/OrganizationSideBar'))

const LOCATIONS = {
  ticket_sidebar: TicketSideBar,
  modal: Modal,
  top_bar: TopBar,
  user_sidebar: UserSideBar,
  nav_bar: NavBar,
  new_ticket_sidebar: NewTicketSideBar,
  organization_sidebar: OrganizationSideBar,
  default: () => null
}

function App() {
  const location = useLocation()
  const Location = LOCATIONS[location] || LOCATIONS.default

  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME }}>
      <TranslationProvider>
        <Suspense fallback={<span>Loading...</span>}>
          <Location />
        </Suspense>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default App
