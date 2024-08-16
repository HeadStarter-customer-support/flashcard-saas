'use client'
import { SignIn } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, styled, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)


export default function SignInPage() {
    return (
        <Container maxWidth="sm">
            <AppBar sx={{ backgroundColor: '#3f51b5' }} elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{
                        flexGrow: 1
                    }}>
                        <Link href="/" passHref>Flashcard SaaS</Link>
                    </Typography>
                    <Button color="inherit">
                        <Link href='/sign-in' passHref> Login </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href='/sign-up' passHref> Signup </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box 
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                padding={3}
            >
                <Offset />
                {/* <Typography variant="h6">Sign In</Typography> */}
                <SignIn/>
            </Box>
        </Container>
    )
}