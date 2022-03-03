declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOSTNAME: string;
    }
  }
}
