export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to ActiModo</h1>
      <p className="text-xl mb-8">Your football field booking platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <a href="/minimal-login" className="p-6 border rounded-lg hover:bg-gray-100 transition-colors">
          <h2 className="text-2xl font-semibold mb-2">Login</h2>
          <p>Access your account</p>
        </a>

        <a href="/minimal-signup" className="p-6 border rounded-lg hover:bg-gray-100 transition-colors">
          <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
          <p>Create a new account</p>
        </a>
      </div>
    </div>
  )
}
