#!/usr/bin/env node

// Load environment from multiple locations
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Try loading .env from various locations
config({ path: join(__dirname, '..', '.env') });
config({ path: join(__dirname, '..', '..', '..', '.env') });
config({ path: join(process.cwd(), '.env') });

// Import and run CLI
import('../dist/index.js');
