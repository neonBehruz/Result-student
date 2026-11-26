FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ResultStudent.slnx ./
COPY src/ResultStudent.Api/ResultStudent.Api.csproj src/ResultStudent.Api/
RUN dotnet restore src/ResultStudent.Api/ResultStudent.Api.csproj

COPY . .
WORKDIR /src/src/ResultStudent.Api
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
CMD ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080} dotnet ResultStudent.Api.dll"]
