import { put } from "@vercel/blob";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const filename =
            req.query.filename ||
            "birthday-photo.jpg";

        const blob = await put(
            "birthday-photos/" + filename,
            req,
            {
                access: "public",
                addRandomSuffix: false,
                contentType:
                    req.headers["content-type"] ||
                    "image/jpeg"
            }
        );

        return res.status(200).json({
            url: blob.url
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error:
                "Ошибка загрузки фотографии в Vercel Blob"
        });
    }
}

export const config = {
    api: {
        bodyParser: false
    }
};
