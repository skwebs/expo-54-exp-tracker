import * as Application from 'expo-application';
import { Platform } from 'react-native';

export const ANDROID_ID = Platform.OS === 'android' ? Application.getAndroidId() : null;
export const baseUrl = process.env.EXPO_PUBLIC_API_URL;
if (!baseUrl) {
    throw new Error('EXPO_PUBLIC_API_URL environment variable is required');
}
export const BASE_URL = baseUrl;
export const API_URL = `${BASE_URL}/api`;
// export const API_URL = 'http://192.168.1.9:8000/api';
