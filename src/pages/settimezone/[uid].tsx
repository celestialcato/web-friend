import { useEffect, useState } from "react";

import type { NextPage } from "next";
import { useRouter } from "next/router";

import {
	Center,
	Card,
	Heading,
	Select,
	Image,
	Flex,
	Button,
	useToast,
	useColorMode,
	Switch,
	Icon,
	Text,
	Spinner,
	Avatar,
	Divider,
} from "@chakra-ui/react";

import {
	ChevronDownIcon,
	CheckCircleIcon,
	WarningIcon,
	WarningTwoIcon,
} from "@chakra-ui/icons";
import { MdNightsStay, MdSunny } from "react-icons/md";

import moment from "moment-timezone";
import { IUser } from "@/schema/users";

const TimezoneCollector: NextPage = () => {
	const router = useRouter();

	const toast = useToast();

	const { uid } = router.query;

	const [timezone, setTimeZone] = useState<string>(
		Intl.DateTimeFormat().resolvedOptions().timeZone
	);

	const [isSending, setIsSending] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDone, setIsDone] = useState<boolean>(false);

	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		const response = fetch("/api/fetchuserinfo", {
			method: "POST",
			body: JSON.stringify({ uid }),
		}).then(r => {
			if (r.ok) {
				r.json().then(data => {
					const u: IUser = JSON.parse(data);
					setUser(u);
				});
			}
			setIsLoading(false);
		});
	}, [uid]);

	const tzs = moment.tz.names();

	const { colorMode, toggleColorMode } = useColorMode();

	const handleSaveTimezone = async () => {
		try {
			setIsSending(true);

			const response = await fetch("/api/settimezone", {
				method: "POST",
				body: JSON.stringify({ timezone, uid }),
			});

			if (response.ok) {
				toast({
					title: "Timezone set",
					status: "success",
					duration: 9000,
					isClosable: true,
					icon: (
						<Center>
							<CheckCircleIcon />
						</Center>
					),
				});
				setIsDone(true);
			} else {
				toast({
					title: "Couldn't set timezone",
					status: "error",
					duration: 9000,
					isClosable: true,
					icon: (
						<Center>
							<WarningIcon />
						</Center>
					),
				});
			}
		} catch (error) {
			toast({
				title: "Cannot connect to the server",
				status: "warning",
				duration: 9000,
				isClosable: true,
				icon: (
					<Center>
						<WarningTwoIcon />
					</Center>
				),
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Flex
			w="100vw"
			h="100vh"
			bg={
				colorMode === "dark"
					? "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)"
					: "linear-gradient(to top, #c471f5 0%, #fa71cd 100%)"
			}
			direction="column"
		>
			<Flex
				w="100%"
				bg="rgba(255, 255, 255, 0.2)"
				boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
				backdropFilter="blur(5px)"
				border="1px solid rgba(255, 255, 255, 0.3)"
				py={2}
				px={5}
			>
				<Flex
					flexGrow={1}
					gap={5}
					align="center"
					justify="start"
				>
					<Image
						src="/logo.svg"
						boxSize="50px"
					/>
					<Heading fontSize="large">Cyber Friend</Heading>
				</Flex>
				<Flex
					align="center"
					gap={4}
				>
					<Icon
						as={MdSunny}
						boxSize={6}
					/>
					<Switch
						size="lg"
						colorScheme="purple"
						isChecked={colorMode === "dark"}
						onChange={toggleColorMode}
					/>
					<Icon
						as={MdNightsStay}
						boxSize={6}
					/>
				</Flex>
			</Flex>
			<Center
				flexGrow={1}
				padding={2}
			>
				<Card
					align="center"
					padding={10}
					gap={5}
					boxShadow="rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
				>
					{!isDone ? (
						<>
							{isLoading ? (
								<>
									<Heading size="md">Please wait ...</Heading>
									<Center>
										<Spinner
											colorScheme="purple"
											size="lg"
										/>
									</Center>
								</>
							) : !isLoading && user ? (
								<>
									<Flex
										gap={5}
										align="center"
										justify="center"
									>
										<Avatar
											name={user.user_username}
											src={user.user_profile_picture}
										/>
										<Heading size="md">{`Hi ${user.user_username} !`}</Heading>
									</Flex>
									<Divider></Divider>
									<Flex
										border="ActiveBorder"
										align="center"
										justify="center"
										gap={5}
									>
										<Image
											boxSize="40px"
											objectFit="cover"
											src="/time.svg"
										/>
										<Heading fontSize="lg">
											Select your timezone
										</Heading>
									</Flex>
									<Select
										placeholder={timezone}
										icon={<ChevronDownIcon />}
										isRequired
										variant="filled"
										size="lg"
										value={timezone}
										onChange={e => {
											setTimeZone(e.target.value);
										}}
									>
										{tzs.map((tz, i) => (
											<>
												<option
													key={i}
													value={tz}
												>
													{tz}
												</option>
											</>
										))}
									</Select>
									<Button
										variant={
											isSending ? "outline" : "solid"
										}
										isLoading={isSending}
										colorScheme="blue"
										leftIcon={<CheckCircleIcon />}
										w="xs"
										onClick={handleSaveTimezone}
									>
										Confirm
									</Button>
								</>
							) : (
								<>
									<Center gap={5}>
										<Flex gap={5}>
											<Icon
												as={WarningTwoIcon}
												boxSize={35}
												color="orange"
											/>
											<Text
												fontSize="x-large"
												fontStyle="bold"
											>
												Link is invalid!
											</Text>
										</Flex>
									</Center>
								</>
							)}
						</>
					) : (
						<>
							<Center gap={5}>
								<Flex gap={5}>
									<Icon
										as={CheckCircleIcon}
										boxSize={35}
										color="green"
									/>
									<Text
										fontSize="x-large"
										fontStyle="bold"
									>
										Done!
									</Text>
								</Flex>
							</Center>
						</>
					)}
				</Card>
			</Center>
			<Center p={2}>
				<Text fontSize="sm">Developed by Celestial Cat 😺</Text>
			</Center>
		</Flex>
	);
};

export default TimezoneCollector;
