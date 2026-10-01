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
            "?format=simple" +
            "&url=" +
            encodeURIComponent(url);

        const response = await fetch(apiUrl);

        const text =
            (await response.text()).trim();

        console.log(
            "is.gd response:",
            response.status,
            text
        );

        // Успешный ответ is.gd выглядит примерно так:
        // https://is.gd/AbCd12

        if (
            response.ok &&
            text.startsWith("https://is.gd/")
        ) {

            return res.status(200).json({
                shorturl: text
            });

        }

        // Если is.gd вернул ошибку,
        // показываем её настоящую причину.
        return res.status(502).json({
            error:
                text ||
                "is.gd не вернул ссылку"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error:
                "Ошибка сервера при сокращении ссылки",
            details:
                error.message
        });
    }
}
