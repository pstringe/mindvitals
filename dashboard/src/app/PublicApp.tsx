import { Routes, Route, Navigate } from 'react-router-dom'
import { ForgotPassword } from 'containers/auth/ForgotPassword'
import { Login } from 'containers/auth/Login'
import { ResetPassword } from 'containers/auth/ResetPassword';

export const PublicApp = () => (
  <Routes>
    <Route path="/" element={<Navigate replace to="/login" />} />
    <Route path="patients" element={<Navigate replace to='/login' />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />}/>
    <Route path="/reset-password/:email/:token" element={<ResetPassword />}/>
  </Routes>
)
