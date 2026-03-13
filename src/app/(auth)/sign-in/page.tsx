'use client'
import AuthForm from '@/components/AuthForm'
import { AuthProvider } from '@/lib/AuthContext'

const SignIn = () => {
  return (
    <section className="w-full max-w-sm md:max-w-3xl">
    <AuthProvider>
      <AuthForm type="sign-in" />
    </AuthProvider>        
    </section>
  )
}

export default SignIn