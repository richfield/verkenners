import axios from "axios";

// src/services/authService.ts
export const isTokenValid = async (accessToken: string|null): Promise<boolean> => {
  if (!accessToken)
  {
    return false;
  }
   try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.status === 200; // Als de status 200 is, is het token geldig
  } catch {
    return false;
  }
};
