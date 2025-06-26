import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Types for queued requests
export interface QueuedRequest {
	resolve: (value: AxiosResponse) => void;
	reject: (error: any) => void;
	config: InternalAxiosRequestConfig;
} 