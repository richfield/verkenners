import axios from "axios";

// src/services/authService.ts
export const isTokenValid = async (accessToken: string): Promise<boolean> => {
   try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.status === 200; // Als de status 200 is, is het token geldig
  } catch (error) {
    return false;
  }
};
