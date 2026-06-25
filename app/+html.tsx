import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

const rootStyles = `
html,
body,
#root {
  height: 100%;
}

body {
  overflow: auto;
  background-color: #E2E8F0;
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: rootStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
