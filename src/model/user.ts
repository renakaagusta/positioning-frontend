export enum UserRole {
  Rider = 'rider',
  Hospital = 'hospital',
  Police = 'police',
  Admin = 'admin',
}

export interface LocationInterface {
  latitude: number;
  longitude: number;
}

export interface UserLocationInterface {
  static: LocationInterface;
  dynamic: LocationInterface;
}

export interface UserMetaInterface {
  location: UserLocationInterface;
}

export interface UserInterface {
  id?: string;
  name: string;
  username: string;
  email: string;
  google?: string;
  password: string;
  meta?: UserMetaInterface;
  role: UserRole;
  createdAt: Date;
}

export default class User implements UserInterface {
  public id?: string;
  public name: string;
  public username: string;
  public email: string;
  public google?: string;
  public password: string;
  public meta?: UserMetaInterface;
  public role: UserRole;
  public createdAt: Date;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.google = user.google;
    this.password = user.password;
    this.meta = user.meta;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }

  public toString() {
    return `{
        id: ${this.id},
        name: ${this.name},
        username: ${this.username},
        email: ${this.email},
        role: ${this.role},
        id: ${this.id},
    }`;
  }
}
