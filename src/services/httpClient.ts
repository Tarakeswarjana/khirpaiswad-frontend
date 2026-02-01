// HTTP Client configuration and API call handler
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

interface ApiErrorResponse {
  status: number;
  message: string;
  data?: unknown;
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let status = 0;
    let message = 'An unexpected error occurred';
    let data: unknown = null;

    if (error && typeof error === 'object') {
      if ('response' in error && error.response) {
        const response = error.response as { status: number; data: unknown };
        status = response.status;
        data = response.data;
        if (response.data && typeof response.data === 'object' && 'message' in response.data) {
          message = (response.data as { message: string }).message;
        }
      }
      if ('message' in error) {
        message = (error as { message: string }).message;
      }
    }

    const apiError: ApiErrorResponse = {
      status,
      message,
      data,
    };
    return Promise.reject(apiError);
  }
);

// HTTP request method
async function request<T = unknown>(
  endpoint: string,
  options: Record<string, unknown> = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
    });

    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    };
  } catch (error) {
    // Handle thrown API errors
    if (typeof error === 'object' && error !== null && 'status' in error) {
      throw error;
    }

    // Handle other errors
    if (error instanceof Error) {
      const apiError: ApiErrorResponse = {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        data: null,
      };
      throw apiError;
    }

    throw {
      status: 0,
      message: 'An unexpected error occurred',
      data: error,
    };
  }
}

// GET request
export async function httpGet<T = unknown>(endpoint: string): Promise<T> {
  try {
    const response = await request<T>(endpoint, { method: 'GET' });
    return response.data;
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error);
    throw error;
  }
}

// POST request
export async function httpPost<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  try {
    const response = await request<T>(endpoint, {
      method: 'POST',
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error(`POST ${endpoint} failed:`, error);
    throw error;
  }
}

// PUT request
export async function httpPut<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  try {
    const response = await request<T>(endpoint, {
      method: 'PUT',
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT ${endpoint} failed:`, error);
    throw error;
  }
}

// PATCH request
export async function httpPatch<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  try {
    const response = await request<T>(endpoint, {
      method: 'PATCH',
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH ${endpoint} failed:`, error);
    throw error;
  }
}

// DELETE request
export async function httpDelete<T = unknown>(endpoint: string): Promise<T> {
  try {
    const response = await request<T>(endpoint, { method: 'DELETE' });
    return response.data;
  } catch (error) {
    console.error(`DELETE ${endpoint} failed:`, error);
    throw error;
  }
}

// Error handler utility
export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiErrorResponse).message;
  }
  return 'An unexpected error occurred';
}

export type { ApiResponse, ApiErrorResponse };
export { BASE_URL, axiosInstance };
