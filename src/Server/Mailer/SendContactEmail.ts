import email from "email-validator";
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
	try {
		if (!env.sender.email || !email.validate(env.sender.email)) {
			throw new Error("Email could not be sent. Server error.");
		}
		const validRecipients = env.recipients.every(email.validate);
		if (env.recipients.length === 0 || !validRecipients) {
			throw new Error("Email could not be sent. Server error.");
		}
		if (!email.validate(options.email)) {
			throw new Error(`Invalid email: ${options.email}`);
		}
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
			.subject(`New message from ${options.name}`)
			.template(path.join(templatePath, "contact.mjml"), {
				...options
			});

		const result = await mailer.send();
		console.log("Email sent:", result.messageId);
		return result;
	} catch (err: any) {
		console.error(err.message);
		throw err;
	}
}

export { sendContactEmail };
