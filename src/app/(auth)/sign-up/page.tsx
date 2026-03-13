import AuthForm from '@/components/AuthForm'
import { AuthProvider } from '@/lib/AuthContext'

const SignUp = async () => {
  return (
    <section className="w-full max-w-sm md:max-w-3xl">
    <AuthProvider>
      <AuthForm type="sign-up" />
    </AuthProvider>
    </section>
  )
}

export default SignUp