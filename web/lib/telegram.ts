export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID is missing. Notification not sent.");
    return false;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  // Split by comma in case there are multiple IDs
  const chatIds = chatId.split(',').map(id => id.trim()).filter(Boolean);

  try {
    const promises = chatIds.map(id => 
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: id,
          text: message,
          parse_mode: "HTML",
        }),
      })
    );

    const responses = await Promise.all(promises);
    
    // Check if any failed
    const hasError = responses.some(res => !res.ok);
    if (hasError) {
      console.error("One or more Telegram messages failed to send");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
}
