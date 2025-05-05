export default function ConfirmationPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Email Confirmed!</h1>
          <p className="mt-2 text-gray-600">Your email has been successfully confirmed. Your account is now active.</p>
        </div>

        <div className="space-y-4 pt-4">
          <a
            href="/login/owner"
            className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
          >
            Login as Field Owner
          </a>
          <a
            href="/"
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  )
}
