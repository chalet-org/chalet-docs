import React from "react";

import { docsApi } from "Api";
import { handleStaticProps } from "Utility";
import { withServerErrorPage } from "HighComponents";
import { TestLayout } from "Layouts";

const HomePage = withServerErrorPage(TestLayout);

export const getStaticProps = handleStaticProps(() => docsApi.getChaletSchema());

export default HomePage;
