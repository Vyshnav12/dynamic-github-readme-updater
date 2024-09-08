# Dynamic Github README Updater

![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
[![Actions Status](https://github.com/Vyshnav12/dynamic-github-readme-updater/workflows/Update%20Spotify%20Top%20Track/badge.svg)](https://github.com/Vyshnav12/dynamic-github-readme-updater/actions)
![License](https://img.shields.io/github/license/Vyshnav12/dynamic-github-readme-updater)
![Version](https://img.shields.io/github/v/release/Vyshnav12/dynamic-github-readme-updater)
![Issues](https://img.shields.io/github/issues/Vyshnav12/dynamic-github-readme-updater)

This project automatically updates your GitHub profile README with dynamic content fetched from various APIs. While initially designed for Spotify, it can be easily adapted to work with any API of your choice.

## 🎵 How it works

The script fetches data from a specified API and updates a targeted line in your GitHub profile README. By default, it's set up to work with Spotify, updating your current favorite song, but it can be customized for various use cases. 

###Default:
```markdown
💽 My current favorite song is **[Song Name - Artist Name](Spotify URL)**
```

## 🚀 Setup

1. Clone this repository:
   ```
   git clone https://github.com/Vyshnav12/dynamic-github-readme-updater.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Spotify Developer account and create an app to get your Client ID and Client Secret.

4. Get your Spotify Refresh Token (you can use the [Spotify OAuth Tool](https://github.com/bih/spotify-ruby/blob/master/bin/oauth) or a similar method).

5. Set up GitHub Actions in your profile repository (the one with your README).

6. Add the following secrets to your GitHub repository:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
   - `PAT` (This is your personal access token from github settings)

## 📋 Usage

1. Ensure your profile README contains a line in the format mentioned above.

2. The GitHub Action will run on a schedule (default: daily) or can be manually triggered.

3. To run locally for testing:
   ```
   node script.js
   ```

## 🛠 Customization

This script is designed to work with a specific format in your README, but it can be easily adapted for different use cases. Here's how to customize it:

### Modifying the script for different content:

1. Open `script.js` in your favorite text editor.

2. Locate the `updateReadme` function. Within this function, find these two lines:

   ```javascript
   const songInfo = ` 💽 My current favorite song is **[${track.name} - ${track.artists[0].name}](${track.external_urls.spotify})**`;
   const songInfoRegex = /💽 My current favorite song is \*\*\[.*?\]\(.*?\)\*\*/;
   ```

3. Update `songInfo` to match your desired output format. For example, if you want to display your top artist instead of a song, you might change it to:

   ```javascript
   const artistInfo = ` 🎨 My current favorite artist is **[${artist.name}](${artist.external_urls.spotify})**`;
   ```

4. Modify `songInfoRegex` to match the existing line in your README that you want to replace. The regex should match the entire line. For the artist example above, it might look like:

   ```javascript
   const artistInfoRegex = /🎨 My current favorite artist is \*\*\[.*?\]\(.*?\)\*\*/;
   ```

5. Update the variable names and function logic accordingly throughout the script.

### Adjusting the GitHub Actions workflow:

1. Open `.github/workflows/update-song.yml` in your text editor.

2. Locate the `Checkout profile repository` step:

   ```yaml
   - name: Checkout profile repository
     uses: actions/checkout@v3
     with:
       repository: Vyshnav12/Vyshnav12
       token: ${{ secrets.PAT }}
   ```

3. Replace `Vyshnav12/Vyshnav12` with the path to your own GitHub profile repository (e.g., `YourUsername/YourUsername`).

4. Find the step that clones this updater repository:

   ```yaml
   - name: Clone dynamic-github-readme-updater repository
     uses: actions/checkout@v3
     with:
       repository: Vyshnav12/dynamic-github-readme-updater
       path: updater
   ```

5. Replace `Vyshnav12/dynamic-github-readme-updater` with the path to your forked version of this repository (e.g., `YourUsername/dynamic-github-readme-updater`).

6. If you've renamed any files or changed the repository structure, make sure to update the relevant paths in the workflow file.

### Testing your changes:

After making these modifications:

1. Run the script locally to test:
   ```
   node script.js
   ```
2. Check your README file to ensure the correct line is being updated.
3. Commit and push your changes to both repositories (your profile repo and the forked updater repo).
4. Manually trigger the GitHub Action in your profile repository to test the entire workflow.

Remember, you can customize this script to update any single line in your README with any desired content from Spotify or other sources, as long as you adjust the API calls and formatting logic accordingly.

## 🤝 Contributing

Feel free to fork this project and adapt it to your needs. If you make improvements that could benefit others, please consider submitting a pull request!

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- Spotify Web API
- GitHub Actions

---

Happy coding and enjoy your music! 🎶