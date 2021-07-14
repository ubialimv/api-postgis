export default interface DatabaseInterface {
  start(): Promise<void>;
  close(): Promise<void>;
}
