import { Routes as RouterRoutes, Route } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Home } from '../modules/home/Home'
import { Study } from '../modules/study/Study'
import { Library } from '../modules/library/Library'
import { Build } from '../modules/build/Build'
import { Settings } from '../modules/settings/Settings'

export function Routes() {
  return (
    <Layout>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/library" element={<Library />} />
        <Route path="/build" element={<Build />} />
        <Route path="/settings" element={<Settings />} />
      </RouterRoutes>
    </Layout>
  )
}
