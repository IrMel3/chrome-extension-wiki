# Search Vocab - Quick Start

This Chrome Extension lets you translate vocabulary into your target language.
The translated word fetches Wikipedia articles that might be interesting to you.

To build the extension navigate to chrome-ex and run:
```
npm run build
```

Then go to Chrome Browser/ Extensions and enable Developer Mode. After that go to "load unpacked" and pick the build folder that was created from the extension. You should now see the extension box in your installed extensions.


# Search Vocab – Active Vocabulary Chrome Extension - More Info


**Search Vocab** is a Chrome Extension that allows users to translate selected words into their target language and explore relevant Wikipedia articles for contextual learning while browsing the web.

## ✨ Features
- Manual word input via search bar
- Translations by DeepL
- Wikipedia article suggestions for contextual learning

## 🧠 How It Works
1. Enter or highlight a word
2. Translate it via DeepL
3. Explore related Wikipedia articles for deeper learning
4. Save your desired vocabulary in your favourites

## 🚀 Installation

1. Clone this branch:
   ```bash
   git clone -b app-search-only https://github.com/IrMel3/chrome-extension-wiki.git
   cd chrome-extension-wiki/app-search-only/chrome-ex

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






