<h1 align="center">Colorblind</h1>

<p align="center">A simple .NET 6 API server containing all core logic for Colorblind</p>

# How to run

## Locally with [.NET 6 runtime](https://dotnet.microsoft.com/en-us/download)

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

# What libraries we use and why

## [.NET Domain Driven Development Guide Playlist](https://www.youtube.com/playlist?list=PLzYkqgWkHPKBcDIP5gzLfASkQyTdy0t4k)

So I (Edvin) am (or was) pretty sceptical of OOP and a huge FP maniac.
After seeing how things are done at my job, working in a team,
I'm finally starting to grasp it. But,

### [MediatR](https://github.com/jbogard/MediatR)

This library significantly decouples our application logic from the presentation layer.
Meaning that, if done right, our application logic could be reused in many types of presentation layers,
in other words, the presentation layer doesn't matter for the Logic module and transitively, for the Persistence
module. In our case, for now, we have a simple REST api in the WebApp module,
it can get pretty dirty after injecting a lot of use case modules.

There are a lot more features we're not using, but will be documented here once we use them.

### [ErrorOr](https://github.com/amantinband/error-or)

A small library implementing a discriminated union of an error or a result.
Something like Either in Haskell, but the Left is always an Error type provided by the library.
The idea is to not throw exceptions where they are expected, for instance, domain errors aren't exceptions.
Domain errors are going to be just returned. C# will implicitly convert that error to ErrorOr type, in case the return
type is that.

Throwing an exception is kind of like a goto statement nowadays, things get super messy when there's a lot of throwing.
So, we'll keep exceptions for things we don't actually expect, use a global exception handler.

## Final notes

To be honest, looking at the current state of the project, we don't need any libraries at all.
But in case this project gets bigger, I think I will pat myself on the back.

(Just an excuse to try the libraries out)