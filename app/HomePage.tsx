"use client";

import { useRouter } from "next/navigation";
import {
	AppBar,
	Toolbar,
	Button,
	Container,
	Typography,
	TextField,
} from "@mui/material";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase"; // Adjust the import path to your Firebase config
import { useState } from "react";

interface HomePageProps {
	email?: string;
	userDisplayName?: string;
}

export default function HomePage({ email, userDisplayName }: HomePageProps) {
	const router = useRouter();
	const [username, setUsername] = useState(userDisplayName || "");
	const [isEditingUsername, setIsEditingUsername] = useState(!userDisplayName);

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleUsernameSubmit = () => {
		setIsEditingUsername(false);
	};

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
		<>
			<AppBar position="static" className="appbar">
				<Toolbar>
					{isEditingUsername ? (
						<TextField
							variant="outlined"
							size="medium"
							placeholder="Enter Username"
							value={username}
							onChange={handleUsernameChange}
							onBlur={handleUsernameSubmit} // Save username on blur
							sx={{ flexGrow: 1 }}
						/>
					) : (
						<Typography
							variant="h6"
							sx={{ flexGrow: 1, cursor: "pointer" }}
							onClick={() => setIsEditingUsername(true)} // Allow editing username on click
						>
							{username || email}
						</Typography>
					)}

					<Button
						color="inherit"
						className="button-logout"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</Toolbar>
			</AppBar>

			<Container maxWidth="md" className="container-homepage">
				<Typography variant="h4" className="heading-homepage">
					Super secure home page
				</Typography>
				<Typography variant="body1" className="text-homepage">
					Only <strong>{email}</strong> holds the magic key to this kingdom!
				</Typography>
			</Container>
		</>
	);
}
