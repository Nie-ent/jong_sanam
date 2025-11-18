import axios from "axios";

export async function getUserProfile(userId) {
    const response = await axios.get(
        `https://api.line.me/v2/bot/profile/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.MESSAGE_API}`,
            },
        }
    );
    return response.data; // 
}
