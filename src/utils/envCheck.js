export const checkEnvironmentVariables = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  console.log("🔍 Environment Variables Check:");
  console.log("REACT_APP_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
  console.log(
    "REACT_APP_SUPABASE_ANON_KEY:",
    supabaseKey ? "✅ Set" : "❌ Missing"
  );

  if (supabaseKey && supabaseKey.length < 100) {
    console.warn(
      "⚠️  Supabase key seems too short. Make sure you copied the complete key."
    );
  }

  if (supabaseUrl && !supabaseUrl.includes("supabase.co")) {
    console.warn(
      '⚠️  Supabase URL doesn\'t look correct. Should contain "supabase.co"'
    );
  }

  return {
    urlSet: !!supabaseUrl,
    keySet: !!supabaseKey,
    urlValid: supabaseUrl?.includes("supabase.co"),
    keyValid: supabaseKey && supabaseKey.length > 100,
  };
};
