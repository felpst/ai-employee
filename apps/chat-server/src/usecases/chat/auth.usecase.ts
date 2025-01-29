import { User } from "@cognum/models";
import jwt from 'jsonwebtoken';
import { ConnectionClose } from "../websocket/connection-close.usecase";
import { Connection } from "../websocket/connection.usecase";
import { AuthConfirm } from "./auth-confirm";

export interface AuthData {
  token: string;
}

export class Auth {

  constructor(
    private connectionClose: ConnectionClose,
    private authConfirm: AuthConfirm,
  ) { }

  async execute(conn: Connection, data: AuthData) {
    const { userId } = this.verifyToken(data.token);
    const user = await this.loadUser(userId);

    // Set user
    conn.setUser(user);

    // Auth confirm
    this.authConfirm.execute(conn, user);
  }

  private verifyToken(token: string): { userId: string } {
    const decodedToken = jwt.verify(
      token,
      process.env.AUTH_SECRET_KEY
    );
    return decodedToken as { userId: string };
  }

  private async loadUser(userId: string) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

}
