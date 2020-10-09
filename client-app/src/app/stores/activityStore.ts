import { observable, action, makeObservable, computed, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

class ActivityStore {
  activityRegistry = new Map();
  activities: IActivity[] = [];
  selectedActivity: IActivity | undefined;
  loadingInitial = false;
  editMode = false;
  submitting = false;
  target = '';

  constructor() {
    makeObservable(this, {
      activityRegistry: observable,
      activities: observable,
      selectedActivity: observable,
      loadingInitial: observable,
      loadActivities: action,
      createActivity: action,
      editActivity: action,
      deleteActivity: action,
      selectActivity: action,
      editMode: observable,
      submitting: observable,
      target: observable,
      openCreateForm: action,
      openEditForm: action,
      cancelSelectedActivity: action,
      cancelFormOpen: action,
      activitiesByDate: computed
    })
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  };

  loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      })
      console.log(error);
    }
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      })
      console.log(error);
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      })
      console.log(error);
    }
  }

  deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = '';
      })
      console.log(error);
    }
  }

  openCreateForm = () => {
    this.selectedActivity = undefined;
    this.editMode = true;
  }

  openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  cancelFormOpen = () => {
    this.editMode = false;
  }

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore())