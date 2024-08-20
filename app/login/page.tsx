'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Container, Grid, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import styles from './login.module.css'; // Import the CSS module

export default function LoginPage() {
	const router = useRouter();

	// Handle Google Sign-In
	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const credential = await signInWithPopup(auth, provider);
			const idToken = await credential.user.getIdToken();
			const response = await fetch("/api/login", {
				method: "POST", // Make sure the method matches your backend handler
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${idToken}`, // Include the token in the Authorization header
				},
			});
			if (!response.ok) {
				throw new Error('Failed to log in');
			}
			router.push('/'); // Redirect to the dashboard after successful sign-in
		} catch (error) {
			console.error('Error signing in with Google:', error);
		}
	};

	return (
		<Grid container className={styles.container}>
			{/* Left Side - Logo */}
			<Grid item xs={12} md={6} className={styles.leftSide}>
				<Box>
					<Image
						src="/bg-less-logo.png" // Path to your logo
						alt="Logo"
						width={400}
						height={400}
						className={styles.logoImage}
					/>
				</Box>
			</Grid>

			{/* Right Side - Google Sign-In */}
			<Grid item xs={12} md={6} className={styles.rightSide}>
				<Container maxWidth="xs">
					<Typography variant="h4" align="center" gutterBottom>
						Login to Shonglaap
					</Typography>
					<Button
						variant="contained"
						fullWidth
						onClick={handleGoogleSignIn}
						className={styles.signInButton}
					>
						<Image
							src="/google.svg" // Path to the Google SVG icon
							alt="Google Icon"
							width={24}
							height={24}
							className={styles.googleIcon}
						/>
						Sign In with Google
					</Button>

					{/* New section: Don't have an account? */}
					<Box className={styles.centeredText}>
						<Typography variant="body2">
							Don't have an account?{' '}
							<Link href="/register" className={styles.signUpLink}>
								Sign Up
							</Link>
						</Typography>
					</Box>
				</Container>
			</Grid>
		</Grid>
	);
}
