## Next Notes

Build a basic note-taking app with Next.js and Pocketbase. 

### Setup

1. Create a new Next.js app:
`npx create-next-app@latest --ts`

2. Download Pocketbase from [pocketbase.io](pocketbase.io)
3. Navigate to the unzipped directory
`cd pocketbase_0.26.6`
4. Start Pocketbase:
`./pocketbase serve`
5. Open the [Admin UI](http://127.0.0.1:8090/_/), create collection, and update security rules to allow read/write access. 
6. Add `experimental: { appDir: true }` to `next.config.js`
