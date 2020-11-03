import { action, makeObservable, observable, reaction } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
  token: string | null = window.localStorage.getItem('jwt');
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

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    )
  }

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
};