import { IncomingWebhook } from "@slack/webhook";

const slack = {
  sendToSlack: async (text: string) => {
    const url = process.env.SLACK_WEBHOOK_URL || "";
    const webhook = new IncomingWebhook(url);
    await webhook.send({ text });
  },
};

export default slack;
