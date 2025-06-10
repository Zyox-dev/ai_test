// auth.js
import { supabase } from './supabase.js'

const testOtps = ["123456", "654321", "111111", "999999"]

// Send OTP
export async function sendOtp(email) {
  const otp = testOtps[Math.floor(Math.random() * testOtps.length)]
  await supabase.from('otps').insert({ email, otp })
  return otp
}

// Verify OTP
export async function verifyOtp(email, inputOtp) {
  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('otp', inputOtp)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || data.length === 0) return false

  const { error: authErr } = await supabase.auth.signInWithOtp({ email })
  return !authErr
}

// Check session
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Logout
export function logout() {
  supabase.auth.signOut()
}
