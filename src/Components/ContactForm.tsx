import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import TextArea from "react-textarea-autosize";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

import { Button } from "./Button";

const ContactForm = () => {
	const [formData, setFormData] = useState<Record<string, string>>({});

	const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		console.log(formData);
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

	return (
		<Styles>
			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Name:</label>
				<input id="name" type="text" onChange={onChange} />

				<label htmlFor="email">Email:</label>
				<input id="email" type="email" onChange={onChange} />

				<label htmlFor="message">Message:</label>
				<TextArea id="message" minRows={4} onChange={onChange} />

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
	padding-top: 4rem;

	> form {
		display: flex;
		flex-direction: column;

		> label {
			margin-bottom: 0.5rem;
		}

		> input,
		> textarea {
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

		> textarea {
			resize: none;
		}

		.controls {
			padding-top: 2rem;
			display: block;
		}
	}
`;
