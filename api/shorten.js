export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { url } = req.body || {};

        if (!url) {
            return res.status(400).json({
                error: "URL отсутствует"
            });
        }

        const apiUrl =
            "https://is.gd/create.php" +
            "?format=json" +
            "&url=" +
            encodeURIComponent(url);

        const response = await fetch(apiUrl);

        // Сначала получаем обычный текст.
        const text = await response.text();

        // Пытаемся превратить его в JSON.
        let data = null;

        try {
            data = JSON.parse(text);
        } catch {
            return res.status(502).json({
                error: "is.gd вернул не JSON",
                details: text.slice(0, 500)
            });
        }

        if (!response.ok || !data.shorturl) {
            return res.status(502).json({
                error:
                    data.errormessage ||
                    "is.gd не смог сократить ссылку",
                errorcode: data.errorcode || null
            });
        }

        return res.status(200).json({
            shorturl: data.shorturl
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Ошибка сервера при сокращении ссылки",
            details: error.message
        });
    }
}
