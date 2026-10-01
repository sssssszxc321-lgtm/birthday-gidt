export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { url } = req.body;

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

        const response =
            await fetch(apiUrl);

        const data =
            await response.json();

        if (!response.ok || !data.shorturl) {

            return res.status(500).json({
                error:
                    data.errormessage ||
                    "is.gd не смог сократить ссылку"
            });

        }

        return res.status(200).json({
            shorturl: data.shorturl
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error:
                "Ошибка сервера при сокращении ссылки"
        });

    }

}
