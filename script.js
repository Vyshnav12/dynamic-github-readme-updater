const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

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
    console.error('Error refreshing access token:', error.response?.data || error.message);
    throw error;
  }
}

async function getTopTrack(accessToken) {
  const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching top track:', error.response?.data || error.message);
    throw error;
  }
}

async function updateReadme(track) {
  const songInfo = ` 💽 My current favorite song is **[${track.name} - ${track.artists[0].name}](${track.external_urls.spotify})**`;
  const readmePath = path.join(process.cwd(), 'README.md');

  try {
    let readmeContent = await fs.readFile(readmePath, 'utf8');
    const songInfoRegex = /💽 My current favorite song is \*\*\[.*?\]\(.*?\)\*\*/;
    
    if (songInfoRegex.test(readmeContent)) {
      const newContent = readmeContent.replace(songInfoRegex, songInfo.trim());
      await fs.writeFile(readmePath, newContent, 'utf8');
      console.log('Updated README.md with the new top track:', track.name);
      return true; // Indicates that a change was made
    } else {
      console.log('No existing song info found in README. No changes made.');
      return false; // Indicates that no change was made
    }
  } catch (error) {
    console.error('Error updating README:', error.message);
    throw error;
  }
}

async function main() {
  try {
    const accessToken = await getSpotifyAccessToken();
    const track = await getTopTrack(accessToken);
    if (track) {
      const updated = await updateReadme(track);
      if (updated) {
        console.log('README updated successfully.');
      } else {
        console.log('No update was necessary.');
      }
    } else {
      console.log('No top track found');
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

main();