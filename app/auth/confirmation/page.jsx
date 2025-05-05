export default function ConfirmationPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-4 text-2xl font-bold">Email Confirmed</h1>
        <p className="mb-6">Your email has been confirmed successfully.</p>
        <a href="/" className="text-blue-600 hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  )
}
