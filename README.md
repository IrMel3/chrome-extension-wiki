# Fetch Vocab - Quick Start

This Chrome Extension fetches words from your Google searches and Headlines from the websites you are
visiting and suggests them to you as vocabulary.
The translated word fetches Wikipedia articles that might be interesting to you.

To build the extension, navigate to chrome-ex and run:

  ```
  npm run build
  ```

Then go to Chrome Browser/ Extensions and enable Developer Mode.
After that go to "load unpacked" and pick the build folder that was created from the extension.
You should now see the extension box in your installed extensions.


# Fetch Vocab – Passive Vocabulary Chrome Extension - More detailed info

**Fetch Vocab** is a Chrome Extension that supports language learning by passively collecting vocabulary from your browsing activity and Headlines from visited Websites and suggesting them to you as vocabulary enhancing it with translated definitions and related Wikipedia content.

## ✨ Features
- Automatically gathers terms from:
  - Google search queries
  - Website titles and headlines
- Translates words using the DeepL API
- Provides Wikipedia article content using Wikipedia API

## 🧠 How It Works
1. As you browse and search, the extension collects candidate keywords.
2. Words are translated using DeepL.
3. Relevant Wikipedia articles are suggested for contextual immersion.
4. You can save interesting vocabulary with it's definition to your favourites.

## 🚀 Installation

1. Clone the `app-fetch-only` branch:
   ```bash
   git clone -b app-fetch-only https://github.com/IrMel3/chrome-extension-wiki.git
   cd chrome-extension-wiki/app-fetch-only/chrome-ex
2. Install dependencies and build the frontend:
   ```bash
   npm install
   npm run build

4. Load the extension in Chrome:
- Open chrome://extensions/
- Enable Developer Mode
- Click "Load unpacked"
- Select the /build folder

## ⚙️ Backend Setup

This branch contains an independent backend built with Node.js and Express.js. that regulates the communication with MongoDB.
Steps:

1. Navigate to the backend directory (if applicable):
    cd backend-server
    npm install
2. Start the backend:
   node index.js

Make sure the extension points to the correct backend endpoint locally.
## 📄 License

MIT License

## 👤 Author

IrMel3





