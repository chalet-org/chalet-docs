import { EmailSender } from "nodemailer-mjml-sender";
import path from "path";

import { mailerEnvironment as env } from "./MailerEnvironment";

export type ContactEmailOptions = {
	subject: string;
	email: string;
	name: string;
	message: string;
};

async function sendContactEmail(options: ContactEmailOptions) {
	const mailer = new EmailSender();

	// prettier-ignore
	mailer.transporter
        .host(env.smtpServer)
        .secure(false)
        .account(env.auth);

	const templatePath = path.join(process.cwd(), "mailtemplates");

	// prettier-ignore
	mailer.sender
        .from(env.sender)
        .to(env.recipients)
        .replyTo(options.email)
        .subject(options.subject)
        .template(path.join(templatePath, "contact.mjml"), {
            name: options.name,
			message: options.message
        });

	const result = await mailer.send();
	console.log("Email sent:", result.messageId);
	return result;
}

export { sendContactEmail };
