import { BalanceResponse, PaginatedFinancialMutationResponse, UserResponse } from "@sudosos/sudosos-client";
import { ApiService } from "../services/ApiService";
interface CurrentState {
    balance: BalanceResponse | null;
    user: UserResponse | null;
    financialMutations: PaginatedFinancialMutationResponse;
}
interface UserModuleState {
    users: UserResponse[];
    current: CurrentState;
}
export declare const useUserStore: import("pinia").StoreDefinition<"user", UserModuleState, {
    getUserById: (state: UserModuleState) => (userId: number) => UserResponse | undefined;
    getActiveUsers(): UserResponse[];
    getDeletedUsers(): UserResponse[];
    getCurrentUser(): CurrentState;
}, {
    fetchUsers(service: ApiService): Promise<void>;
    fetchCurrentUserBalance(id: number, service: ApiService): Promise<void>;
    fetchUsersFinancialMutations(id: number, service: ApiService): Promise<void>;
    setCurrentUser(user: UserResponse): void;
    addUser(user: UserResponse): void;
    clearCurrent(): void;
    deleteUser(id: number): void;
}>;
export {};
