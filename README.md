# Two Chrome Extensions for language learning with Wikipedia Integration

This repository contains two complementary Chrome Extensions developed as part of a master's thesis project focused on active vs. passive vocabulary acquisition through personalized content. The "Fetch extension" leverages user behavior (searches, browsing activity) to suggest relevant vocabulary and enhance learning through Wikipedia-based context, whereas the "Search extension" allows the user to search for vocabulary themselves while browsing. Please pick the branch "app-search-only" or "app-fetch only" to pick one of the extensions.

## 📦 Extensions Overview

### 🔍 Search Vocab
**Description:**  
Search Vocab allows users to type in and translate words into their target language and provides contextual learning by fetching related information from Wikipedia articles.

**Features:**
- Manual word input and translation using the DeepL API
- Contextual Wikipedia suggestions using the Wikipedia API
- Chrome Extension popup interface on the right browser side

### 🌐 Fetch Vocab
**Description:**  
Fetch Vocab passively collects keywords from Google searches and website headlines. These are translated and linked to relevant Wikipedia content to support natural vocabulary acquisition.

**Features:**
- Passive collection of vocabulary based on browsing behavior
- Automated translation with DeepL
- Wikipedia article linking for context using Wikipedia API

## 🛠 Technologies Used
- **Frontend:** JavaScript, HTML, CSS (Chrome Extensions with React.js)
- **Backend (per branch):** Node.js, Express.js
- **APIs:**
  - Wikipedia API
  - DeepL API

> Note:  
> Each extension branch (`search-vocab` and `fetch-vocab`) includes its **own backend implementation** for independent development and testing. Although both use the same tech stack, they are maintained separately.

##  Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/IrMel3/chrome-extension-wiki.git
   cd chrome-extension-wiki

2. Switch to the desired branch:
    ```bash
    git checkout app-search-only   # or app-fetch-only

3. Follow the installation instructions in the corresponding README of that branch.

## 📂 Folder Structure

    ```bash
    |-- app-fetch-only/       # Fetch Vocab extension + backend
    |-- app-search-only/      # Search Vocab extension + backend

## 📄 License

MIT License

## 👤 Author

IrMel3

## 🙏 Acknowledgments

Thanks to Fiona as well as everyone who took part in my study & focus group.


