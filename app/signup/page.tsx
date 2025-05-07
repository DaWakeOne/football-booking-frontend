import dynamic from "next/dynamic"

const SignupPageContent = dynamic(() => import("@/components/signup/signup-page-content"), {
  ssr: false,
})

export default function SignupPage() {
  return <SignupPageContent />
}
