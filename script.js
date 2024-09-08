const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

/**
 * Makes a POST request to the Spotify token endpoint to get a new access
 * token, given the provided refresh token.
 *
 * @returns {Promise<string>} A new access token to be used for subsequent
 *   requests to the Spotify Web API.
 * @throws {Error} If there is an error refreshing the access token.
 */
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

/**
 * Makes a GET request to the Spotify Web API to get the top track from the
 * authenticated user's account, given the provided access token.
 *
 * @param {string} accessToken - A valid Spotify access token.
 *
 * @returns {Promise<object>} The user's top track, or throws an error if the
 *   request fails.
 * @throws {Error} If there is an error fetching the top track.
 */
async function getTopTrack(accessToken) {
  const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=2';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.items[1];
  } catch (error) {
    console.error('Error fetching top track:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Updates the user's README with the provided top track.
 *
 * @param {object} track - The user's top track, as returned by the Spotify Web API.
 *
 * @returns {Promise<boolean>} true if the README was updated, or false if no update was necessary.
 * @throws {Error} If there is an error updating the README.
 */
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


/**
 * Main entry point for the script.
 *
 * This function first fetches an access token, then uses it to fetch the user's top
 * track. If a top track is found, it then updates the user's README with this
 * information. If no top track is found, or if there is an error along the way, an
 * appropriate error message is logged to the console.
 */
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