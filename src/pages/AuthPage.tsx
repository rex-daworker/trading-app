import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/missing-password':
      return 'Please enter a password.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    default:
      if (err instanceof Error) {
        return (
          err.message
            .replace(/^Firebase:\s*/i, '')
            .replace(/\s*\(auth\/[^)]+\)\.?$/i, '')
            .trim() || 'Something went wrong.'
        )
      }
      return 'Something went wrong.'
  }
}

function AuthPage() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState<'man' | 'woman'>('man')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900'

  const handleSubmit = async () => {
    setError('')
    if (mode === 'signup') {
      if (!fullName.trim() || !dob || !address.trim()) {
        setError('Please fill in all fields')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
    }
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password, {
          fullName: fullName.trim(),
          dob,
          address: address.trim(),
          avatar,
        })
      }
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold">{mode === 'login' ? 'Log in' : 'Create account'}</h2>

        <div className="mt-4 flex flex-col gap-3">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                Full name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use at least 6 characters.
              </p>
            )}
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  placeholder="Street, city, country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Avatar</label>
                <div className="flex gap-2">
                  {(['man', 'woman'] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                        avatar === a
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={busy}
            className="mt-1 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </div>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setError('')
          }}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
        </button>
      </div>
    </div>
  )
}

export default AuthPage