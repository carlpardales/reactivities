import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  modal = {
    open: false,
    body: null
  }

  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      modal: observable.shallow,
      openModal: action,
      closeModal: action
    });
  }

  openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  }

  closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  }
}