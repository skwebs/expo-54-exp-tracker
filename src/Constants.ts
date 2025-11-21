import * as Application from 'expo-application';
import { Platform } from 'react-native';

export const ANDROID_ID = Platform.OS === 'android' ? Application.getAndroidId() : null;
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL = `${BASE_URL}/api`;
// export const API_URL = 'http://192.168.1.9:8000/api';
