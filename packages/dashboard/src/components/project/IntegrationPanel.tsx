import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import type { ProjectIntegrationInfo } from '../../api/projects.api';

interface IntegrationPanelProps {
  integration: ProjectIntegrationInfo;
}

export function IntegrationPanel({ integration }: IntegrationPanelProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    toast({
      title: "Copied to clipboard",
      description: "You can now paste it into your code.",
    });
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const codeSnippetCostShield = `import CostShield from "@costshield/sdk"

const cs = new CostShield({
  apiKey: "${integration.api_key_prefix}••••••••"
})

cs.track({
  cost: 100,
  featureId: "chat"
})`;

  const codeSnippetCurl = `curl -X POST https://your-domain${integration.api_endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "${integration.api_key_prefix}••••••••",
    "cost": 100,
    "featureId": "chat"
  }'`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Terminal className="mr-2 h-4 w-4" /> Integrate CostShield
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Integrate CostShield</DialogTitle>
          <DialogDescription>Start tracking API costs in minutes.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
        {/* API Key Prefix */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            1. Your API Key
          </label>
          <p className="text-sm text-muted-foreground mb-2">
            This is your project API key prefix. The full key was shown when the project was created.
          </p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-4 py-2 rounded-md bg-muted text-sm font-mono border border-slate-200 dark:border-slate-800">
              {integration.api_key_prefix}••••••••
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy('prefix', integration.api_key_prefix)}
              className="h-9 shrink-0"
            >
              {copiedStates['prefix'] ? (
                <><Check className="mr-2 h-4 w-4 text-emerald-500" /> Copied</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" /> Copy Prefix</>
              )}
            </Button>
          </div>
        </div>

        {/* SDK Installation */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">2. Install the SDK</label>
          <div className="relative group rounded-md bg-muted border border-slate-200 dark:border-slate-800">
            <div className="flex items-center p-3">
              <Terminal className="h-4 w-4 text-muted-foreground mr-3" />
              <code className="text-sm font-mono flex-1 overflow-x-auto whitespace-nowrap">
                {integration.sdk_install}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('sdk', integration.sdk_install)}
                className="h-8 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedStates['sdk'] ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Start snippet */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">3. Quick Start Example</label>
          <div className="relative group rounded-md bg-muted border border-slate-200 dark:border-slate-800 p-4">
            <pre className="text-sm font-mono overflow-x-auto whitespace-pre">
              {codeSnippetCostShield}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('snippet1', codeSnippetCostShield)}
              className="h-8 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedStates['snippet1'] ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            </Button>
          </div>
        </div>

        {/* REST API Example */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Or use the REST API</label>
          <div className="relative group rounded-md bg-muted border border-slate-200 dark:border-slate-800 p-4">
            <pre className="text-sm font-mono overflow-x-auto whitespace-pre">
              {codeSnippetCurl}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('snippet2', codeSnippetCurl)}
              className="h-8 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedStates['snippet2'] ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground">
            Need more help?{' '}
            <Link to="/docs" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              View full documentation →
            </Link>
          </p>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
