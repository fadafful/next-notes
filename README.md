## Next Notes

A simple note-taking app built with Next.js 13 (App Router) and PocketBase.

### Features

- User registration and login (PocketBase backend)
- Create, read, update, and delete notes
- Responsive UI

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [PocketBase](https://pocketbase.io/) (latest release for your OS)

### Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Download and set up PocketBase:**
   - Download PocketBase from [pocketbase.io](https://pocketbase.io/)
   - Unzip the downloaded file.
   - Move the PocketBase binary (`pocketbase.exe` for Windows, or the appropriate binary for your OS) to the project root.

3. **Start PocketBase:**
   - On Windows:
     ```sh
     pocketbase.exe serve
     ```
   - On Mac/Linux:
     ```sh
     ./pocketbase serve
     ```

4. **Initialize the database:**
   - Open the [Admin UI](http://127.0.0.1:8090/_/)
   - Create a `notes` collection with the following fields:
     - `title` (type: text)
     - `content` (type: text)
     - Optionally, add `created` and `updated` fields (type: date)
   - Set security rules to allow authenticated users to manage their own notes.

5. **(Optional) Configure environment variables:**
   - Create a `.env.local` file in the project root if needed:
     ```
     POCKETBASE_URL=http://127.0.0.1:8090
     NEXTAUTH_SECRET=your-random-secret
     ```

6. **Run the Next.js development server:**
   ```sh
   npm run dev
   ```

7. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Notes

- Make sure PocketBase is running before starting the Next.js app.
- For production, set strong security rules in PocketBase and use HTTPS.