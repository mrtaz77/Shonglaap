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
	Stack,
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

	const prepareMessageData = (msg: string) => {
		return {
			messages: [...messages.slice(1), { role: 'user', content: msg }],
		};
	};

	const callChatAPI = async (data: { messages: { role: string; content: string }[] }) => {
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response;
	};

	const handleAPIResponse = async (response: Response) => {
		const reader = response.body?.getReader();
		const decoder = new TextDecoder();
		if (reader) {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const text = decoder.decode(value, { stream: true });
				setMessages((messages) => {
					let lastMessage = messages[messages.length - 1];
					let otherMessages = messages.slice(0, messages.length - 1);
					return [
						...otherMessages,
						{ ...lastMessage, content: lastMessage.content + text },
					];
				})
			}
		}
	};

	const sendMessage = async () => {
		if (!message.trim()) return;
		const msg = message.trim();
		setMessage('');
		setMessages((prevMessages) => [
			...prevMessages,
			{ role: 'user', content: msg },
			{ role: 'assistant', content: '' },
		]);
		try {
			const messageData = prepareMessageData(msg);
			const response = await callChatAPI(messageData);
			await handleAPIResponse(response);
		} catch (error) {
			console.error('Failed to send message:', error);
			setMessages((messages) => [
				...messages,
				{ role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
			])
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
								multiline
								minRows={1}
								maxRows={4}
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
