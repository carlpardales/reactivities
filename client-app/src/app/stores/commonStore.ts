import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
  token: string | null = null;
  appLoaded = false;

  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      token: observable,
      appLoaded: observable,
      setToken: action,
      setAppLoaded: action
    })
  }

  setToken = (token: string | null) => {
    window.localStorage.setItem('jwt', token!);
    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
};