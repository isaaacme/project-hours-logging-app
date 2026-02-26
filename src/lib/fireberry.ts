import { appConfig } from '../config/app.config';
import type { Project } from '../config/mock-projects';

interface FireberryProject {
  [key: string]: any;
}

interface FireberryResponse {
  data?: FireberryProject[];
  results?: FireberryProject[];
  items?: FireberryProject[];
}

export class FireberryError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'FireberryError';
  }
}

export class FireberryClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.FIREBERRY_BASE_URL || '';
    this.apiKey = process.env.FIREBERRY_API_KEY || '';
    this.timeout = appConfig.api.timeout;

    if (!this.baseUrl || !this.apiKey) {
      if (appConfig.features.enableDebugLogging) {
        console.warn('Fireberry credentials not configured');
      }
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.baseUrl || !this.apiKey) {
      throw new FireberryError('Fireberry credentials not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
      
      if (appConfig.features.enableDebugLogging) {
        console.log(`Fireberry request: ${url}`);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new FireberryError(
          `Fireberry API error: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      
      if (appConfig.features.enableDebugLogging) {
        console.log('Fireberry response:', data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof FireberryError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new FireberryError('Fireberry request timeout');
      }
      
      throw new FireberryError(`Fireberry request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private normalizeProject(fireberryProject: FireberryProject): Project | null {
    try {
      const config = appConfig.fireberry;
      
      const id = fireberryProject[config.projectIdField];
      const name = fireberryProject[config.projectNameField];
      const status = fireberryProject[config.projectStatusField];

      if (!id || !name) {
        if (appConfig.features.enableDebugLogging) {
          console.warn('Project missing required fields:', fireberryProject);
        }
        return null;
      }

      // Filter by active status if configured
      if (config.activeStatusValue && status !== config.activeStatusValue) {
        return null;
      }

      return {
        id: String(id),
        name: String(name),
      };
    } catch (error) {
      if (appConfig.features.enableDebugLogging) {
        console.error('Error normalizing project:', error);
      }
      return null;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const config = appConfig.fireberry;
      const endpoint = `${config.objectName}?orderby=${config.sortBy} ${config.sortOrder}`;
      
      const response: FireberryResponse = await this.makeRequest(endpoint);
      
      // Handle different response structures
      const projects = response.data || response.results || response.items || [];
      
      if (!Array.isArray(projects)) {
        throw new FireberryError('Invalid Fireberry response structure');
      }

      const normalizedProjects = projects
        .map(project => this.normalizeProject(project))
        .filter((project): project is Project => project !== null);

      return normalizedProjects;
    } catch (error) {
      if (error instanceof FireberryError) {
        throw error;
      }
      throw new FireberryError(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async submitHours(data: {
    projectId: string;
    projectName: string;
    date: string;
    hours: number;
  }): Promise<{ success: boolean; id?: string }> {
    // This would be implemented based on Fireberry's actual API
    // For now, we'll simulate a successful submission
    if (appConfig.features.enableDebugLogging) {
      console.log('Submitting hours to Fireberry:', data);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      id: `submission-${Date.now()}`,
    };
  }
}

export const fireberryClient = new FireberryClient();
