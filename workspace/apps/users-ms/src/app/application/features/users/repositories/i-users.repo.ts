import { IBaseRepo } from "@vanguard-nx/core";
import { User } from "../domain";

export const USER_REPO = 'IUserRepo'


export interface IUserRepo extends IBaseRepo<User, string> { }
