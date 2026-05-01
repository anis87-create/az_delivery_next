declare global {
  namespace Express {
    interface User {
      _id: string;
      role: string;
      restaurant?: { _id: string };
    }
  }
}

export {};
