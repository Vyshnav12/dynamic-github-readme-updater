# Spotify GitHub README Updater

This project automatically updates your GitHub profile README with your current favorite song from Spotify. It's designed to work with a specific style of README, but can be easily modified to suit different needs.

## 🎵 How it works

The script fetches your top track from Spotify's API and updates a specific line in your GitHub profile README. By default, it looks for and replaces a line matching this format:

```markdown
💽 My current favorite song is **[Song Name - Artist Name](Spotify URL)**
```

## 🚀 Setup

1. Clone this repository:
   ```
   git clone https://github.com/YourUsername/spotify-github-readme-updater.git
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

## 📋 Usage

1. Ensure your profile README contains a line in the format mentioned above.

2. The GitHub Action will run daily (or on manual trigger) to update your README.

3. To run locally for testing:
   ```
   node script.js
   ```

## 🛠 Customization

To modify the script for a different use case:

1. In `script.js`, update the `songInfoRegex` and `songInfo` variables to match your desired format.

2. Adjust the GitHub Action workflow file (`update-song.yml`) if necessary.

## 🤝 Contributing

Feel free to fork this project and adapt it to your needs. If you make improvements that could benefit others, please consider submitting a pull request!

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- Spotify Web API
- GitHub Actions

---

Happy coding and enjoy your music! 🎶