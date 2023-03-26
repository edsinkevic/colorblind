<h1 align="center">Colorblind</h1>

<p align="center">A simple .NET 7 API server containing all core logic for Colorblind</p>

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
