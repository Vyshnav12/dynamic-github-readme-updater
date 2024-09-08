const axios = require('axios');
const fs = require('fs');

// Load your Spotify credentials from environment variables set in GitHub Actions
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
    return response.data.access_token;
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
      const songInfo = `💽 My current favorite song is **[${track.name} - ${track.artists[0].name}](${track.external_urls.spotify})**\n`;

      // Read the existing README file
      const readmePath = 'README.md';
      let readmeContent = '';
      if (fs.existsSync(readmePath)) {
        readmeContent = fs.readFileSync(readmePath, 'utf8');
      }

      // Check if the song info already exists in the file
      const songInfoRegex = /💽 My current favorite song is \[.*?\]\(.*?\)\n/;
      const newContent = songInfoRegex.test(readmeContent)
        ? readmeContent.replace(songInfoRegex, songInfo) // Update the existing line
        : readmeContent + songInfo; // Append if it doesn't exist

      // Write the updated content back to the README file
      fs.writeFileSync(readmePath, newContent, 'utf8');
      console.log('Updated README.md with the new top track:', track.name);
    }
  } catch (error) {
    console.error('Error fetching top track:', error);
  }
}

// Run the function to update the README with the most played song
getTopTrack();
