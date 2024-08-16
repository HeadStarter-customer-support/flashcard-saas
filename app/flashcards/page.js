'use client'

import { db } from "@/firebase"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { HomeRounded } from "@mui/icons-material"
import { AppBar, Backdrop, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Container, Grid, styled, Toolbar, Typography } from "@mui/material"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import GradientCircularProgress from "../components/gradientcircularprogress"
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)
GradientCircularProgress

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [open, setOpen] = useState(false)
    const [openProgress, setOpenProgress] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function getFlashCards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashCards();
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        setOpenProgress(true)
        router.push(`/flashcard?id=${id}`)
    }

    const handleHomeClick = () => {
        setOpenProgress(true)
        router.push('/')
    }

    
    flashcards.forEach(f => console.log(f.name)
    )

    return (
        <Container maxWidth="100vw">

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openProgress} >
            <GradientCircularProgress color="inherit" />
            </Backdrop>

            <AppBar>
                <Toolbar variant="dense">
                <Typography sx={{ mt:1 }} variant="h6" style={{ flexGrow: 1 }}><HomeRounded onClick={handleHomeClick} /></Typography>
                <SignedOut>
                    <Button color="inherit" href="/sign-in">Login</Button>
                    <Button color="inherit" href="/sign-up">signup</Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                    
                </Toolbar>
            </AppBar>
            
            <Grid container spacing={3} sx={{ mt: 4 }} >
                
                {flashcards.map((flashcard, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx} >
                        <Offset />
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)} >
                            <CardContent>
                                <Typography variant="h6"> {flashcard.name} </Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
        </Container>
    )
}