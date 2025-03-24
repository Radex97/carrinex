import authRoute from './authRoute'
import otherRoute from './otherRoute'

export { protectedRoutes } from './routes.config'
export { publicRoutes } from './routes.config'

export const authRoutes = {
    ...authRoute,
}
