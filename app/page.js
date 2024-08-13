import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard Saas</Typography>
          <SignedOut>
            <Button color="inherit">Log in</Button>
            <Button color="inherit">Log out</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4, }}>
        <Typography variant="h2">
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h4">The easiest way to make flashcards</Typography>
        <Button variant="contained" sx={{ mt: 2 }}>Get started</Button>
      </Box>
    </Container>
  );
}
