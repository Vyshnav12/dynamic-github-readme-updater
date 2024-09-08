const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Spotify API credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

// Get Spotify Access Token
async function getSpotifyToken() {
  const url = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  };
  const data = new URLSearchParams({
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken
  });

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
  }
}

// Fetch most played song in the last 30 days
async function getTopTrack() {
  const token = await getSpotifyToken();
  const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1';
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await axios.get(url, { headers });
    const track = response.data.items[0];
    const songName = track.name;
    const artist = track.artists[0].name;
    const trackUrl = track.external_urls.spotify;
    return { songName, artist, trackUrl };
  } catch (error) {
    console.error('Error fetching top track:', error);
  }
}

// Update GitHub README file
async function updateGithubReadme(songName, artist, trackUrl) {
  const readmeFilePath = path.join(__dirname, 'README.md');
  try {
    let readmeContent = fs.readFileSync(readmeFilePath, 'utf-8');
    const newContent = `💽 My current favorite song is **[${songName} - ${artist}](${trackUrl})**`;
    const updatedContent = readmeContent.replace(/💽 My current favorite song is \*\*.*?\*\*/, newContent);

    fs.writeFileSync(readmeFilePath, updatedContent);
    console.log('GitHub README updated successfully!');
  } catch (error) {
    console.error('Error updating GitHub README:', error);
  }
}

// Main function
(async function() {
  const { songName, artist, trackUrl } = await getTopTrack();
  if (songName && artist && trackUrl) {
    await updateGithubReadme(songName, artist, trackUrl);
  }
})();
