'use client'

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, CircularProgress, Container, Grid, styled, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from "./components/theme";
import { useState } from "react";
import GradientCircularProgress from "./components/gradientcircularprogress";

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

export default function Home() {

  const router = useRouter()
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)


  const handlesubmit = async (plan) => {
    plan === 'basic' ? setLoading2(true) : setLoading3(true)
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ plan }),
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      console.warn(error.message)
    }
  }

  const handleGetStarted = () => {
    setLoading1(true)
    router.push('./generate')
  }

  return (
    
    <Container maxWidth="lg" >
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Flashcard Saas</title>
            <meta name="description" content="Create flashcard from your text" />
          </Head>

      
          <AppBar>
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
            <Offset />
            <Typography variant="h2">
              Welcome to Flashcard SaaS
            </Typography>
            <Typography variant="h4">The easiest way to make flashcards</Typography>
            {loading1 ? (<GradientCircularProgress />) : ( <Button variant="contained" sx={{ mt: 2 }} onClick={handleGetStarted} >Get started</Button> )}
            
            
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
                  {loading2 ? (<GradientCircularProgress />) : (<Button variant="contained" sx={{ mt: 1 }} onClick={() => handlesubmit('basic')}>Choose basic</Button>) }
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
                  {loading3 ? (<GradientCircularProgress />) : (<Button variant="contained" sx={{ mt: 1 }} onClick={() => handlesubmit('pro')}>Choose Pro</Button>) }
                  
                </Box>
              </Grid>
            </Grid> 
          </Box>

        </ThemeProvider>
      </AppRouterCacheProvider>
    </Container>
  );
}
