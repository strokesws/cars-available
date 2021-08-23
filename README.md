# Cars Available

Project loads booking details and cars available.

## Dev Usage

1. Clone the repository.
2. Run `npm install` inside the cloned repository.
3. Run `npm run start-dev` to run webpack-dev-server.
4. Open browser on `http://localhost:8080`.

## Production Usage

1. Clone the repository.
2. Run `docker build -t cars-available .` inside the cloned repository.
3. Run `docker run --rm -p 8080:80 cars-available`.
4. Open browser on `http://localhost:8080`.
