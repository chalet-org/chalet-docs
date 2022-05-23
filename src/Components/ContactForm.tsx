import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import TextArea from "react-textarea-autosize";
import styled from "styled-components";

import { docsApi } from "Api";
import { getThemeVariable } from "Theme";

import { Button } from "./Button";

const ContactForm = () => {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState<boolean>(false);

	const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		console.log(formData);
		// docsApi.sendContactEmail(formData);
		setSubmitted(true);
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
				<MainParagraph>NEEDS COPY</MainParagraph>
			</Submitted>
		);
	}

	return (
		<Styles>
			<MainParagraph>NEEDS COPY</MainParagraph>
			<form onSubmit={handleSubmit}>
				<Flexer>
					<label htmlFor="name">Name:</label>
					<input id="name" type="text" onChange={onChange} />
				</Flexer>

				<Flexer>
					<label htmlFor="email">Email:</label>
					<input id="email" type="email" onChange={onChange} />
				</Flexer>

				<Flexer>
					<label htmlFor="subject">Subject:</label>
					<input id="subject" type="text" onChange={onChange} />
				</Flexer>

				<Flexer>
					<label htmlFor="message">Message:</label>
					<TextArea id="message" minRows={4} onChange={onChange} />
				</Flexer>

				<div className="controls">
					<Button type="submit" title="Submit">
						Submit
					</Button>
				</div>
			</form>
		</Styles>
	);
};

export { ContactForm };

const Styles = styled.div`
	display: block;

	> form {
		display: flex;
		flex-direction: column;

		label {
			margin-bottom: 0.5rem;
			color: ${getThemeVariable("primaryText")};
			font-weight: 600;
		}

		input,
		textarea {
			caret-color: ${getThemeVariable("primaryColor")};
			color: ${getThemeVariable("primaryText")};
			background-color: ${getThemeVariable("codeBackground")};
			border: 0;
			padding: 0.5rem 1rem;
			margin-bottom: 1rem;
			border-radius: 0.25rem;
			outline-color: ${getThemeVariable("border")};

			&::placeholder {
				color: ${getThemeVariable("codeGray")};
			}
		}

		textarea {
			resize: none;
		}

		.controls {
			padding-top: 2rem;
			display: block;
		}
	}
`;

const Flexer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;

	> label {
		flex: 1;
	}

	> input,
	> textarea,
	> textarea {
		flex: 4;
	}
`;

const Submitted = styled.div`
	display: block;
`;

const MainParagraph = styled.p`
	display: block;
	padding-bottom: 3rem;
`;
