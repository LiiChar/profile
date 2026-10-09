// Keep a single translation implementation for both Server and Client Components.
// The client component reads the locale dictionary from DictionaryProvider, which
// avoids relying on request headers during static generation.
export { Text } from './text-client';
