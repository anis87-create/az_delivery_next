declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: string;
        restaurant?: {
          _id: string
        }
      };
    }
  }
}

export {};
