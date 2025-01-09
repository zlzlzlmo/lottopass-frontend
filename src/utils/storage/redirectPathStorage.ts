import BaseStorage from "./baseStorage";

export class RedirectPathStorage extends BaseStorage<string> {
  constructor() {
    super("redirectPath");
  }
}
