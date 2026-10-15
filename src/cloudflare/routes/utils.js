function send_tel(
    msg,
    env,
    onSuccess = (data) => data,
    onError = (error) => {
        throw error;
    }
) {
    const message =
        `${msg} ${new Date().toISOString()}`;

    return fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: message
            })
        }
    )
        .then((response) => {

            if (!response.ok) {
                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }

            return response.json();
        })
        .then(onSuccess)
        .catch(onError);
}

export { send_tel }