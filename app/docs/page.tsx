import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Code, Database, Palette, ExternalLink } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Documentation
          </h1>
          <p className="text-muted-foreground">
            Technical documentation for the Flex Living Reviews Dashboard
          </p>
        </div>

        <div className="space-y-8">
          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technology Stack
              </CardTitle>
              <CardDescription>
                Core technologies and frameworks used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Frontend</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary">Next.js 15</Badge>
                    <Badge variant="secondary">React 19</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">UI/UX</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">shadcn/ui</Badge>
                    <Badge variant="secondary">Lucide Icons</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">State Management</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary">React Hooks</Badge>
                    <Badge variant="secondary">Local Storage</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">API</h4>
                  <div className="space-y-1">
                    <Badge variant="secondary">Next.js API Routes</Badge>
                    <Badge variant="secondary">REST API</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                Available API routes and their functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/api/reviews/hostaway</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fetches normalized review data from Hostaway integration
                    (mocked)
                  </p>
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium">
                      Response Structure
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {`{
  "status": "success",
  "data": {
    "reviews": [...],
    "summary": {
      "totalReviews": number,
      "averageRating": number,
      "reviewsByChannel": {...},
      "reviewsByListing": [...]
    }
  }
}`}
                    </pre>
                  </details>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/api/reviews/google</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Google Reviews integration (mocked - see implementation
                    notes below)
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/api/reviews/combined</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Combined data from all review sources with unified format
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Decisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Decisions
              </CardTitle>
              <CardDescription>
                Key architectural and UX decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Component Architecture</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      Modular component structure with clear separation of
                      concerns
                    </li>
                    <li>
                      Reusable UI components from shadcn/ui for consistency
                    </li>
                    <li>
                      Server and client components optimized for performance
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      Local state management for approval status (no database
                      required)
                    </li>
                    <li>
                      Normalized data structure for consistent handling across
                      sources
                    </li>
                    <li>
                      Fallback rating calculation for reviews without overall
                      ratings
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User Experience</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      Manager dashboard with comprehensive filtering and search
                    </li>
                    <li>
                      Property-specific review display matching rental site
                      patterns
                    </li>
                    <li>Visual approval status with clear action buttons</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Reviews Implementation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Google Reviews Integration
              </CardTitle>
              <CardDescription>
                Feasibility analysis and implementation findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Current Status: Mocked Implementation</AlertTitle>
                <AlertDescription>
                  Google Reviews integration is currently mocked due to API
                  limitations and requirements.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Technical Limitations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      <strong>Google Places API:</strong> Limited to 5 reviews
                      maximum, no pagination
                    </li>
                    <li>
                      <strong>Google My Business API:</strong> Requires 2-4
                      weeks approval process
                    </li>
                    <li>
                      <strong>Business Verification:</strong> Must own/manage
                      the Google Business Profile
                    </li>
                    <li>
                      <strong>Rate Limits:</strong> Strict quotas on API
                      requests
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Production Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Google Cloud Platform project with billing enabled</li>
                    <li>Google My Business API access approval</li>
                    <li>Verified ownership of business locations</li>
                    <li>OAuth 2.0 authentication setup</li>
                    <li>
                      Proper error handling for rate limits and API failures
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Alternative Solutions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      <strong>Third-party services:</strong> Featurable,
                      EmbedSocial, ReviewTrackers
                    </li>
                    <li>
                      <strong>Web scraping:</strong> Against Google's ToS, not
                      recommended
                    </li>
                    <li>
                      <strong>Manual import:</strong> CSV/JSON upload for
                      existing reviews
                    </li>
                    <li>
                      <strong>Widget embedding:</strong> Google Reviews widget
                      for display only
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Current Mock Implementation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The current system includes a mock Google Reviews API that
                    demonstrates:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mt-2">
                    <li>Data normalization from Google's review format</li>
                    <li>Rating scale conversion (1-5 to 0-10 if needed)</li>
                    <li>
                      Integration with the unified review management system
                    </li>
                    <li>Proper error handling and fallback mechanisms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Local Development Setup</CardTitle>
              <CardDescription>
                Steps to run the project locally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Prerequisites</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Node.js 18+ installed</li>
                    <li>pnpm package manager (recommended)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Installation</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {`# Clone the repository
git clone <repository-url>
cd reviews-dashboard

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
