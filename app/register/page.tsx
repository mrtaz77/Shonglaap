'use client';

import React from 'react';
import Image from 'next/image';
import { Button, Container, Grid, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import styles from './register.module.css'; // Import the CSS module

export default function RegisterPage() {
	const router = useRouter();

	// Handle Google Sign-In
	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			router.push('/login');
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
						Register to Shonglaap
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
					{/* New section: Already have an account? */}
					<Box className={styles.centeredText}>
						<Typography variant="body2">
							Already have an account?{' '}
							<Link href="/login" className={styles.signInLink}>
								Sign In
							</Link>
						</Typography>
					</Box>
				</Container>
			</Grid>
		</Grid>
	);
}
