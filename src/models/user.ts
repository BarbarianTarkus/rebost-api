import { User } from "../interfaces/User.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const kv = await Deno.openKv();

class UserModelClass {
  async createUser(user: User): Promise<string> {
    const userKey = ["user", user.id];
    const emailKey = ["userByEmail", user.email];

    // Password hashing
    user.password = await bcrypt.hash(user.password);

    // User Creation
    await kv.atomic()
      .check({ key: userKey, versionstamp: null })
      .check({ key: emailKey, versionstamp: null })
      .set(userKey, user)
      .set(emailKey, user.id)
      .commit();

    return user.id;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await kv.get<User>(["user", id]);
    return user.value ?? null;
  }

  async getUserByEmail(email: string): Promise<string | null> {
    const userId = await kv.get<string>(["userByEmail", email]);
    if (!userId.value) return null;

    return userId.value;
  }

  async passwordCheck(
    id: string,
    password: string,
  ): Promise<boolean> {
    const userData = await kv.get<User>(["user", id]);
    if (!userData.value) return false;

    const isPasswordValid = await bcrypt.compare(
      password,
      userData.value.password,
    );

    if (!isPasswordValid) return false;

    return isPasswordValid;
  }

  async updateUser(id: string, updatedData: Partial<User>): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, ...updatedData };
    await kv.set(["user", id], updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    await kv.delete(["user", id]);
  }

  async getAllUsers(): Promise<User[]> {
    const users: User[] = [];
    for await (const entry of kv.list<User>({ prefix: ["user"] })) {
      users.push(entry.value);
    }
    return users;
  }
}

export const UserModel = new UserModelClass();
