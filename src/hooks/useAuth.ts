import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export function useAuth() {
  console.log('🔧 useAuth hook initialized');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 useAuth useEffect triggered');
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      console.log('🔍 Starting getInitialSession...');
      try {
        console.log('📡 Calling supabase.auth.getSession()...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📡 Session response:', session);
        
        if (mounted) {
          console.log('✅ Component still mounted, updating state...');
          setSession(session);
          setUser(session?.user ?? null);
          console.log('👤 User set to:', session?.user?.email || 'null');
          
          if (session?.user) {
            console.log('🔍 User found, fetching profile...');
            await fetchProfile(session.user.id);
          } else {
            console.log('❌ No user found, setting loading to false');
            setLoading(false);
          }
        } else {
          console.log('❌ Component unmounted during getInitialSession');
        }
      } catch (error) {
        console.error('💥 Error getting initial session:', error);
        if (mounted) {
          console.log('❌ Setting loading to false due to error');
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log('👂 Setting up auth state change listener...');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, 'Session:', session);
      if (mounted) {
        console.log('✅ Component mounted, updating auth state...');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔍 User in auth change, fetching profile...');
          await fetchProfile(session.user.id);
        } else {
          console.log('❌ No user in auth change, clearing profile and setting loading false');
          setProfile(null);
          setLoading(false);
        }
      } else {
        console.log('❌ Component unmounted during auth state change');
      }
    });

    return () => {
      console.log('🧹 Cleaning up useAuth useEffect');
      mounted = false;
      subscription.unsubscribe();
    };

    // Fallback: if loading takes too long, force it to false
    const fallbackTimeout = setTimeout(() => {
      if (loading) {
        console.log('⚠️ Loading timeout reached, forcing loading to false');
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
    console.log('🔍 fetchProfile called with userId:', userId);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 10000); // 10 second timeout
    });
    
    try {
      console.log('📡 Fetching profile from database...');
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      console.log('📡 Profile fetch response:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profile not found, creating new profile...');
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                user_id: userId,
                email: user?.email,
                full_name: user?.user_metadata?.full_name
              }
            ])
            .select()
            .single();
          
          if (createError) {
            console.error('💥 Error creating profile:', createError);
          } else {
            console.log('✅ New profile created:', newProfile);
            setProfile(newProfile);
          }
        } else {
          console.error('💥 Error fetching profile:', error);
        }
      } else {
        console.log('✅ Setting profile:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('💥 Error in fetchProfile:', error);
    } finally {
      console.log('🏁 fetchProfile finally block - setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
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

  console.log('🔄 useAuth returning state:', { 
    user: user?.email || 'null', 
    session: !!session, 
    profile: !!profile, 
    loading 
  });

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