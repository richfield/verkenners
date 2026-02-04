import { GoogleOAuthProvider } from '@react-oauth/google';

export const GoogleOAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log({env: import.meta.env})
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};
