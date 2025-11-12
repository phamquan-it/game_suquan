import { configureStore } from '@reduxjs/toolkit'
import { adminApi } from './services/adminApi'

export const makeStore = () => {
    return configureStore({
        reducer: {
            [adminApi.reducerPath]: adminApi.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(adminApi.middleware),
    })
}


// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
// Infer the `RootState` and `AppDispatch` types from the store itself
// Infer the `RootState` and `AppDispatch` types from the store itself
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
