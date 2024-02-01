# Win24-Team18

Wiki Home Page:
https://github.com/StanfordCS194/Win24-Team18/wiki
Front-End Host URL:
[MusicMingle](https://musicmingle-cabf2.web.app)

# Onboarding:
### Notes:
- Everything is now preconfigured so it should be easy to spin up without hassle
- The project is separated into two subdirectories, `client` (front-end), `server` (back-end)
- Hot reloading (HMR) using the `Vite` bundler for `React` hosted locally at (`http://localhost:5173/`), (fast bundle and compile on file save)
- `Express Node` server uses `Nodemon` to rebuild when files change
- Docker is running three images, front-end, back-end, and db. To access front-end and back-end container terminals, run:  `docker exec -it <image-hash found in docker desktop> sh`. To enter the Postgres database container terminal, change the trailing `sh` to `bash`. Enter the psql shell with: `psql -h db -p 5432 -U postgres -d postgres` with the password `54321`
  - Example for front-end container: `docker exec -it 5addc1785520 sh`
  - Example for db container: `docker exec -it b37a8fcf4b20 bash`
- Data is currently locally stored in a directory called `data` since otherwise, data created will be lost after containers shut down

### Pull repo:
- Make sure you have Docker Desktop [installed]([url](https://www.docker.com/products/docker-desktop/)) 
- Navigate to where you want to place the project
- `git clone https://github.com/StanfordCS194/Win24-Team18.git`
- `cd Win24-Team18`
- Make sure docker desktop application is running
- `docker-compose up --build`
- To stop container:
  - Either:
  - Stop `win24-team18` container in docker desktop application
  -  Or run: `docker container stop win24-team18`

Access the front end application at `http://localhost:5173/`
Backend application found at `http://localhost:3000/` (/api)

### Rules for commits & PRs:
  - For each feature, create a new branch off of main, `git pull origin main` `git checkout -b <feature-name>`
  - After making your changes, push to your new branch, `git add -A`, `git commit -m <commit message>`, `git push -u origin <feature-name>`
  - After pushing, create a new PR (pull request) and attach necessary assignees, summary of changes, and screenshots if applicable, attach PR to an open issue, and tag the PR
