import { createPinia, defineStore } from 'pinia';
import {
  BalanceResponse, FinancialMutationResponse, PaginatedFinancialMutationResponse,
  UserResponse
} from "@sudosos/sudosos-client";
import { ApiService } from "../services/ApiService";
import { fetchAllPages } from "../helpers/PaginationHelper";

const pinia = createPinia();

interface CurrentState {
  balance: BalanceResponse | null,
  user: UserResponse | null,
  financialMutations: PaginatedFinancialMutationResponse
}
interface UserModuleState {
  users: UserResponse[];
  current: CurrentState
}

export const useUserStore = defineStore('user', {
  state: (): UserModuleState => ({
    users: [],
    current: {
      balance: null,
      user: null,
      financialMutations: {
        _pagination: {},
        records: [],
      }
    },
  }),
  getters: {
    getUserById: (state: UserModuleState) => {
      return (userId: number) => state.users.find((user) => user.id === userId)
    },
    getActiveUsers(): UserResponse[] {
      return this.users.filter((user) => user.active);
    },
    getDeletedUsers(): UserResponse[] {
      return this.users.filter((user) => user.deleted);
    },
    getCurrentUser(): CurrentState {
      return this.current;
    },
  },
  actions: {
    async fetchUsers(service: ApiService) {
      // @ts-ignore TODO Fix Swagger
      this.users = await fetchAllPages<UserResponse>(0, 500, (take, skip) => service.user.getAllUsers(take, skip));
    },
    async fetchCurrentUserBalance(id: number, service: ApiService) {
      this.current.balance = (await service.balance.getBalanceId(id)).data
    },
    async fetchUsersFinancialMutations(id: number, service: ApiService) {
      this.current.financialMutations = (await service.user.getUsersFinancialMutations(id)).data;
    },
    setCurrentUser(user: UserResponse) {
      this.current.user = user;
    },
    addUser(user: UserResponse) {
      this.users.push(user);
    },
    clearCurrent() {
      this.current.balance = undefined;
      this.current.user = undefined;
    },
    deleteUser(id: number) {
      const index = this.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    },
  },
});
