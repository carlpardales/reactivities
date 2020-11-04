import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { history } from "../..";
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
      login: action,
      logout: action,
      getUser: action,
      register: action
    })
  }

  get isLoggedIn() { return !!this.user };

  login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    }
    catch (error) {
      throw error;
    }
  }

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  }

  getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      })
    } catch (error) {
      console.log(error);
    }
  }

  register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  }
};