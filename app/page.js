
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";



export default function Home() {
  return (
    <Container maxWidth="lg" >
      <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      
      <AppBar position="fixed">
        <Toolbar >
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard Saas</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">signup</Button>
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
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4">
          Features
        </Typography>
        <Grid container spacing={4}> 
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>Simply input your text and let our software do the rest.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>
              {" "}
              Out AI flashcards break down your text into concise flashcards, perfect for studying</Typography>
          </Grid><Grid item xs={12} md={4}>
            <Typography variant="h6">Accessible anywhere</Typography>
            <Typography>{' '}Access your flashcards from any device, at any time, study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my:6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}> 
          <Grid item xs={12} md={6}>
            <Box sx={{
              p:3,
              border: '1px black solid',
              borderColor: 'grey.300',
              borderRadius: 2
            }}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5/month</Typography>
              <Typography >Acces to basic flashcard features and limited storage</Typography>
              <Button variant="contained" sx={{ mt: 1 }}>Choose basic</Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{
                p:3,
                border: '1px black solid',
                borderColor: 'grey.300',
                borderRadius: 2
              }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10/month</Typography>
              <Typography >Unlimited flashcards with storage, priority support</Typography>
              <Button variant="contained" sx={{ mt: 1 }}>Choose Pro</Button>

            </Box>
          </Grid>
        </Grid> 
      </Box>
    </Container>
  );
}
