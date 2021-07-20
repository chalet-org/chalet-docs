import React from "react";
import Head from "next/head";
// import Image from "next/image";
import styled from "styled-components";

import { ChaletSchema, docsApi } from "Api";
import { handleStaticProps, ServerProps } from "Utility";
import { BaseStyle, SchemaDocNode } from "Components";

type Props = ServerProps<ChaletSchema>;

const Home = ({ schema, error }: Props) => {
	console.log(schema);
	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta name="description" content="Description" />
				<meta
					name="viewport"
					content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<BaseStyle />
			<Styles>
				Main
				<br />
				<br />
				<h2>Schema Reference</h2>
				{error ?? <SchemaDocNode name="root" schema={schema} />}
			</Styles>

			<footer>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					{/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
				</a>
			</footer>
		</>
	);
};

const Styles = styled.main`
	padding: 1rem;
	white-space: pre;
`;

export const getStaticProps = handleStaticProps(() => docsApi.getChaletSchema());

export default Home;
