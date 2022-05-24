import email from "email-validator";
import React, { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import TextArea from "react-textarea-autosize";
import styled from "styled-components";

import { docsApi } from "Api";
import { getThemeVariable } from "Theme";
import { Optional } from "Utility";

import { BlockQuote } from "./BlockQuote";
import { Button } from "./Button";
import { hasMinWidth } from "./GlobalStyles";
import { Link } from "./Link";

const ContactForm = () => {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<Optional<string>>(null);

	const validEmail = useMemo(() => formData.email && email.validate(formData.email), [formData.email]);
	const invalidForm = !validEmail || !formData.message || !formData.name || !formData.subject;

	const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
		try {
			ev.preventDefault();
			if (invalidForm) return;

			// console.log(formData);
			await docsApi.sendContactEmail(formData);
			setSubmitted(true);
			setError(null);
		} catch (err: any) {
			setSubmitted(false);
			setError("There was an error submitting the form. Try again later.");
		}
	};

	const onChange = useCallback((ev: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
		ev.preventDefault();
		if (!ev.target.id) return;

		setFormData((data) => {
			if (ev.target.value.length === 0) {
				delete data[ev.target.id];
			} else {
				data[ev.target.id] = ev.target.value;
			}
			return { ...data };
		});
	}, []);

	if (submitted) {
		return (
			<Submitted>
				<MainParagraph>
					<p>Thank you! We'll be in touch within the next couple of business days.</p>
				</MainParagraph>
			</Submitted>
		);
	}

	return (
		<Styles>
			<BlockQuote>
				If you have general questions about using Chalet, please refer to the{" "}
				<Link href="//github.com/chalet-org/chalet/discussions">Discussions</Link> instead.
			</BlockQuote>
			<MainParagraph>
				<p>Want to discuss business and other opportunities? Enquire below!</p>
			</MainParagraph>
			<form onSubmit={handleSubmit}>
				<div className="fieldrow">
					<div className="fieldwrap">
						<label htmlFor="name" />
						<input id="name" type="text" title="Name" placeholder="Name" onChange={onChange} />
					</div>
					<div className="spacer" />
					<div className="fieldwrap">
						<label htmlFor="email" />
						<input id="email" type="email" title="Email" placeholder="Email" onChange={onChange} />
					</div>
				</div>

				<label htmlFor="subject" />
				<input id="subject" type="text" title="Subject" placeholder="Subject" onChange={onChange} />

				<label htmlFor="message" />
				<TextArea id="message" minRows={3} title="Message" placeholder="Message" onChange={onChange} />

				<div className="controls">
					<Button type="submit" title="Submit" disabled={invalidForm}>
						Submit
					</Button>
				</div>
				{error && <p className="error">{error}</p>}
			</form>
		</Styles>
	);
};

export { ContactForm };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	> form {
		display: flex;
		flex-direction: column;
		width: calc(100% - 2rem);
		padding: 1.125rem 1.5rem;
		border: 0.0625rem solid ${getThemeVariable("border")};
		background-color: ${getThemeVariable("background")};

		.fieldrow {
			display: flex;
			flex-direction: column;
		}
		.fieldwrap {
			display: flex;
			flex-direction: column;
			width: 100%;
		}
		.spacer {
			display: none;
		}

		label {
			margin-bottom: 0.5rem;
			color: ${getThemeVariable("primaryText")};
			font-weight: 600;
		}

		input,
		textarea {
			caret-color: ${getThemeVariable("primaryColor")};
			color: ${getThemeVariable("primaryText")};
			background-color: ${getThemeVariable("border")};
			outline: 0;
			border: 0.125rem solid ${getThemeVariable("background")};
			padding: 0.5rem 1rem;
			margin-bottom: 1rem;
			border-radius: 0.25rem;
			transition: border-color 0.125s linear;

			&::placeholder {
				color: ${getThemeVariable("primaryText")};
			}

			&:hover {
				border-color: ${getThemeVariable("header")};
			}

			&:focus,
			&:active {
				border-color: ${getThemeVariable("primaryColor")};
			}
		}

		textarea {
			resize: none;
		}

		.controls {
			padding-top: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;

			> button {
				width: 50%;
			}
		}

		p.error {
			padding-top: 1.5rem;
			color: ${getThemeVariable("header")};
		}
	}

	@media ${hasMinWidth(0)} {
		> form {
			width: 80%;
			.fieldrow {
				display: flex;
				flex-direction: row;
			}
			.fieldwrap {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.spacer {
				display: block;
				width: 2rem;
			}
		}
	}
	@media ${hasMinWidth(1)} {
		> form {
			width: 65%;
		}
	}
	@media ${hasMinWidth(2)} {
	}
`;

const Submitted = styled.div`
	display: block;
`;

const MainParagraph = styled.div`
	display: block;
	width: 100%;
	padding: 2rem 0;
	text-align: center;
`;
