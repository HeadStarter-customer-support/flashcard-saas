'use client'

import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            console.log(docSnap.data());
            

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                // console.log("collections:", collections);
                
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    
    flashcards.forEach(f => console.log(f.name)
    )

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3} sx={{ mt: 4 }} >
                {flashcards.map((flashcard, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx} >
                        <Card>
                            <CardActionArea
                                onClick={() => handleCardClick(flashcard.name)}
                            >
                            <CardContent>
                                <Typography variant="h6">
                                    {flashcard.name}
                                </Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}