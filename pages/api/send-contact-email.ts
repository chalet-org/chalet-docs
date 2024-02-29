import { ContactEmailOptions } from "Server/InputTypes";
import { sendContactEmail } from "Server/Mailer/SendContactEmail";
import { middleware } from "Server/Middleware";
import { ResultSendContactEmail } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = middleware.use(["auth"], async (req: ApiReq, res: ApiRes<ResultSendContactEmail>): Promise<void> => {
	try {
		const body = JSON.parse(req.body) as Partial<ContactEmailOptions>;
		let { subject, firstName, lastName, email, message } = body;
		if (!email || email.length === 0) {
			throw new Error("Invalid query sent in request: missing 'email'");
		}
		if (!message || message.length === 0) {
			throw new Error("Invalid query sent in request: missing 'message'");
		}
		if (!subject || subject.length === 0) {
			subject = "(No subject)";
		}
		if (!firstName || firstName.length === 0) {
			firstName = "(Blank)";
		}
		if (!lastName || lastName.length === 0) {
			lastName = "(Blank)";
		}

		const contents = {
			subject,
			firstName,
			lastName,
			email,
			message,
		};
		await sendContactEmail(contents);

		res.status(200).json({ message: "Email sent", contents });
	} catch (err: any) {
		console.error(err);
		res.status(400).json({
			error: "There was an error sending the request.",
		});
	}
});

export default handler;
