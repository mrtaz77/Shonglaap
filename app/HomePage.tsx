"use client";

import { useRouter } from "next/navigation";
import { Button, Container, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Adjust the import path to your Firebase config

interface HomePageProps {
	email?: string;
}

export default function HomePage({ email }: HomePageProps) {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			await fetch("/api/logout");

			router.push("/login");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<Container maxWidth="md" className="container-homepage">
			<Typography variant="h4" className="heading-homepage">
				Super secure home page
			</Typography>
			<Typography variant="body1" className="text-homepage">
				Only <strong>{email}</strong> holds the magic key to this kingdom!
			</Typography>
			<Button
				className="button-logout"
				onClick={handleLogout}
			>
				Logout
			</Button>
		</Container>
	);
}
