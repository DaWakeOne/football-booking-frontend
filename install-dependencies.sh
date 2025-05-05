# Check if Next.js is installed
if ! pnpm list next > /dev/null 2>&1; then
  echo "Installing Next.js..."
  pnpm install next
fi

# Install Supabase auth helpers
echo "Installing Supabase auth helpers..."
pnpm install @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
