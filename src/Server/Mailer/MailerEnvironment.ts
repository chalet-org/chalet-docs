/*
	Requires:
		EMAIL_TRANSPORTER_SMTP_SERVER=
		EMAIL_TRANSPORTER_USER=
		EMAIL_TRANSPORTER_PASS=
		EMAIL_SENDER_NAME=
		EMAIL_SENDER_EMAIL=
		EMAIL_RECIPIENTS=
		EMAIL_SIMULATE=
*/

const recipients = process.env.EMAIL_RECIPIENTS ?? "";

const mailerEnvironment = {
	smtpServer: process.env.EMAIL_TRANSPORTER_SMTP_SERVER ?? "",
	auth: {
		user: process.env.EMAIL_TRANSPORTER_USER,
		pass: process.env.EMAIL_TRANSPORTER_PASS,
	},
	sender: {
		name: process.env.EMAIL_SENDER_NAME,
		email: process.env.EMAIL_SENDER_EMAIL,
	},
	simulate: process.env.EMAIL_SIMULATE === "true",
	recipients: recipients.replace(/ /g, "").split(","),
};

export { mailerEnvironment };
