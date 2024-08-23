"use client";

import { useRouter } from "next/navigation";
import {
	AppBar,
	Toolbar,
	Button,
	Container,
	Typography,
	TextField,
	Box,
	Stack
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
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
		},
	])
	const [message, setMessage] = useState('')

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

	const sendMessage = async () => {
		// We'll implement this function in the next section
	}

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
							onBlur={handleUsernameSubmit}
							className="text-field-custom"
							sx={{ flexGrow: 1 }}
						/>
					) : (
						<Typography
							variant="h5"
							sx={{ flexGrow: 1, cursor: "pointer" }}
							onClick={() => setIsEditingUsername(true)}
						>
							<b>{username || email}</b>
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
				<Box className="chat-box">
					<Stack className="chat-container">
						<Stack className="message-list">
							{messages.map((message, index) => (
								<Box
									key={index}
									className={`message ${message.role === 'assistant'
											? 'message-received'
											: 'message-sent'
										}`}
								>
									{message.content}
								</Box>
							))}
						</Stack>
						<Stack direction={'row'} spacing={2}>
							<TextField
								label="Message"
								fullWidth
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								variant="outlined"
								className="message-input"
							/>
							<Button
								variant="contained"
								onClick={sendMessage}
								className="send-button"
							>
								Send
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Container>
		</>
	);
}
