const axios = require('axios');
const fs = require('fs');
require('dotenv').config();  // To load environment variables from a .env file

// Load your Spotify credentials from environment variables
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

// Function to get a new access token using the refresh token
async function getSpotifyAccessToken() {
  const url = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const data = new URLSearchParams({
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken,
  });

  try {
    const response = await axios.post(url, data.toString(), { headers });
    const accessToken = response.data.access_token;

    // Return the new access token
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}

// Function to get the most played song from Spotify
async function getTopTrack() {
  const accessToken = await getSpotifyAccessToken();
  
  if (!accessToken) {
    console.error('No access token available');
    return;
  }

  const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const track = response.data.items[0];

    if (track) {
      const songInfo = `💽 My current favorite song is **[${track.name} - ${track.artists[0].name}](${track.external_urls.spotify})**`;
      
      // Update the README file with the new song
      fs.writeFileSync('README.md', songInfo);
      console.log('Updated README.md with the new top track:', track.name);
    }
  } catch (error) {
    console.error('Error fetching top track:', error);
  }
}

// Run the function to update the README with the most played song
getTopTrack();
    