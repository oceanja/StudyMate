import { supabase } from "./supabaseClient";

// Sign Up with Email and Password
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Login with Email and Password
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Logout
export async function logout() {
  await supabase.auth.signOut();
}
