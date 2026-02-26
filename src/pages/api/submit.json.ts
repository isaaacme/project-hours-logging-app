import type { APIRoute } from 'astro';
import { appConfig } from '../../config/app.config';
import { fireberryClient } from '../../lib/fireberry';

interface SubmitPayload {
  projectId: string;
  projectName: string;
  date: string;
  hours: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!appConfig.features.enableSubmit) {
      return new Response(JSON.stringify({ 
        error: 'Submit feature is disabled' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json() as SubmitPayload;

    // Server-side validation
    const validationErrors = validateSubmission(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed',
        details: validationErrors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Submit to Fireberry or mock
    const result = appConfig.api.mockMode 
      ? await mockSubmit(body)
      : await fireberryClient.submitHours(body);

    return new Response(JSON.stringify({ 
      success: true,
      message: appConfig.labels.success,
      data: result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Submit API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to submit hours',
      message: appConfig.features.enableDebugLogging ? errorMessage : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function validateSubmission(data: SubmitPayload): string[] {
  const errors: string[] = [];
  const validation = appConfig.validation;

  // Validate project
  if (validation.project.required && (!data.projectId || !data.projectName)) {
    errors.push('Project is required');
  }

  // Validate date
  if (validation.date.required && !data.date) {
    errors.push('Date is required');
  } else if (data.date && !isValidDate(data.date)) {
    errors.push('Invalid date format');
  }

  // Validate hours
  if (validation.hours.required && (data.hours === null || data.hours === undefined)) {
    errors.push('Hours are required');
  } else if (typeof data.hours !== 'number') {
    errors.push('Hours must be a number');
  } else if (data.hours < validation.hours.min) {
    errors.push(`Hours must be at least ${validation.hours.min}`);
  } else if (data.hours > validation.hours.max) {
    errors.push(`Hours must not exceed ${validation.hours.max}`);
  } else if (!validation.hours.allowDecimals && !Number.isInteger(data.hours)) {
    errors.push('Decimals are not allowed for hours');
  } else if (validation.hours.allowDecimals) {
    const decimalPlaces = getDecimalPlaces(data.hours);
    if (decimalPlaces > validation.hours.decimalPlaces) {
      errors.push(`Hours cannot have more than ${validation.hours.decimalPlaces} decimal places`);
    }
  }

  return errors;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

function getDecimalPlaces(num: number): number {
  const str = num.toString();
  if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
    return str.split('.')[1].length;
  } else if (str.indexOf('e-') !== -1) {
    const parts = str.split('e-');
    const decimals = parseInt(parts[1], 10);
    return decimals;
  }
  return 0;
}

async function mockSubmit(data: SubmitPayload): Promise<{ success: boolean; id?: string }> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (appConfig.features.enableDebugLogging) {
    console.log('Mock submission:', data);
  }

  return {
    success: true,
    id: `mock-${Date.now()}`,
  };
}
