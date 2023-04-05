<h1 align="center">Colorblind</h1>

<p align="center">A core .NET 7 API server containing all core logic for Colorblind</p>

# Main dependencies
## [Marten] (https://martendb.io/) + PostgreSQL database instance
Right now the script to run a local database is placed inside of ./database folder,
the prefered way to run PostgreSQL nowadays is via Docker.

Marten will then handle that database dynamically once the app is running, using it as a document database like MongoDB,
as well as handle event store semantics.

# How to run
## Locally with [.NET 7 runtime](https://dotnet.microsoft.com/en-us/download)
```
  dotnet run --project ./WebApp/WebApp.csproj
  
  dotnet test
```

## [Docker](https://docs.docker.com/get-docker/)

```
  docker build -t colorblind-server:0.0.1 .
  
  docker run -p <hostPort>:80 colorblind-server:0.0.1
```

# Formatting
## Using .editorconfig
```
  dotnet format
```
