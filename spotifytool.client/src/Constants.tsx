export const API_URL: string = "http://localhost:5178/api/";

export type LoginResponse = {
    accessToken: string,
    refreshToken: string
}

export type User = {
    id: number,
    username: string,
    email: string,
    spotifyToken: string,
    youtubeToken: string
}