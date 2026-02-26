import type { APIRoute } from 'astro';
import { appConfig } from '../../config/app.config';
import { fireberryClient } from '../../lib/fireberry';
import { getMockProjects } from '../../config/mock-projects';
import type { Project } from '../../config/mock-projects';

export const GET: APIRoute = async ({ request }) => {
  try {
    const projects: Project[] = appConfig.api.mockMode 
      ? await getMockProjects()
      : await fireberryClient.getProjects();

    return new Response(JSON.stringify({ projects }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Projects API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch projects',
      message: appConfig.features.enableDebugLogging ? errorMessage : 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
