## Gerardo Attine Database
System for displaying & searching photographs of petri dishes.


### `preconditions`
1. Create a new .env file with firebase environment credentials, as in the .env.example file.
2. Go to YOUR_PROJECT_NAME / functions and create the key.json file, and then copy / paste your credentials obtained from firebase.
3. The images are assumed to be named 00000A__9.jpg

### `To install the application locally from the root of the application:`
- yarn install
- cd functions
- npm install

### `To run the application locally from the root of the application:`
```bash
yarn start
cd functions
npm run-script serve
```

### `To deploy:`
```bash
./deploy-all.sh
```