// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://esnppqpkslcdchhhodyc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbnBwcXBrc2xjZGNoaGhvZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg5MjgsImV4cCI6MjA1MTU3NDkyOH0.1m1lIXyRKSnZ4MBXdpMHfJHJOpvWxhUk9l1Z1FV9jwY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);