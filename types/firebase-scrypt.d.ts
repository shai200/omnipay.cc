declare module 'firebase-scrypt' {
  export interface FirebaseScryptOptions {
    memCost: number;
    rounds: number;
    saltSeparator: string;
    signerKey: string;
  }

  export class FirebaseScrypt {
    constructor(options: FirebaseScryptOptions);
    hash(password: string, salt: string): Promise<string>;
    verify(password: string, salt: string, hashedPassword: string): Promise<boolean>;
  }
}
