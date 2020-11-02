import { action, computed, makeObservable, observable } from "mobx";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
  user: IUser | null = null;

  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      user: observable,
      isLoggedIn: computed,
      login: action
    })
  }

  get isLoggedIn() { return !!this.user };

  login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      this.user = user;
    }
    catch (error) {
      console.log(error);
    }
  }
};