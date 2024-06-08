import type { AppProps } from "next/app";
import "@/app/styles/globals.css";
import "@/app/styles/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import DefaultLayout from "@/app/components/layouts/Default";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type ExtendedAppProps = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: ExtendedAppProps) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider
        toastOptions={{
          defaultOptions: { position: "top-right", variant: "left-accent" },
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
