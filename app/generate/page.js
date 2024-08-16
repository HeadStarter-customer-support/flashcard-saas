'use client'

import { db } from "@/firebase"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { HomeRounded } from "@mui/icons-material"
import { AppBar, Backdrop, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, styled, TextField, Toolbar, Typography } from "@mui/material"
import { collection, getDoc, writeBatch, doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import GradientCircularProgress from "../components/gradientcircularprogress"
GradientCircularProgress
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)


export default function Generate() {
    
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState('')
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [openProgress, setOpenProgress] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        setOpenProgress(true)
        fetch('/api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then(data => {
                setFlashcards(data)
                setOpenProgress(false)
            })
            .catch(() => setOpenProgress(false))
            
        
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }
    
    const handleClick = () => {
        setOpen(true)
        router.push('/')
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert(`Flashcard with name ${name} already exists.`)
                return
            } else {
                collections.push({name})
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container maxWidth="md">

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openProgress} >
            <GradientCircularProgress color="inherit" />
            </Backdrop>

            <AppBar>
                <Toolbar variant="dense">
                <Typography sx={{ mt:1 }} variant="h6" style={{ flexGrow: 1 }}><HomeRounded onClick={handleClick} /></Typography>
                <SignedOut>
                    <Button color="inherit" href="/sign-in">Login</Button>
                    <Button color="inherit" href="/sign-up">signup</Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                    
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    mt: 4,
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Offset />
                <Typography paddingBottom={2} variant="h4">Generate Flashcards</Typography>
                
                <Paper sx={{ p:4, width: '100%' }}>
                    <TextField 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label='Enter text'
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            mb: 2
                        }}
                    >
                    </TextField>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Submit</Button>
                </Paper>
            </Box>

            {flashcards.length > 0 &&  (
                <Box sx={{ mt: 4 }} >
                    <Typography variant="h5" >Flashcards Preview</Typography>
                    <Grid container spacing={3} >
                        {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea
                                    onClick={() => handleCardClick(index)}
                                >
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                transform: flipped[index]
                                                    ? 'rotateY(180deg)'
                                                    : 'rotateY(0deg)',
                                            },
                                            '& > div > div': { 
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box'
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component={'div'}>{flashcard.front}</Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component={'div'}>{flashcard.back}</Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                    <Box sx={{
                        mt: 4, 
                        display: 'flex',
                        justifyContent: 'center',
                    }} >
                        <Button sx={{ my:2 }} variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for you flashcards collection
                    </DialogContentText>
                    <TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} >Cancel</Button>
                    <Button onClick={saveFlashcards} >Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}