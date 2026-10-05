import { lazy, Suspense } from 'react'
import { useLocation } from './hooks/useClient'
import { TranslationProvider } from './contexts/TranslationProvider'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'

const TicketSideBar = lazy(() => import('./locations/TicketSideBar'))
const TopBar = lazy(() => import('./locations/TopBar'))
const Modal = lazy(() => import('./locations/Modal'))
const UserSideBar = lazy(() => import('./locations/UserSideBar'))

const LOCATIONS = {
  ticket_sidebar: TicketSideBar,
  modal: Modal,
  top_bar: TopBar,
  user_sidebar: UserSideBar,
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
