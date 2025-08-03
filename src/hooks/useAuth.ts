import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import { profileService } from '../lib/services';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
              } catch (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
          }
        }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    // Fallback: if loading takes too long, force it to false
    const fallbackTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 15000); // 15 second fallback

    return () => {
      clearTimeout(fallbackTimeout);
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 10000); // 10 second timeout
    });
    
    try {
      console.log('🔄 Fetching profile for user:', userId);
      const fetchPromise = profileService.getProfile(userId);

      const data = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (data) {
        console.log('✅ Profile found:', data);
        setProfile(data);
      } else {
        // Profile doesn't exist, create one
        console.log('📝 Creating new profile for user:', userId);
        try {
          const newProfile = await profileService.createProfile({
            user_id: userId,
            email: user?.email || '',
            full_name: user?.user_metadata?.full_name || ''
          });
          console.log('✅ Profile created successfully:', newProfile);
          setProfile(newProfile);
        } catch (createError) {
          console.error('❌ Error creating profile:', createError);
          // Don't throw error - just log it and continue without profile
          // This prevents the entire auth flow from failing
        }
      }
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);
      // Don't throw error - just log it and continue without profile
      // This prevents the entire auth flow from failing
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔄 Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        return { data, error };
      }
      
      if (data.user) {
        console.log('✅ Sign in successful for user:', data.user.id);
        
        // Try to fetch profile for the signed-in user
        try {
          await fetchProfile(data.user.id);
        } catch (profileError) {
          console.error('⚠️ Profile fetch failed, but sign in succeeded:', profileError);
          // Don't fail the sign in if profile fetch fails
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('💥 Unexpected sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      console.log('🔄 Starting signup process...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error('❌ Signup error:', error);
        return { data, error };
      }
      
      if (data.user) {
        console.log('✅ User created successfully:', data.user.id);
        
        // Try to create profile manually if user was created
        try {
          console.log('📝 Creating profile for new user...');
          const profile = await profileService.createProfile({
            user_id: data.user.id,
            email: email,
            full_name: fullName || ''
          });
          console.log('✅ Profile created successfully:', profile);
          setProfile(profile);
        } catch (profileError) {
          console.error('⚠️ Profile creation failed, but signup succeeded:', profileError);
          // Don't fail the signup if profile creation fails
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('💥 Unexpected signup error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('🔄 Attempting to sign out...');
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Use a shorter timeout for the sign out call
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timeout')), 5000); // 5 second timeout
      });
      
      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
      
      console.log('📤 Sign out result:', { error });
      
      if (error) {
        console.error('❌ Sign out failed:', error);
        // Don't restore state - just return the error
        return { error };
      } else {
        console.log('✅ Sign out successful');
        return { error: null };
      }
    } catch (error) {
      console.error('💥 Sign out timeout or error:', error);
      // Even if it times out, we've cleared local state, so treat as success
      return { error: null };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };



  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };
}