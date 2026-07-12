import { Route, Routes } from "react-router-dom"
import LoginPage from "../../features/login/pages/LoginPage"

function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
        </Routes>
    )
}

export default AuthRoutes