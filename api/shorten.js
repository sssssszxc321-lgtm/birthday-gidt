export default async function handler(req, res) {

    /* Разрешаем только POST. */
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        /* Получаем URL от create.html. */
        const { url } = req.body;

        /* Проверяем URL. */
        if (!url) {
            return res.status(400).json({
                error: "URL отсутствует"
            });
        }

        /* Отправляем запрос в is.gd. */
        const apiUrl =
            "https://is.gd/create.php" +
            "?format=json" +
            "&url=" +
            encodeURIComponent(url);

        const response = await fetch(apiUrl);
        const data = await response.json();

        /* Если is.gd вернул ошибку. */
        if (!response.ok || !data.shorturl) {
            return res.status(500).json({
                error:
                    data.errormessage ||
                    "is.gd не смог сократить ссылку"
            });
        }

        /* Возвращаем короткую ссылку обратно браузеру. */
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
