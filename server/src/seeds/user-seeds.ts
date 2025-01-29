import { User } from "../models/user.js"

const { v4: uuidv4 } = require('uuid');

export const seedUsers = async (): Promise<void> => {
	try {
		await User.bulkCreate(
			[
				{   
                    id: uuidv4(),
					username: "johndoe",
					email: "johndoe@example.com",
					password: "password",
				},
				{
                    id: uuidv4(),
					username: "janedoe",
					email: "janedoe@example.com",
					password: "password",
				},
			],
			{ individualHooks: true }
		)
	} catch (error: any) {
		console.error("Error seeding users:", error)
	}
}
