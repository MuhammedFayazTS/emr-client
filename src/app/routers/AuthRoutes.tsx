import { Route } from "react-router-dom"
import { lazy } from "react"

const LoginPage = lazy(()=>import("@features/auth/pages/LoginPage"))

function AuthRoutes() {
    return (
        <>
            <Route path="/login" element={<LoginPage />} />
        </>
    )
}

export default AuthRoutes