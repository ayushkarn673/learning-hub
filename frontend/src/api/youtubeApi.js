import axios from "axios";

const API_KEY =
    import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchVideos =
    async (query) => {
        try {
            const response =
                await axios.get(
                    "https://www.googleapis.com/youtube/v3/search",
                    {
                        params: {
                            part: "snippet",
                            q: `${query} tutorial`,
                            key: API_KEY,
                            maxResults: 6,
                            type: "video",
                        },
                    }
                );
            return response.data.items;
        } catch (error) {
            console.error("YouTube API failed:", error);
            return [];
        }
    };